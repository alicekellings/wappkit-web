import { NextRequest, NextResponse } from "next/server";

import {
  getCreemWebhookSignature,
  parseCreemWebhookEvent,
  retrieveCreemCheckout,
  verifyCreemWebhookSignature,
} from "@/lib/creem";
import { createLicenseRecordFromCreemCheckout, getLicenseStore } from "@/lib/licenses";

export async function POST(request: NextRequest) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  const signature = getCreemWebhookSignature(request.headers);
  const rawBody = await request.text();

  if (!secret) {
    return NextResponse.json(
      { error: "CREEM_WEBHOOK_SECRET is not configured." },
      { status: 500 },
    );
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 401 });
  }

  if (!verifyCreemWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    const event = parseCreemWebhookEvent(rawBody);

    if (event.eventType !== "checkout.completed") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const checkout =
      event.object.license_keys && event.object.license_keys.length > 0
        ? event.object
        : {
            ...event.object,
            ...(await retrieveCreemCheckout(event.object.id)),
            order: event.object.order ?? undefined,
            customer: event.object.customer ?? undefined,
            product: event.object.product ?? undefined,
            metadata: event.object.metadata ?? undefined,
          };

    const record = createLicenseRecordFromCreemCheckout(checkout);
    const store = getLicenseStore();

    await store.save(record);

    return NextResponse.json({
      received: true,
      saved: true,
      orderId: record.orderId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process Creem webhook.",
      },
      { status: 500 },
    );
  }
}
