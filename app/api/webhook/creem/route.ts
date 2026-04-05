import { NextRequest, NextResponse } from "next/server";

import {
  getCreemWebhookSignature,
  parseCreemWebhookEvent,
  retrieveCreemCheckout,
  verifyCreemWebhookSignature,
} from "@/lib/creem";
import { getTrimmedEnv } from "@/lib/env-utils";
import {
  createLicenseRecordFromCreemCheckout,
  getLicenseStore,
  hasLicenseKeys,
} from "@/lib/licenses";

function mergeCreemCheckoutPayloads(
  checkout: Awaited<ReturnType<typeof retrieveCreemCheckout>>,
  eventObject: Awaited<ReturnType<typeof parseCreemWebhookEvent>>["object"],
) {
  return {
    ...checkout,
    metadata: checkout.metadata ?? eventObject.metadata ?? undefined,
    order: checkout.order ?? eventObject.order ?? undefined,
    customer: checkout.customer ?? eventObject.customer ?? undefined,
    product: checkout.product ?? eventObject.product ?? undefined,
  };
}

export async function POST(request: NextRequest) {
  const secret = getTrimmedEnv("CREEM_WEBHOOK_SECRET");
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

    const checkout = hasLicenseKeys(event.object)
      ? event.object
      : mergeCreemCheckoutPayloads(
          await retrieveCreemCheckout(event.object.id),
          event.object,
        );

    if (!hasLicenseKeys(checkout)) {
      console.error("Creem webhook checkout missing license keys after sync.", {
        eventId: event.id,
        eventType: event.eventType,
        checkoutId: event.object.id,
      });

      return NextResponse.json(
        {
          error: "License keys are not available yet for this checkout.",
          received: true,
          retryable: true,
        },
        { status: 503 },
      );
    }

    const record = createLicenseRecordFromCreemCheckout(checkout);
    const store = getLicenseStore();

    await store.save(record);

    return NextResponse.json({
      received: true,
      saved: true,
      orderId: record.orderId,
    });
  } catch (error) {
    console.error("Failed to process Creem webhook.", error);

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
