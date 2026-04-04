import { NextRequest, NextResponse } from "next/server";

import { canSendLicenseEmail } from "@/lib/license-email";
import { getLicenseStore } from "@/lib/licenses";
import { licenseLookupSchema } from "@/lib/validations/license";

export async function POST(request: NextRequest) {
  try {
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
        productName: record.productName,
        toolSlug: record.toolSlug,
        customerEmail: record.customerEmail,
        licenseKeys: record.licenseKeys,
        emailDeliveryAvailable: canSendLicenseEmail(),
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
