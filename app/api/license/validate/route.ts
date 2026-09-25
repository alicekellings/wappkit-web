import { NextRequest, NextResponse } from "next/server";

import { getRequestIpFromHeaders } from "@/lib/creem";
import { serializeError } from "@/lib/error-utils";
import {
  bindDeviceToLicenseKey,
  findLicenseKeyRecord,
  getDeviceTransferEligibility,
  getLicenseStore,
  isHardwareDeviceId,
  isLegacyDeviceId,
  normalizeDeviceId,
} from "@/lib/licenses";
import { applyRateLimit, buildRateLimitKey } from "@/lib/rate-limit";
import { getDisplayProductName } from "@/lib/tools";
import { licenseValidateSchema } from "@/lib/validations/license";
import { createLicenseToken } from "@/lib/license-token";

const LICENSE_VALIDATE_RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  limit: 20,
};

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getRequestIpFromHeaders(request.headers);
    const rateLimit = await applyRateLimit({
      key: buildRateLimitKey("license-validate", ipAddress),
      limit: LICENSE_VALIDATE_RATE_LIMIT.limit,
      windowMs: LICENSE_VALIDATE_RATE_LIMIT.windowMs,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "Too many validation attempts from this connection. Please wait a few minutes and try again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }

    const body = await request.json();
    const parsed = licenseValidateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          valid: false,
          message: "Enter a valid license key.",
        },
        { status: 400 },
      );
    }

    const store = getLicenseStore();
    const record = await store.findByLicenseKey({
      licenseKey: parsed.data.licenseKey,
      toolSlug: parsed.data.toolSlug,
    });

    if (!record) {
      return NextResponse.json(
        {
          valid: false,
          message: "This license key could not be matched.",
        },
        { status: 404 },
      );
    }

    const license = findLicenseKeyRecord(record, parsed.data.licenseKey);

    if (!license) {
      return NextResponse.json(
        {
          valid: false,
          message: "This license key could not be matched.",
        },
        { status: 404 },
      );
    }

    if (license.status === "disabled") {
      return NextResponse.json(
        {
          valid: false,
          code: "LICENSE_DISABLED",
          message: "This license key has been disabled.",
          data: {
            status: license.status,
            toolSlug: record.toolSlug,
          },
        },
        { status: 403 },
      );
    }

    const normalizedDeviceId = normalizeDeviceId(parsed.data.deviceId);
    const boundDevice = license.boundDevice;

    // 老客户端升级迁移（2026-09-25，配合桌面端 v1.0.2 的 P0-2 改造）
    //
    // v1.0.1 及更早上报的是随机 UUID（device_ + 32 位十六进制），用户删掉
    // config.json 就能重置设备、同一个 key 无限换机；v1.0.2 起改为硬件指纹
    // （hwid_ + 64 位十六进制）。老用户第一次用新版激活时绑定必然对不上，
    // 这里允许一次性迁移到硬件指纹，并写入 lastDeviceTransferAt 启动冷却期，
    // 之后仍受 30 天换机限制。
    const migratingToHardwareId =
      !!boundDevice &&
      isLegacyDeviceId(boundDevice.deviceId) &&
      isHardwareDeviceId(normalizedDeviceId) &&
      getDeviceTransferEligibility(license).allowed;

    if (
      boundDevice &&
      normalizeDeviceId(boundDevice.deviceId) !== normalizedDeviceId &&
      !migratingToHardwareId
    ) {
      return NextResponse.json(
        {
          valid: false,
          code: "DEVICE_ALREADY_BOUND",
          message:
            `This license is already linked to "${boundDevice.deviceName}". ` +
            "Move the license from Wappkit License Retrieval before activating a new computer. " +
            "Device moves are available once every 30 days.",
          data: {
            status: license.status,
            toolSlug: record.toolSlug,
            boundDevice,
          },
        },
        { status: 409 },
      );
    }

    const productName = getDisplayProductName(record.toolSlug, record.productName);
    const signedLicense = createLicenseToken({
      licenseKey: license.key,
      toolSlug: record.toolSlug,
      orderId: record.orderId,
      productName,
      deviceId: parsed.data.deviceId,
    });

    if (!signedLicense) {
      return NextResponse.json(
        {
          valid: false,
          code: "LICENSE_SIGNING_UNAVAILABLE",
          message:
            "License activation is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }

    const updatedRecord = bindDeviceToLicenseKey(record, parsed.data.licenseKey, {
      deviceId: parsed.data.deviceId,
      deviceName: parsed.data.deviceName,
      recordDeviceTransfer: migratingToHardwareId,
    });

    if (!updatedRecord) {
      return NextResponse.json(
        {
          valid: false,
          message: "This license key could not be updated.",
        },
        { status: 500 },
      );
    }

    await store.save(updatedRecord);
    const updatedLicense = findLicenseKeyRecord(updatedRecord, parsed.data.licenseKey);

    if (!updatedLicense) {
      return NextResponse.json(
        {
          valid: false,
          message: "This license key could not be updated.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        valid: true,
        message: "License validated successfully.",
        data: {
          licenseKey: updatedLicense.key,
          status: updatedLicense.status,
          tier: "premium",
          orderId: record.orderId,
          toolSlug: record.toolSlug,
          productName,
          email: record.customerEmail,
          boundDevice: updatedLicense.boundDevice,
          licenseToken: signedLicense.token,
          tokenExpiresAt: signedLicense.expiresAt,
          features: signedLicense.features,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  } catch (error) {
    // 不要把底层 error.message 回传给客户端 —— 里面可能带出 Upstash 主机名、
    // 内部键名或上游响应片段等信息。细节只写服务端日志。
    console.error("[license/validate] unexpected failure", {
      error: serializeError(error),
    });

    return NextResponse.json(
      {
        valid: false,
        message:
          "We could not validate this license right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
