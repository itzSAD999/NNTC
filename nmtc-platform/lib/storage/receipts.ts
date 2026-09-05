import { STORAGE_BUCKETS } from "@/lib/constants";

/** Normalize stored receipt_url to a path within the receipts bucket. */
export function receiptObjectPath(stored: string | null): string | null {
  if (!stored) return null;
  const prefix = `${STORAGE_BUCKETS.receipts}/`;
  return stored.startsWith(prefix) ? stored.slice(prefix.length) : stored;
}
