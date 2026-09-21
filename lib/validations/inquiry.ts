import { z } from "zod";

/**
 * 用 zod 内置的 .trim() / .toLowerCase() 做规范化，
 * 而不是 z.preprocess —— preprocess 会把输入类型推成 unknown，
 * 导致 react-hook-form 的 zodResolver 泛型对不上。
 */
export const studioInquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email.").max(320),
  company: z.string().trim().max(160).optional(),
  /** 客户选的服务档位；允许 "not-sure" */
  tier: z.string().trim().min(1).max(40),
  /** 涉及哪个平台，例如 "Make.com" */
  platform: z.string().trim().min(1).max(80),
  problem: z
    .string()
    .trim()
    .min(20, "Please describe the problem in a little more detail.")
    .max(4000),
  budget: z.string().trim().max(80).optional(),
  /** 蜜罐字段：真人不会填，填了直接丢弃 */
  website: z.string().trim().max(200).optional(),
});

export type StudioInquiryInput = z.infer<typeof studioInquirySchema>;
