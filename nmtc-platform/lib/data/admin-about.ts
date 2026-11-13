import { createClient } from "@/lib/supabase/server";
import { DEFAULT_ABOUT, DEFAULT_ACCREDITATIONS } from "@/lib/data/about";
import { PREVIEW_ORG_UNITS } from "@/lib/data/preview-expansion";
import type { Accreditation } from "@/lib/data/about";
import type { OrgUnit } from "@/lib/types/expansion";
import type { AboutContent } from "@/types/database";

export type AboutAdminData = {
  about: AboutContent;
  accreditations: Accreditation[];
  orgUnits: OrgUnit[];
};

export async function getAboutForEdit(): Promise<AboutAdminData> {
  const preview: AboutAdminData = {
    about: DEFAULT_ABOUT,
    accreditations: DEFAULT_ACCREDITATIONS,
    orgUnits: PREVIEW_ORG_UNITS,
  };

  try {
    const supabase = await createClient();
    const [aboutRes, accRes, orgRes] = await Promise.all([
      supabase.from("about_content").select("*").eq("id", 1).single(),
      supabase.from("accreditations").select("*").order("sort_order"),
      supabase.from("org_units").select("*").order("sort_order"),
    ]);

    const accreditations = (accRes.data ?? []) as Accreditation[];
    const orgUnits = (orgRes.data ?? []) as OrgUnit[];
    if (!aboutRes.data && accreditations.length === 0 && orgUnits.length === 0) {
      return preview;
    }

    return {
      about: (aboutRes.data as AboutContent) ?? DEFAULT_ABOUT,
      accreditations: accreditations.length ? accreditations : DEFAULT_ACCREDITATIONS,
      orgUnits: orgUnits.length ? orgUnits : PREVIEW_ORG_UNITS,
    };
  } catch {
    return preview;
  }
}
