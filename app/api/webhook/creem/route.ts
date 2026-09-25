import { NextRequest, NextResponse } from "next/server";

import { serializeError } from "@/lib/error-utils";

import {
  getCreemWebhookSignature,
  isCreemInTestMode,
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

    if (event.object.mode === "test" && !isCreemInTestMode()) {
      return NextResponse.json({
        received: true,
        ignored: true,
        reason: "Ignoring Creem test webhook in production mode.",
      });
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

    // 必须走 mergeAndSave：Creem 会重放同一个 checkout.completed 事件，
    // 而这里推导出的是一条全新记录（设备绑定/换机冷却期都是空的）。
    // 直接 save() 覆盖会把已激活设备的绑定、30 天换机冷却期、
    // 以及管理员手工封禁的 disabled 状态一起冲掉。
    const saved = await store.mergeAndSave(record);

    return NextResponse.json({
      received: true,
      saved: true,
      orderId: saved.orderId,
    });
  } catch (error) {
    if (
      !isCreemInTestMode() &&
      error instanceof Error &&
      error.message.includes("Checkout not found")
    ) {
      return NextResponse.json({
        received: true,
        ignored: true,
        reason: "Ignoring unmatched Creem test webhook payload in production mode.",
      });
    }

    console.error("Failed to process Creem webhook.", error);

    return NextResponse.json(
      {
        error: "Failed to process Creem webhook.",
      },
      { status: 500 },
    );
  }
}
