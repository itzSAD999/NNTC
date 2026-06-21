import { z } from "zod";

export const feeSchema = z.object({
  program_id: z.string().uuid().optional().or(z.literal("")),
  year_label: z.string().min(1),
  fee_type: z.string().min(1),
  amount: z.coerce.number().min(0),
  due_note: z.string().optional(),
  sort_order: z.coerce.number().int().min(0),
});

export const paymentMethodSchema = z.object({
  method: z.string().min(1),
  details: z.string().optional(),
  sort_order: z.coerce.number().int().min(0),
});

export const scholarshipSchema = z.object({
  name: z.string().min(1),
  eligibility: z.string().optional(),
  how_to_apply: z.string().optional(),
  external_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0),
});

export const financialAidContentSchema = z.object({
  payment_schedule: z.string().optional(),
  sltf_info: z.string().optional(),
  hardship_policy: z.string().optional(),
});
