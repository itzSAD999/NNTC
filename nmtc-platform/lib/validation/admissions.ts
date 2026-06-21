import { z } from "zod";

export const admissionsContentSchema = z.object({
  application_form_url: z.string().url().optional().or(z.literal("")),
  application_fee: z.coerce.number().min(0).optional(),
  payment_instructions: z.string().optional(),
  academic_calendar: z.string().optional(),
  selection_criteria: z.string().optional(),
  process_steps_json: z.string().min(2),
});

export const documentRequiredSchema = z.object({
  label: z.string().min(1),
  sort_order: z.coerce.number().int().min(0),
});

export const admissionsFaqSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(1),
  sort_order: z.coerce.number().int().min(0),
});
