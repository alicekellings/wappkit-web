import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { createCreemCheckout, isCreemInTestMode } from "@/lib/creem";
import { checkoutRequestSchema } from "@/lib/validations/license";
import { absoluteUrl } from "@/lib/utils";
import { getToolBySlug } from "@/lib/tools";

const TOOL_PRODUCT_ENV_MAP: Record<string, string> = {
  "reddit-toolbox": "CREEM_PRODUCT_REDDIT_TOOLBOX_ID",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout payload." },
        { status: 400 },
      );
    }

    const tool = getToolBySlug(parsed.data.toolSlug);
    if (!tool || tool.status !== "live") {
      return NextResponse.json(
        { error: "This tool is not available for checkout yet." },
        { status: 404 },
      );
    }

    const productEnvKey = TOOL_PRODUCT_ENV_MAP[tool.slug];
    const productId = productEnvKey ? process.env[productEnvKey] : undefined;

    if (!productId) {
      console.error("Creem checkout product is not configured.", {
        toolSlug: tool.slug,
        productEnvKey,
        creemTestMode: isCreemInTestMode(),
      });

      return NextResponse.json(
        { error: "This tool is not configured for Creem checkout yet." },
        { status: 500 },
      );
    }

    const requestId = crypto.randomUUID();
    const successUrl = absoluteUrl(
      `/checkout/success?tool=${tool.slug}&request_id=${requestId}`,
    );

    const checkout = await createCreemCheckout({
      productId,
      requestId,
      successUrl,
      customerEmail: parsed.data.customerEmail,
      metadata: {
        toolSlug: tool.slug,
      },
    });

    return NextResponse.json({
      checkoutId: checkout.id,
      checkoutUrl: checkout.checkout_url,
    });
  } catch (error) {
    console.error("Failed to create Creem checkout.", {
      creemTestMode: isCreemInTestMode(),
      productEnvKey: TOOL_PRODUCT_ENV_MAP["reddit-toolbox"],
      configuredProductId:
        process.env[TOOL_PRODUCT_ENV_MAP["reddit-toolbox"] ?? ""] ?? null,
      nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
      error,
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Creem checkout.",
      },
      { status: 500 },
    );
  }
}
