import { z } from "zod";

export const departmentFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(200),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
});
