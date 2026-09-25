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
  const tokenLifetimeSeconds = payload.exp - payload.iat;
  // 令牌有效期 7 天（与桌面端 auth_manager.py 的 OFFLINE_GRACE_PERIOD 对齐），
  // 不再是 24 小时 —— 24h 会让付费用户断网一天就被降级回 Free。
  assert.ok(tokenLifetimeSeconds >= 7 * 24 * 60 * 60 - 1);
  assert.ok(tokenLifetimeSeconds <= 7 * 24 * 60 * 60);
  assert.ok(signed.expiresAt);
});

test("createLicenseToken 按 toolSlug 发放各自的功能名（多工具共用不能串味）", () => {
  process.env.LICENSE_TOKEN_PRIVATE_KEY = TEST_PRIVATE_KEY;

  const reddit = createLicenseToken({
    licenseKey: "waap-reddit-123",
    toolSlug: "reddit-toolbox",
    orderId: "ord_reddit_123",
    productName: "Reddit Toolbox",
    deviceId: "desktop_beta",
  });
  assert.ok(reddit);
  assert.ok(reddit.features.includes("scrape_posts"));
  assert.ok(reddit.features.includes("subreddit_analysis"));
  // 绝不能把图片工具的功能名发给 Reddit Toolbox
  assert.ok(!reddit.features.includes("background_replace"));

  const image = createLicenseToken({
    licenseKey: "waap-image-123",
    toolSlug: "ai-ecom-visual-studio",
    orderId: "ord_image_123",
    productName: "AI E-commerce Visual Studio",
    deviceId: "desktop_gamma",
  });
  assert.ok(image);
  assert.ok(image.features.includes("background_replace"));
  // 反向也不能串
  assert.ok(!image.features.includes("scrape_posts"));
});

test("未知 toolSlug 回落到默认工具的功能名", () => {
  process.env.LICENSE_TOKEN_PRIVATE_KEY = TEST_PRIVATE_KEY;

  const t = createLicenseToken({
    licenseKey: "waap-unknown-123",
    toolSlug: "totally-unknown-tool",
    orderId: "ord_unknown_123",
    productName: "Unknown",
    deviceId: "desktop_x",
  });
  assert.ok(t);
  assert.ok(t.features.includes("batch"));
});
