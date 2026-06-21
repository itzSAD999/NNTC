import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex colour e.g. #1A5E3A");

export const settingsFormSchema = z.object({
  college_name: z.string().min(2),
  motto: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
  primary_color: hexColor,
  accent_color: hexColor,
  notification_email_template: z.string().optional(),
});

export const documentFeeSchema = z.object({
  id: z.string().uuid(),
  fee_amount: z.coerce.number().min(0),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
