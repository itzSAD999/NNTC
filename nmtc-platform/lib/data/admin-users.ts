import { createClient } from "@/lib/supabase/server";
import type { StaffAccount } from "@/types/database";

export async function listStaffAccounts(): Promise<StaffAccount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff_accounts")
    .select("*")
    .order("full_name");

  if (error || !data) return [];
  return data as StaffAccount[];
}
