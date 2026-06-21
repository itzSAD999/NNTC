import { z } from "zod";

export const resourceFormSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  category: z.string().min(1, "Category is required.").max(100),
  file_url: z.string().min(1, "File is required."),
  description: z.string().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});
