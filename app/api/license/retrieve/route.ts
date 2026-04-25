import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { getRequestIpFromHeaders } from "@/lib/creem";
import { getTrimmedEnv } from "@/lib/env-utils";
import { canSendLicenseEmail } from "@/lib/license-email";
import { getLicenseStore, type LicenseRecord } from "@/lib/licenses";
import { applyRateLimit, buildRateLimitKey } from "@/lib/rate-limit";
import { getDisplayProductName } from "@/lib/tools";
import { licenseLookupSchema } from "@/lib/validations/license";

const LICENSE_RETRIEVE_RATE_LIMIT = {
  windowMs: 10 * 60 * 1000,
  limit: 5,
};

function getEmailFingerprint(email: string) {
  return crypto.createHash("sha256").update(email).digest("hex").slice(0, 12);
}

export async function POST(request: NextRequest) {
  const ipAddress = getRequestIpFromHeaders(request.headers);

  try {
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
      console.warn("License retrieve rejected invalid payload.", {
        ipAddress,
        bodyType: typeof body,
      });

      return NextResponse.json(
        { error: "Enter a valid order ID and purchase email." },
        { status: 400 },
      );
    }

    const lookupMeta = {
      ipAddress,
      orderId: parsed.data.orderId,
      emailFingerprint: getEmailFingerprint(parsed.data.email),
      hasPersistentLicenseStore: Boolean(
        getTrimmedEnv("UPSTASH_REDIS_REST_URL") &&
          getTrimmedEnv("UPSTASH_REDIS_REST_TOKEN"),
      ),
      creemTestMode: getTrimmedEnv("CREEM_TEST_MODE") ?? "unset",
    };
    const store = getLicenseStore();
    let record: LicenseRecord | null = null;

    try {
      record = await store.findByOrderAndEmail({
        orderId: parsed.data.orderId,
        email: parsed.data.email,
      });
    } catch (error) {
      console.error("License retrieve store lookup failed.", {
        ...lookupMeta,
        error,
      });
      throw error;
    }

    if (!record) {
      try {
        const orderMatch = await store.getByOrderId(parsed.data.orderId);

        if (!orderMatch) {
          console.warn("License retrieve order not found in mirrored store.", {
            ...lookupMeta,
          });
        } else {
          console.warn("License retrieve found order ID but purchase email did not match.", {
            ...lookupMeta,
            matchedToolSlug: orderMatch.toolSlug,
            matchedProductName: orderMatch.productName,
            matchedEmailFingerprint: getEmailFingerprint(orderMatch.customerEmail),
            licenseKeyCount: orderMatch.licenseKeys.length,
          });
        }
      } catch (error) {
        console.error("License retrieve order-level diagnostic lookup failed.", {
          ...lookupMeta,
          error,
        });
      }

      return NextResponse.json(
        {
          error:
            "We could not match that order ID and purchase email. Check both values and try again.",
      },
      { status: 404 },
    );
    }

    console.info("License retrieve matched mirrored order.", {
      ...lookupMeta,
      matchedToolSlug: record.toolSlug,
      licenseKeyCount: record.licenseKeys.length,
    });

    return NextResponse.json({
      data: {
        orderId: record.orderId,
        productName: getDisplayProductName(record.toolSlug, record.productName),
        toolSlug: record.toolSlug,
        customerEmail: record.customerEmail,
        licenseKeys: record.licenseKeys,
        emailDeliveryAvailable: canSendLicenseEmail(),
        singleDeviceLimit: 1,
      },
    }, {
      headers: {
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error("License retrieve request failed.", {
      ipAddress,
      hasPersistentLicenseStore: Boolean(
        getTrimmedEnv("UPSTASH_REDIS_REST_URL") &&
          getTrimmedEnv("UPSTASH_REDIS_REST_TOKEN"),
      ),
      creemTestMode: getTrimmedEnv("CREEM_TEST_MODE") ?? "unset",
      error,
    });

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
