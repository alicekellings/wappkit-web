import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const normalized = value.replace(
      /^[\s\u200B-\u200D\u2060\uFEFF]+|[\s\u200B-\u200D\u2060\uFEFF]+$/g,
      "",
    );

    return normalized === "" ? undefined : normalized;
  },
  z.string().min(1).optional(),
);

function normalizeAppUrlValue(value) {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.replace(
    /^[\s\u200B-\u200D\u2060\uFEFF]+|[\s\u200B-\u200D\u2060\uFEFF]+$/g,
    "",
  );

  if (normalized.length === 0) {
    return undefined;
  }

  return normalized.replace(/\/+$/, "");
}

const appUrl = z.preprocess(
  (value) => normalizeAppUrlValue(value) ?? "http://localhost:3000",
  z.string().url(),
);

export const env = createEnv({
  server: {
    CREEM_API_KEY: optionalString,
    CREEM_WEBHOOK_SECRET: optionalString,
    RESEND_API_KEY: optionalString,
    EMAIL_FROM: optionalString,
    INTERNAL_ADMIN_TOKEN: optionalString,
    WAPPKIT_APP_SETUP_DOWNLOAD_URL: optionalString,
    WAPPKIT_APP_SETUP_RELEASE_URL: optionalString,
    WAPPKIT_APP_SETUP_CHECKSUM_URL: optionalString,
    WAPPKIT_APP_SETUP_SHA256: optionalString,
  },
  client: {
    NEXT_PUBLIC_APP_URL: appUrl,
    NEXT_PUBLIC_SUPPORT_EMAIL: optionalString,
  },
  runtimeEnv: {
    CREEM_API_KEY: process.env.CREEM_API_KEY,
    CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    INTERNAL_ADMIN_TOKEN: process.env.INTERNAL_ADMIN_TOKEN,
    WAPPKIT_APP_SETUP_DOWNLOAD_URL:
      process.env.WAPPKIT_APP_SETUP_DOWNLOAD_URL,
    WAPPKIT_APP_SETUP_RELEASE_URL: process.env.WAPPKIT_APP_SETUP_RELEASE_URL,
    WAPPKIT_APP_SETUP_CHECKSUM_URL:
      process.env.WAPPKIT_APP_SETUP_CHECKSUM_URL,
    WAPPKIT_APP_SETUP_SHA256: process.env.WAPPKIT_APP_SETUP_SHA256,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
});
