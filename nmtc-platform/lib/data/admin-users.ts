import { PREVIEW_STAFF_ACCOUNTS, withPreview } from "@/lib/data/admin-preview";
import { createClient } from "@/lib/supabase/server";
import type { StaffAccount } from "@/types/database";

export async function listStaffAccounts(): Promise<StaffAccount[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff_accounts")
      .select("*")
      .order("full_name");

    if (error || !data) return PREVIEW_STAFF_ACCOUNTS;
    return withPreview(data as StaffAccount[], PREVIEW_STAFF_ACCOUNTS);
  } catch {
    return PREVIEW_STAFF_ACCOUNTS;
  }
}
