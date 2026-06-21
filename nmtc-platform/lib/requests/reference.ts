import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function generateReferenceNumber(
  documentCode: string
): Promise<string> {
  const supabase = createAdminClient();
  const year = new Date().getFullYear();
  const prefix = `NMTC-${documentCode}-${year}-`;

  const { count, error } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
    .like("reference_no", `${prefix}%`);

  if (error) {
    throw new Error("Could not generate reference number");
  }

  const seq = (count ?? 0) + 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export function isAdminConfigured(): boolean {
  return (
    isSupabaseConfigured() &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
  );
}
