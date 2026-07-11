import crypto from "node:crypto";

import { env } from "@/env.mjs";

const TOKEN_PREFIX = "wlk1";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export type LicenseTokenPayload = {
  iss: "wappkit";
  aud: "desktop-license";
  toolSlug: string;
  tier: "premium";
  features: string[];
  licenseKeySha256: string;
  orderId: string;
  productName: string;
  deviceId: string;
  iat: number;
  nbf: number;
  exp: number;
};

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

function getPrivateKey() {
  return process.env.LICENSE_TOKEN_PRIVATE_KEY || env.LICENSE_TOKEN_PRIVATE_KEY;
}

export function hashLicenseKey(licenseKey: string) {
  return crypto
    .createHash("sha256")
    .update(licenseKey.trim().toUpperCase(), "utf8")
    .digest("hex");
}

export function createLicenseToken(input: {
  licenseKey: string;
  toolSlug: string;
  orderId: string;
  productName: string;
  deviceId: string;
}) {
  const rawPrivateKey = getPrivateKey();

  if (!rawPrivateKey) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Math.floor((Date.now() + TOKEN_TTL_MS) / 1000);
  const payload: LicenseTokenPayload = {
    iss: "wappkit",
    aud: "desktop-license",
    toolSlug: input.toolSlug,
    tier: "premium",
    features: [
      "batch",
      "background_replace",
      "multi_size_export",
      "jpeg_export",
      "enhance",
      "smart_optimize",
    ],
    licenseKeySha256: hashLicenseKey(input.licenseKey),
    orderId: input.orderId,
    productName: input.productName,
    deviceId: input.deviceId,
    iat: now,
    nbf: now - 60,
    exp: expiresAt,
  };

  const encodedPayload = base64Url(JSON.stringify(payload));
  const privateKey = crypto.createPrivateKey({
    key: normalizePrivateKey(rawPrivateKey),
    format: "pem",
  });
  const signature = crypto.sign(null, Buffer.from(encodedPayload), privateKey);

  return {
    token: `${TOKEN_PREFIX}.${encodedPayload}.${base64Url(signature)}`,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
    features: payload.features,
  };
}
