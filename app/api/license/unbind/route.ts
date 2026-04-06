import { NextRequest, NextResponse } from "next/server";

import { getRequestIpFromHeaders } from "@/lib/creem";
import {
  findLicenseKeyRecord,
  getLicenseStore,
  unbindDeviceFromLicenseKey,
} from "@/lib/licenses";
import { applyRateLimit, buildRateLimitKey } from "@/lib/rate-limit";
import { licenseUnbindSchema } from "@/lib/validations/license";

const LICENSE_UNBIND_RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  limit: 5,
};

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getRequestIpFromHeaders(request.headers);
    const rateLimit = await applyRateLimit({
      key: buildRateLimitKey("license-unbind", ipAddress),
      limit: LICENSE_UNBIND_RATE_LIMIT.limit,
      windowMs: LICENSE_UNBIND_RATE_LIMIT.windowMs,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many unbind attempts from this connection. Please wait a few minutes and try again.",
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
    const parsed = licenseUnbindSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Enter a valid order ID, purchase email, and license key." },
        { status: 400 },
      );
    }

    const store = getLicenseStore();
    const record = await store.findByOrderAndEmail({
      orderId: parsed.data.orderId,
      email: parsed.data.email,
    });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message: "We could not match that order ID and purchase email.",
        },
        { status: 404 },
      );
    }

    const license = findLicenseKeyRecord(record, parsed.data.licenseKey);
    if (!license) {
      return NextResponse.json(
        {
          success: false,
          message: "That license key does not belong to this order.",
        },
        { status: 404 },
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
      message: "The current device binding has been removed. You can now activate another computer.",
      data: {
        orderId: updatedRecord.orderId,
        licenseKey: updatedLicense?.key ?? parsed.data.licenseKey,
        status: updatedLicense?.status ?? "inactive",
        boundDevice: updatedLicense?.boundDevice ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove the current device binding.",
      },
      { status: 500 },
    );
  }
}
