import crypto from "node:crypto";

import type { CreemCheckoutPayload } from "@/lib/licenses";

const CREEM_LIVE_API_URL = "https://api.creem.io";
const CREEM_TEST_API_URL = "https://test-api.creem.io";

type CreateCheckoutInput = {
  productId: string;
  requestId?: string;
  successUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
};

type CreateCheckoutResponse = {
  id: string;
  checkout_url: string;
  status: string;
  request_id?: string | null;
};

type CreemWebhookEvent = {
  id: string;
  eventType: string;
  created_at: number;
  object: CreemCheckoutPayload;
};

function getCreemApiKey() {
  const apiKey = process.env.CREEM_API_KEY;

  if (!apiKey) {
    throw new Error("CREEM_API_KEY is not configured.");
  }

  return apiKey;
}

export function isCreemInTestMode() {
  return process.env.CREEM_TEST_MODE === "true";
}

export function getCreemApiBaseUrl() {
  return isCreemInTestMode() ? CREEM_TEST_API_URL : CREEM_LIVE_API_URL;
}

async function creemRequest<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | undefined> },
): Promise<T> {
  const baseUrl = getCreemApiBaseUrl();
  const url = new URL(`${baseUrl}${path}`);

  Object.entries(init?.query ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": getCreemApiKey(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Creem request failed with status ${response.status}: ${text || "Unknown error"}`,
    );
  }

  return (await response.json()) as T;
}

export async function createCreemCheckout(input: CreateCheckoutInput) {
  const payload = {
    product_id: input.productId,
    request_id: input.requestId,
    success_url: input.successUrl,
    customer: input.customerEmail ? { email: input.customerEmail } : undefined,
    metadata: input.metadata,
  };

  return creemRequest<CreateCheckoutResponse>("/v1/checkouts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function retrieveCreemCheckout(checkoutId: string) {
  return creemRequest<CreemCheckoutPayload>("/v1/checkouts", {
    method: "GET",
    query: {
      checkout_id: checkoutId,
    },
  });
}

export function verifyCreemWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
) {
  const normalizedSignature = signature.replace(/^sha256=/, "").trim();
  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (normalizedSignature.length !== computed.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(normalizedSignature, "hex"),
    );
  } catch {
    return false;
  }
}

export function getCreemWebhookSignature(headers: Headers) {
  return (
    headers.get("creem-signature") ??
    headers.get("x-creem-signature") ??
    headers.get("x-signature")
  );
}

export function parseCreemWebhookEvent(rawBody: string) {
  return JSON.parse(rawBody) as CreemWebhookEvent;
}
