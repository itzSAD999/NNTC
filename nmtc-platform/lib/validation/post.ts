import { z } from "zod";

export const POST_CATEGORIES = [
  "News",
  "Announcements",
  "Admissions",
  "Academic",
] as const;

export const postFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  excerpt: z.string().max(500).optional(),
  body: z.string().min(1, "Body is required"),
  category: z.string().min(1),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  is_pinned: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
