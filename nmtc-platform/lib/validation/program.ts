import { z } from "zod";

export const programFormSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  department_id: z.string().uuid(),
  duration: z.string().min(1),
  qualification: z.string().min(1),
  entry_requirements: z.string().optional(),
  description: z.string().optional(),
  career_prospects: z.string().optional(),
  cutoff_points: z.string().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
  is_published: z.boolean().optional(),
});

export const programModuleSchema = z.object({
  year_label: z.string().min(1),
  modules: z.string().min(1),
  sort_order: z.coerce.number().int().min(0),
});

export type ProgramFormValues = z.infer<typeof programFormSchema>;
