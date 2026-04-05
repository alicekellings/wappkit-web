import { NextRequest, NextResponse } from "next/server";

import { getRequestIpFromHeaders } from "@/lib/creem";
import { canSendLicenseEmail } from "@/lib/license-email";
import { getLicenseStore } from "@/lib/licenses";
import { applyRateLimit, buildRateLimitKey } from "@/lib/rate-limit";
import { getDisplayProductName } from "@/lib/tools";
import { licenseLookupSchema } from "@/lib/validations/license";

const LICENSE_RETRIEVE_RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  limit: 5,
};

export async function POST(request: NextRequest) {
  try {
    const ipAddress = getRequestIpFromHeaders(request.headers);
    const rateLimit = await applyRateLimit({
      key: buildRateLimitKey("license-retrieve", ipAddress),
      limit: LICENSE_RETRIEVE_RATE_LIMIT.limit,
      windowMs: LICENSE_RETRIEVE_RATE_LIMIT.windowMs,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Too many retrieval attempts from this connection. Please wait a few minutes and try again.",
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
    const parsed = licenseLookupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid order ID and purchase email." },
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
          error:
            "We could not match that order ID and purchase email. Check both values and try again.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: {
        orderId: record.orderId,
        productName: getDisplayProductName(record.toolSlug, record.productName),
        toolSlug: record.toolSlug,
        customerEmail: record.customerEmail,
        licenseKeys: record.licenseKeys,
        emailDeliveryAvailable: canSendLicenseEmail(),
      },
    }, {
      headers: {
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve license.",
      },
      { status: 500 },
    );
  }
}
