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
