import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

import { createLicenseToken, hashLicenseKey } from "../lib/license-token";

const TEST_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\\n" +
  "MC4CAQAwBQYDK2VwBCIEIK6v8VvlBPOfCea4nqYXeiWAbywbtvFzQzXqRMHLDMqR\\n" +
  "-----END PRIVATE KEY-----";

const TEST_PUBLIC_KEY =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MCowBQYDK2VwAyEAMPSxsUS8z92WdW4eqA9zkKbr52pn2GGmBPCUKZsmtYU=\n" +
  "-----END PUBLIC KEY-----";

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, "base64");
}

test("createLicenseToken returns a verifiable Ed25519 signed desktop token", () => {
  process.env.LICENSE_TOKEN_PRIVATE_KEY = TEST_PRIVATE_KEY;

  const signed = createLicenseToken({
    licenseKey: "waap-token-123",
    toolSlug: "ai-ecom-visual-studio",
    orderId: "ord_token_123",
    productName: "AI E-commerce Visual Studio",
    deviceId: "desktop_alpha",
  });

  assert.ok(signed);
  const parts = signed.token.split(".");
  assert.equal(parts.length, 3);
  assert.equal(parts[0], "wlk1");

  const payload = JSON.parse(base64UrlDecode(parts[1]!).toString("utf8"));
  const publicKey = crypto.createPublicKey(TEST_PUBLIC_KEY);
  const verified = crypto.verify(
    null,
    Buffer.from(parts[1]!),
    publicKey,
    base64UrlDecode(parts[2]!),
  );

  assert.equal(verified, true);
  assert.equal(payload.iss, "wappkit");
  assert.equal(payload.aud, "desktop-license");
  assert.equal(payload.toolSlug, "ai-ecom-visual-studio");
  assert.equal(payload.tier, "premium");
  assert.equal(payload.deviceId, "desktop_alpha");
  assert.equal(payload.licenseKeySha256, hashLicenseKey("WAAP-TOKEN-123"));
  assert.ok(payload.features.includes("batch"));
  assert.ok(payload.features.includes("background_replace"));
  assert.ok(payload.exp > payload.iat);
  assert.ok(signed.expiresAt);
});
