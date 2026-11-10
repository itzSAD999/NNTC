export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

const MISSING_SEED_PLACEHOLDERS = new Set([
  "/images/lecture-hall.jpg",
  "/images/clinical-care.jpg",
  "/images/graduation.jpg",
  "/images/healthcare-team.jpg",
]);

export function getStoragePublicUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (MISSING_SEED_PLACEHOLDERS.has(path)) return null;
  if (path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  const normalized = path.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/${normalized}`;
}
