import { z } from "zod";

export const DELIVERY_METHODS = ["collection", "email"] as const;

export const PROGRAMME_OPTIONS = [
  "General Nursing",
  "Midwifery",
  "Community Health Nursing",
  "Other",
] as const;

const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
const ALLOWED_RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

export const requestFormSchema = z.object({
  student_name: z.string().min(3, "Full name must be at least 3 characters"),
  student_id: z.string().min(1, "Student ID / index number is required"),
  student_email: z.string().email("Enter a valid email address"),
  student_phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+233|0)[0-9]{9}$/.test(val.replace(/\s/g, "")),
      "Enter a valid Ghana phone number"
    ),
  program: z.string().min(1, "Please select a programme"),
  year_completed: z.string().min(1, "Year completed is required"),
  document_type_id: z.string().uuid("Please select a document type"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  delivery_method: z.enum(DELIVERY_METHODS, {
    required_error: "Please choose a delivery method",
  }),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;

export const trackFormSchema = z.object({
  reference_no: z
    .string()
    .min(1, "Reference number is required")
    .transform((val) => val.trim().toUpperCase())
    .pipe(
      z.string().regex(
        /^NMTC-[A-Z]{2}-\d{4}-\d{4}$/,
        "Enter a valid reference (e.g. NMTC-TR-2026-0042)"
      )
    ),
});

export type TrackFormValues = z.infer<typeof trackFormSchema>;

export function validateReceiptFile(file: File | null) {
  if (!file) {
    return "Payment receipt is required";
  }
  if (!ALLOWED_RECEIPT_TYPES.includes(file.type as (typeof ALLOWED_RECEIPT_TYPES)[number])) {
    return "Receipt must be JPG, PNG, or PDF";
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return "Receipt must be 5 MB or smaller";
  }
  return null;
}

export { MAX_RECEIPT_BYTES, ALLOWED_RECEIPT_TYPES };
