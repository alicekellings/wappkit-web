import { NextRequest, NextResponse } from "next/server";

import { getRequestIpFromHeaders } from "@/lib/creem";
import {
  bindDeviceToLicenseKey,
  findLicenseKeyRecord,
  getLicenseStore,
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

    if (boundDevice && normalizeDeviceId(boundDevice.deviceId) !== normalizedDeviceId) {
      return NextResponse.json(
        {
          valid: false,
          code: "DEVICE_ALREADY_BOUND",
          message:
            `This license is already linked to "${boundDevice.deviceName}". ` +
            "Remove that device from Wappkit License Retrieval before activating a new computer.",
          data: {
            status: license.status,
            toolSlug: record.toolSlug,
            boundDevice,
          },
        },
        { status: 409 },
      );
    }

    const updatedRecord = bindDeviceToLicenseKey(record, parsed.data.licenseKey, {
      deviceId: parsed.data.deviceId,
      deviceName: parsed.data.deviceName,
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

    const productName = getDisplayProductName(record.toolSlug, record.productName);
    const signedLicense = createLicenseToken({
      licenseKey: updatedLicense.key,
      toolSlug: record.toolSlug,
      orderId: record.orderId,
      productName,
      deviceId: parsed.data.deviceId,
    });

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
          licenseToken: signedLicense?.token ?? null,
          tokenExpiresAt: signedLicense?.expiresAt ?? null,
          features: signedLicense?.features ?? ["premium"],
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
    return NextResponse.json(
      {
        valid: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to validate license.",
      },
      { status: 500 },
    );
  }
}
