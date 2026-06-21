import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format."),
  description: z.string().min(1, "Description is required."),
  starts_at: z.string().min(1, "Start date is required."),
  ends_at: z.string().optional().or(z.literal("")),
  location: z.string().min(1, "Location is required.").max(300),
  cover_image_url: z.string().optional().or(z.literal("")),
  registration_url: z.string().url("Invalid URL.").optional().or(z.literal("")),
  is_past: z.boolean(),
});
