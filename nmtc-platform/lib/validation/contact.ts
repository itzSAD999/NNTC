import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "Admissions",
  "Fees",
  "Academic",
  "Other",
] as const;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+233|0)[0-9]{9}$/.test(val.replace(/\s/g, "")),
      "Enter a valid Ghana phone number"
    ),
  subject: z.enum(CONTACT_SUBJECTS, {
    required_error: "Please select a subject",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
