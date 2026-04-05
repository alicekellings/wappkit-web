import crypto from "node:crypto";

import { getTrimmedEnv, isTrimmedEnvFlagEnabled } from "@/lib/env-utils";
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

type CreemRedirectParams = {
  checkout_id?: string | null;
  order_id?: string | null;
  customer_id?: string | null;
  subscription_id?: string | null;
  product_id?: string | null;
  request_id?: string | null;
  signature?: string | null;
};

function getCreemApiKey() {
  const apiKey = getTrimmedEnv("CREEM_API_KEY");

  if (!apiKey) {
    throw new Error("CREEM_API_KEY is not configured.");
  }

  return apiKey;
}

export function isCreemInTestMode() {
  return isTrimmedEnvFlagEnabled("CREEM_TEST_MODE");
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

  return timingSafeHexMatch(computed, normalizedSignature);
}

function timingSafeHexMatch(expected: string, received: string) {
  if (expected.length !== received.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(received, "hex"),
    );
  } catch {
    return false;
  }
}

export function getCreemWebhookSignature(headers: Headers) {
  return (
    headers.get("creem-signature") ??
    headers.get("x-creem-signature") ??
    headers.get("x-signature") ??
    headers.get("signature")
  );
}

export function parseCreemWebhookEvent(rawBody: string) {
  const parsed = JSON.parse(rawBody) as
    | CreemWebhookEvent
    | (Omit<CreemWebhookEvent, "eventType"> & { event_type?: string });

  const eventType =
    "eventType" in parsed && typeof parsed.eventType === "string"
      ? parsed.eventType
      : "event_type" in parsed && typeof parsed.event_type === "string"
        ? parsed.event_type
        : null;

  if (!eventType || !parsed.object?.id) {
    throw new Error("Invalid Creem webhook event payload.");
  }

  return {
    id: parsed.id,
    eventType,
    created_at: parsed.created_at,
    object: parsed.object,
  } satisfies CreemWebhookEvent;
}

export function verifyCreemRedirectSignature(
  params: CreemRedirectParams,
  apiKey: string,
) {
  if (!params.signature) {
    return false;
  }

  const { signature, ...rest } = params;
  const serialized = Object.entries(rest)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const expectedSignature = crypto
    .createHmac("sha256", apiKey)
    .update(serialized)
    .digest("hex");

  return timingSafeHexMatch(expectedSignature, signature.trim());
}

export function getRequestIpFromHeaders(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-vercel-forwarded-for") ??
    "unknown"
  );
}
