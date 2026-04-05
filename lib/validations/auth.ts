import * as z from "zod"

import { normalizeEmailInput } from "@/lib/input-utils";

export const userAuthSchema = z.object({
  email: z.preprocess(normalizeEmailInput, z.string().email().max(320)),
})
