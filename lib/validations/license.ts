import { z } from "zod";

export const checkoutRequestSchema = z.object({
  toolSlug: z.string().min(1),
  customerEmail: z.string().email().optional(),
});

export const licenseLookupSchema = z.object({
  orderId: z.string().min(1),
  email: z.string().email(),
});
