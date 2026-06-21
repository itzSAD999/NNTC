import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/data/settings";
import type { DocumentType } from "@/types/database";
import type { Settings } from "@/types/database";

export async function getAdminSettings(): Promise<{
  settings: Settings;
  documentTypes: DocumentType[];
}> {
  const supabase = await createClient();
  const settings = await getSettings();

  const { data: documentTypes } = await supabase
    .from("document_types")
    .select("*")
    .order("name");

  return {
    settings,
    documentTypes: (documentTypes ?? []) as DocumentType[],
  };
}
