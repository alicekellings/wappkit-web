import { NextRequest, NextResponse } from "next/server";

import { getRequestIpFromHeaders } from "@/lib/creem";
import {
  findLicenseKeyRecord,
  getDeviceTransferEligibility,
  getLicenseStore,
  normalizeDeviceId,
  unbindDeviceFromLicenseKey,
} from "@/lib/licenses";
import { applyRateLimit, buildRateLimitKey } from "@/lib/rate-limit";
import { licenseDeactivateSchema } from "@/lib/validations/license";

const LICENSE_DEACTIVATE_RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  limit: 10,
};

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getRequestIpFromHeaders(request.headers);
    const rateLimit = await applyRateLimit({
      key: buildRateLimitKey("license-deactivate", ipAddress),
      limit: LICENSE_DEACTIVATE_RATE_LIMIT.limit,
      windowMs: LICENSE_DEACTIVATE_RATE_LIMIT.windowMs,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many deactivation attempts from this connection. Please wait a few minutes and try again.",
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
    const parsed = licenseDeactivateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Enter a valid license key and device ID." },
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
        { success: false, message: "This license key could not be matched." },
        { status: 404 },
      );
    }

    const license = findLicenseKeyRecord(record, parsed.data.licenseKey);
    if (!license) {
      return NextResponse.json(
        { success: false, message: "This license key could not be matched." },
        { status: 404 },
      );
    }

    if (!license.boundDevice) {
      return NextResponse.json({
        success: true,
        message: "This license is already not bound to a device.",
        data: {
          licenseKey: license.key,
          status: license.status === "disabled" ? "disabled" : "inactive",
          boundDevice: null,
        },
      });
    }

    if (normalizeDeviceId(license.boundDevice.deviceId) !== normalizeDeviceId(parsed.data.deviceId)) {
      return NextResponse.json(
        {
          success: false,
          code: "DEVICE_MISMATCH",
          message:
            "This device cannot remove the current binding. Use the linked device or the Wappkit license retrieval page.",
          data: {
            boundDevice: license.boundDevice,
          },
        },
        { status: 403 },
      );
    }

    const transfer = getDeviceTransferEligibility(license);
    if (!transfer.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: "DEVICE_TRANSFER_COOLDOWN",
          message:
            "This license can be moved once every 30 days. Use Wappkit License Retrieval after the cooldown date.",
          data: {
            nextTransferAt: transfer.nextTransferAt,
          },
        },
        { status: 409 },
      );
    }

    const updatedRecord = unbindDeviceFromLicenseKey(record, parsed.data.licenseKey);
    if (!updatedRecord) {
      return NextResponse.json(
        { success: false, message: "This license key could not be updated." },
        { status: 500 },
      );
    }

    await store.save(updatedRecord);
    const updatedLicense = findLicenseKeyRecord(updatedRecord, parsed.data.licenseKey);

    return NextResponse.json({
      success: true,
      message:
        "The license is ready to move. Activate the new computer with the same key.",
      data: {
        licenseKey: updatedLicense?.key ?? parsed.data.licenseKey,
        status: updatedLicense?.status ?? "inactive",
        boundDevice: updatedLicense?.boundDevice ?? null,
        lastDeviceTransferAt: updatedLicense?.lastDeviceTransferAt ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove the device binding.",
      },
      { status: 500 },
    );
  }
}
