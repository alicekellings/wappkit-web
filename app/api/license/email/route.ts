import { NextRequest, NextResponse } from "next/server";

import { serializeError } from "@/lib/error-utils";

import { canSendLicenseEmail, sendLicenseEmail } from "@/lib/license-email";
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
        { error: "No matching purchase was found." },
        { status: 404 },
      );
    }

    if (!canSendLicenseEmail()) {
      return NextResponse.json(
        {
          error:
            "Email delivery is not configured yet. Use the direct license display on this page for now.",
        },
        { status: 501 },
      );
    }

    await sendLicenseEmail(record);

    return NextResponse.json({
      message: `A copy has been sent to ${record.customerEmail}.`,
    });
  } catch (error) {
    console.error("[license/email] failed to send license email", {
      error: serializeError(error),
    });

    return NextResponse.json(
      {
        error:
          "We could not send this email right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
