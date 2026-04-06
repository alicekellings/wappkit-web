import { z } from "zod";

import {
  isSafeIdentifier,
  isSafeSlug,
  normalizeEmailInput,
  trimInput,
} from "@/lib/input-utils";

export const checkoutRequestSchema = z.object({
  toolSlug: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(80)
      .refine(isSafeSlug, "Invalid tool slug."),
  ),
  customerEmail: z.preprocess(
    normalizeEmailInput,
    z.string().email().max(320).optional(),
  ),
});

export const licenseLookupSchema = z.object({
  orderId: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(120)
      .refine(isSafeIdentifier, "Invalid order ID."),
  ),
  email: z.preprocess(
    normalizeEmailInput,
    z.string().email().max(320),
  ),
});

export const licenseValidateSchema = z.object({
  licenseKey: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(160)
      .refine(isSafeIdentifier, "Invalid license key."),
  ),
  deviceId: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(120)
      .refine(isSafeIdentifier, "Invalid device ID."),
  ),
  deviceName: z.preprocess(
    trimInput,
    z.string().min(1).max(120),
  ),
  toolSlug: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(80)
      .refine(isSafeSlug, "Invalid tool slug.")
      .optional(),
  ),
});

export const licenseDeactivateSchema = z.object({
  licenseKey: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(160)
      .refine(isSafeIdentifier, "Invalid license key."),
  ),
  deviceId: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(120)
      .refine(isSafeIdentifier, "Invalid device ID."),
  ),
  toolSlug: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(80)
      .refine(isSafeSlug, "Invalid tool slug.")
      .optional(),
  ),
});

export const licenseUnbindSchema = z.object({
  orderId: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(120)
      .refine(isSafeIdentifier, "Invalid order ID."),
  ),
  email: z.preprocess(
    normalizeEmailInput,
    z.string().email().max(320),
  ),
  licenseKey: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(160)
      .refine(isSafeIdentifier, "Invalid license key."),
  ),
});

function optionalTrimmedIdentifier(maxLength: number, errorMessage: string) {
  return z.preprocess(
    (value) => {
      const trimmed = trimInput(value);
      return trimmed === "" ? undefined : trimmed;
    },
    z
      .string()
      .max(maxLength)
      .refine((value) => isSafeIdentifier(value), errorMessage)
      .optional(),
  );
}

export const adminSessionSchema = z.object({
  token: z.preprocess(
    trimInput,
    z.string().min(1).max(200),
  ),
});

export const adminLicenseSearchSchema = z
  .object({
    orderId: optionalTrimmedIdentifier(120, "Invalid order ID."),
    email: z.preprocess(
      (value) => {
        const normalized = normalizeEmailInput(value);
        return normalized === "" ? undefined : normalized;
      },
      z.string().email().max(320).optional(),
    ),
    licenseKey: optionalTrimmedIdentifier(160, "Invalid license key."),
  })
  .superRefine((value, context) => {
    if (!value.orderId && !value.licenseKey) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an order ID or a license key.",
        path: ["orderId"],
      });
    }

    if (value.email && !value.orderId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "An email search also requires an order ID.",
        path: ["email"],
      });
    }
  });

export const adminLicenseUnbindSchema = z.object({
  licenseKey: z.preprocess(
    trimInput,
    z
      .string()
      .min(1)
      .max(160)
      .refine(isSafeIdentifier, "Invalid license key."),
  ),
});
