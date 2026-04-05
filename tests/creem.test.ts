import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

import {
  getRequestIpFromHeaders,
  parseCreemWebhookEvent,
  verifyCreemRedirectSignature,
  verifyCreemWebhookSignature,
} from "../lib/creem";

test("verifyCreemWebhookSignature accepts the expected HMAC signature", () => {
  const rawBody = JSON.stringify({
    id: "evt_123",
    eventType: "checkout.completed",
    object: {
      id: "ch_123",
    },
  });
  const secret = "whsec_test_secret";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  assert.equal(verifyCreemWebhookSignature(rawBody, signature, secret), true);
  assert.equal(
    verifyCreemWebhookSignature(rawBody, `sha256=${signature}`, secret),
    true,
  );
});

test("verifyCreemRedirectSignature matches Creem redirect signing", () => {
  const apiKey = "creem_api_test_key";
  const payload = {
    checkout_id: "ch_123",
    order_id: "ord_123",
    customer_id: "cust_123",
    product_id: "prod_123",
    request_id: "req_123",
  };
  const signature = crypto
    .createHmac("sha256", apiKey)
    .update(
      Object.entries(payload)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([key, value]) => `${key}=${value}`)
        .join("&"),
    )
    .digest("hex");

  assert.equal(
    verifyCreemRedirectSignature(
      {
        ...payload,
        signature,
      },
      apiKey,
    ),
    true,
  );
});

test("parseCreemWebhookEvent accepts event_type payloads", () => {
  const event = parseCreemWebhookEvent(
    JSON.stringify({
      id: "evt_123",
      event_type: "checkout.completed",
      created_at: 1,
      object: {
        id: "ch_123",
      },
    }),
  );

  assert.equal(event.eventType, "checkout.completed");
  assert.equal(event.object.id, "ch_123");
});

test("getRequestIpFromHeaders prefers the first forwarded ip", () => {
  const headers = new Headers({
    "x-forwarded-for": "198.51.100.10, 203.0.113.20",
    "x-real-ip": "203.0.113.30",
  });

  assert.equal(getRequestIpFromHeaders(headers), "198.51.100.10");
});
