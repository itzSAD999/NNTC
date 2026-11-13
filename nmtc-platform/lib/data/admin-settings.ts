import { DEFAULT_DOCUMENT_TYPES } from "@/lib/data/document-types";
import { getSettings } from "@/lib/data/settings";
import { createClient } from "@/lib/supabase/server";
import type { DocumentType } from "@/types/database";
import type { Settings } from "@/types/database";

export async function getAdminSettings(): Promise<{
  settings: Settings;
  documentTypes: DocumentType[];
}> {
  const settings = await getSettings();
  try {
    const supabase = await createClient();
    const { data: documentTypes } = await supabase
      .from("document_types")
      .select("*")
      .order("name");

    return {
      settings,
      documentTypes:
        documentTypes && documentTypes.length > 0
          ? (documentTypes as DocumentType[])
          : DEFAULT_DOCUMENT_TYPES,
    };
  } catch {
    return { settings, documentTypes: DEFAULT_DOCUMENT_TYPES };
  }
}
