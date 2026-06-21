import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  PREVIEW_ADMISSIONS,
  PREVIEW_ADMISSIONS_FAQS,
  PREVIEW_DOCUMENTS_REQUIRED,
} from "@/lib/data/preview-expansion";
import type {
  AdmissionsContent,
  AdmissionsFaq,
  DocumentRequired,
} from "@/lib/types/expansion";

export type AdmissionsPageData = {
  content: AdmissionsContent;
  documents: DocumentRequired[];
  faqs: AdmissionsFaq[];
};

export async function getAdmissionsPageData(): Promise<AdmissionsPageData> {
  if (!isSupabaseConfigured()) {
    return {
      content: PREVIEW_ADMISSIONS,
      documents: PREVIEW_DOCUMENTS_REQUIRED,
      faqs: PREVIEW_ADMISSIONS_FAQS,
    };
  }

  try {
    const supabase = await createClient();
    const [contentRes, docsRes, faqsRes] = await Promise.all([
      supabase.from("admissions_content").select("*").eq("id", 1).single(),
      supabase.from("documents_required").select("*").order("sort_order"),
      supabase.from("admissions_faqs").select("*").order("sort_order"),
    ]);

    return {
      content: (contentRes.data as AdmissionsContent) ?? PREVIEW_ADMISSIONS,
      documents: (docsRes.data as DocumentRequired[]) ?? PREVIEW_DOCUMENTS_REQUIRED,
      faqs: (faqsRes.data as AdmissionsFaq[]) ?? PREVIEW_ADMISSIONS_FAQS,
    };
  } catch {
    return {
      content: PREVIEW_ADMISSIONS,
      documents: PREVIEW_DOCUMENTS_REQUIRED,
      faqs: PREVIEW_ADMISSIONS_FAQS,
    };
  }
}
