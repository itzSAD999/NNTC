import { createClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "@/lib/supabase/config";

/**
 * Service-role client for server actions only.
 * Bypasses RLS — never import in client components or expose to the browser.
 */
export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "placeholder-service-role-key";

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
