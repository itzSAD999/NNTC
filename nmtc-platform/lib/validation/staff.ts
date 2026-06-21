import { z } from "zod";

export const staffFormSchema = z.object({
  full_name: z.string().min(1, "Name is required.").max(200),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format."),
  job_title: z.string().min(1, "Title is required.").max(200),
  department_id: z.string().uuid("Select a department."),
  qualification: z.string().max(300).optional().or(z.literal("")),
  photo_url: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  work_email: z.string().email("Invalid email.").optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});
