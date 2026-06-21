import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Settings } from "@/types/database";

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  college_name: "Nandom Nursing and Midwifery Training College",
  motto: "Excellence in Nursing and Midwifery Education",
  logo_url: null,
  primary_color: "#1A5E3A",
  accent_color: "#9A1B2F",
  phone_main: "+233 37 202 1234",
  phone_admissions: "+233 37 202 1235",
  phone_finance: "+233 37 202 1236",
  email_main: "info@nmtc.edu.gh",
  email_admissions: "admissions@nmtc.edu.gh",
  email_finance: "finance@nmtc.edu.gh",
  address: "Nandom, Upper West Region, Ghana",
  google_maps_url:
    "https://maps.google.com/maps?q=Nandom,+Upper+West+Region,+Ghana&output=embed",
  office_hours: "Monday – Friday, 8:00 AM – 4:00 PM",
  facebook_url: null,
  instagram_url: null,
  x_url: null,
  whatsapp: null,
  domain: "nmtc.edu.gh",
  default_language: "en",
  notification_email_template: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }

    return data as Settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
