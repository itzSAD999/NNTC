export const ROLES = [
  "super_admin",
  "content_editor",
  "academic",
  "accounts",
  "principal",
] as const;

export type Role = (typeof ROLES)[number];

export const REQUEST_STATUSES = [
  "submitted",
  "returned",
  "academic_approved",
  "payment_confirmed",
  "approved",
  "collected",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const DOCUMENT_TYPE_CODES = [
  "TR", // Official Transcript
  "AT", // Attestation Letter
  "EP", // English Proficiency Letter
  "RL", // Recommendation / Introduction Letter
  "SR", // Statement of Results
  "CT", // Certified True Copy / Verification
] as const;

export const STORAGE_BUCKETS = {
  receipts: "receipts",
  publicAssets: "public-assets",
  documents: "documents",
} as const;

/** Short-lived signed URL for private receipt viewing (seconds). */
export const RECEIPT_SIGNED_URL_TTL_SECONDS = 60;
