import { createClient } from "@/lib/supabase/server";
import type { Accreditation } from "@/lib/data/about";
import type { OrgUnit } from "@/lib/types/expansion";
import type { AboutContent } from "@/types/database";

export type AboutAdminData = {
  about: AboutContent;
  accreditations: Accreditation[];
  orgUnits: OrgUnit[];
};

export async function getAboutForEdit(): Promise<AboutAdminData> {
  const supabase = await createClient();
  const [aboutRes, accRes, orgRes] = await Promise.all([
    supabase.from("about_content").select("*").eq("id", 1).single(),
    supabase.from("accreditations").select("*").order("sort_order"),
    supabase.from("org_units").select("*").order("sort_order"),
  ]);

  return {
    about: (aboutRes.data ?? {
      id: 1,
      history: "",
      vision: "",
      mission: "",
      core_values: [],
      principal_name: null,
      principal_title: null,
      principal_message: null,
      principal_photo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }) as AboutContent,
    accreditations: (accRes.data ?? []) as Accreditation[],
    orgUnits: (orgRes.data ?? []) as OrgUnit[],
  };
}
