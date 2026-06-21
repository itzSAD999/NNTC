import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DocumentType } from "@/types/database";

export const DEFAULT_DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Official Transcript",
    code: "TR",
    fee_amount: 50,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Attestation Letter",
    code: "AT",
    fee_amount: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getActiveDocumentTypes(): Promise<DocumentType[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_DOCUMENT_TYPES;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("document_types")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error || !data?.length) {
      return DEFAULT_DOCUMENT_TYPES;
    }

    return data as DocumentType[];
  } catch {
    return DEFAULT_DOCUMENT_TYPES;
  }
}

export async function getDocumentTypeById(
  id: string
): Promise<DocumentType | null> {
  const types = await getActiveDocumentTypes();
  return types.find((t) => t.id === id) ?? null;
}
