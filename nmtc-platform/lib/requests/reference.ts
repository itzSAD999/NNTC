import { isSupabaseConfigured } from "@/lib/supabase/config";

export function isAdminConfigured(): boolean {
  return (
    isSupabaseConfigured() &&
    Boolean(
      (
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SECRET_KEY
      )?.trim()
    )
  );
}
