import { z } from "zod";

import { ROLES } from "@/lib/constants";

export const createStaffSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLES),
});

export const updateStaffSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(ROLES),
  is_active: z.boolean(),
});

export const resetPasswordSchema = z.object({
  id: z.string().uuid(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type CreateStaffValues = z.infer<typeof createStaffSchema>;
export type UpdateStaffValues = z.infer<typeof updateStaffSchema>;
