import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().min(1).optional(),
);

const appUrl = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length > 0
      ? value
      : "http://localhost:3000",
  z.string().url(),
);

export const env = createEnv({
  server: {
    CREEM_API_KEY: optionalString,
    CREEM_WEBHOOK_SECRET: optionalString,
    RESEND_API_KEY: optionalString,
    EMAIL_FROM: optionalString,
    INTERNAL_ADMIN_TOKEN: optionalString,
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
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
});
