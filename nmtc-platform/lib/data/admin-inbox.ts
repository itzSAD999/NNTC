import { PREVIEW_MESSAGES, withPreview } from "@/lib/data/admin-preview";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/types/database";

export async function listContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return PREVIEW_MESSAGES;
    return withPreview(data as ContactMessage[], PREVIEW_MESSAGES);
  } catch {
    return PREVIEW_MESSAGES;
  }
}

export async function getContactMessage(
  id: string
): Promise<ContactMessage | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as ContactMessage;
}
