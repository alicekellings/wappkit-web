import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { getRequestIpFromHeaders } from "@/lib/creem";
import { serializeError } from "@/lib/error-utils";
import {
  bindDeviceToLicenseKey,
  createLicenseRecordFromCreemCheckout,
  findLicenseKeyRecord,
  flattenLicenseRecordEntries,
  getLicenseStore,
  normalizeDeviceId,
  type CreemCheckoutPayload,
  type LicenseKeyRecord,
  type LicenseRecord,
} from "@/lib/licenses";
import { applyRateLimit, buildRateLimitKey } from "@/lib/rate-limit";
import { getToolBySlug, isFreeTool } from "@/lib/tools";
import { createLicenseToken } from "@/lib/license-token";
import { z } from "zod";

// 免费工具的"零摩擦"激活：桌面端首次启动静默请求一个免费 key。
// 约束：
// - 只服务 isFreeTool 的工具（付费产品的 key 永远走 Creem 结算或后台手工发）
// - 一台设备一个 key：重复请求返回已绑定的那把，绝不发第二把
// - 按 IP 限流，防止脚本刷 key
const AUTO_ACTIVATE_RATE_LIMIT = {
  windowMs: 24 * 60 * 60 * 1000,
  limit: 5,
};

const autoActivateSchema = z.object({
  toolSlug: z.preprocess(
    (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
    z.string().min(1).max(80),
  ),
  deviceId: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .regex(/^hwid_[0-9a-f]{64}$/, "Invalid device id."),
  ),
  deviceName: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().min(1).max(120),
  ),
});

function randomKeyPart(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(length);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function autoLicenseKeyPrefix(toolSlug: string) {
  if (toolSlug === "leadharvester") {
    return "WAPPKIT-LH";
  }

  return "WAPPKIT-AUTO";
}

function respondWithKey(
  license: LicenseKeyRecord,
  record: LicenseRecord,
  deviceName: string,
) {
  const productName = record.productName;
  const signed = createLicenseToken({
    licenseKey: license.key,
    toolSlug: record.toolSlug,
    orderId: record.orderId,
    productName,
    deviceId: license.boundDevice?.deviceId ?? "",
  });

  return NextResponse.json({
    valid: true,
    message: "Free license activated.",
    data: {
      licenseKey: license.key,
      status: license.status,
      tier: "premium",
      toolSlug: record.toolSlug,
      productName,
      email: record.customerEmail,
      boundDevice: license.boundDevice,
      deviceName,
      licenseToken: signed?.token ?? null,
      tokenExpiresAt: signed?.expiresAt ?? null,
      features: signed?.features ?? [],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getRequestIpFromHeaders(request.headers);
    const rateLimit = await applyRateLimit({
      key: buildRateLimitKey("license-auto-activate", ipAddress),
      limit: AUTO_ACTIVATE_RATE_LIMIT.limit,
      windowMs: AUTO_ACTIVATE_RATE_LIMIT.windowMs,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "Too many license requests from this connection. Please try again tomorrow.",
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = autoActivateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, message: "Invalid device information." },
        { status: 400 },
      );
    }

    const tool = getToolBySlug(parsed.data.toolSlug);
    if (!tool || !isFreeTool(tool.slug)) {
      // 自动发 key 只开放给免费渠道的工具，付费产品不接受无人值守申请。
      return NextResponse.json(
        { valid: false, message: "This tool does not accept automatic licenses." },
        { status: 403 },
      );
    }

    const deviceId = normalizeDeviceId(parsed.data.deviceId);
    const store = getLicenseStore();

    // 一台设备一把 key：先找这个指纹已绑定的 key（含被禁用的——禁用要拦）。
    const records = await store.listAllRecords();
    const existing = records
      .flatMap((record) =>
        flattenLicenseRecordEntries(record).map((entry) => ({ record, entry })),
      )
      .filter(
        ({ record, entry }) =>
          record.toolSlug === parsed.data.toolSlug &&
          entry.boundDevice &&
          normalizeDeviceId(entry.boundDevice.deviceId) === deviceId,
      );

    if (existing.length > 0) {
      const { record, entry } = existing[0];

      if (entry.status === "disabled") {
        return NextResponse.json(
          {
            valid: false,
            code: "LICENSE_DISABLED",
            message: "This device's license key has been disabled.",
          },
          { status: 403 },
        );
      }

      return respondWithKey(entry, record, parsed.data.deviceName);
    }

    // 新设备：创建记录并立即绑定。
    const now = new Date().toISOString();
    const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
    const licenseKey = `${autoLicenseKeyPrefix(tool.slug)}-${randomKeyPart(5)}-${randomKeyPart(5)}-${randomKeyPart(5)}`;
    const deviceTag = deviceId.slice(5, 21);

    const checkoutPayload: CreemCheckoutPayload = {
      id: `ch_auto_${suffix}`,
      request_id: `req_auto_${suffix}`,
      order: {
        id: `ord_auto_${deviceTag}_${suffix.slice(0, 8)}`,
        customer: {
          id: `cust_auto_${suffix}`,
          email: `auto-license@wappkit.com`,
          name: parsed.data.deviceName,
        },
      },
      product: {
        id: `prod_free_${tool.slug}`,
        name: tool.name,
      },
      metadata: {
        toolSlug: tool.slug,
        source: "auto-free-activation",
        plan: "free",
        createdAt: now,
      },
      license_keys: [
        {
          id: `lic_auto_${suffix}`,
          key: licenseKey,
          status: "inactive",
        },
      ],
    };

    const created = createLicenseRecordFromCreemCheckout(checkoutPayload);
    const updated = bindDeviceToLicenseKey(created, licenseKey, {
      deviceId,
      deviceName: parsed.data.deviceName,
    });

    if (!updated) {
      return NextResponse.json(
        { valid: false, message: "License could not be bound to this device." },
        { status: 500 },
      );
    }

    const record = updated;

    await store.save(record);

    const license = findLicenseKeyRecord(record, licenseKey);
    if (!license) {
      return NextResponse.json(
        { valid: false, message: "License could not be persisted." },
        { status: 500 },
      );
    }

    return respondWithKey(license, record, parsed.data.deviceName);
  } catch (error) {
    console.error("[license/auto-activate] unexpected failure", {
      error: serializeError(error),
    });

    return NextResponse.json(
      {
        valid: false,
        message:
          "We could not issue a license right now. The tool keeps working in free mode - try again later.",
      },
      { status: 500 },
    );
  }
}

function getRequestIpFromHeadersSafe(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
