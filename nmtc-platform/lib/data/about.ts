import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AboutContent } from "@/types/database";

export interface Accreditation {
  id: string;
  body_name: string;
  accreditation_no: string | null;
  logo_url: string | null;
  sort_order: number;
}

export const DEFAULT_ACCREDITATIONS: Accreditation[] = [
  {
    id: "00000000-0000-4000-8000-000000000201",
    body_name: "Nursing & Midwifery Council of Ghana",
    accreditation_no: "NMC/GH/REG",
    logo_url: null,
    sort_order: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000202",
    body_name: "Ministry of Health, Ghana",
    accreditation_no: null,
    logo_url: null,
    sort_order: 2,
  },
];

export const DEFAULT_ABOUT: AboutContent = {
  id: 1,
  history: `<p>Nandom Nursing and Midwifery Training College was established to address the growing need for skilled nursing and midwifery professionals in the Upper West Region and across Ghana.</p>
<p>Through rigorous academic training and supervised clinical practice, the college prepares graduates who serve with competence, compassion, and professional integrity.</p>`,
  vision: "To be a centre of excellence in nursing and midwifery education in Ghana.",
  mission:
    "To train competent, compassionate nurses and midwives who serve with integrity.",
  core_values: ["Integrity", "Excellence", "Compassion", "Professionalism"],
  principal_name: "Dr. [Principal Name]",
  principal_title: "Principal",
  principal_message: `<p>Welcome to Nandom Nursing and Midwifery Training College. Our institution is committed to producing healthcare professionals who combine clinical excellence with a deep sense of service to community.</p>
<p>Whether you are a prospective student, graduate, or partner institution, we invite you to explore what NMTC has to offer.</p>`,
  principal_photo_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getAboutContent(): Promise<AboutContent> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_ABOUT;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return DEFAULT_ABOUT;
    }

    return data as AboutContent;
  } catch {
    return DEFAULT_ABOUT;
  }
}

export async function getAccreditations(): Promise<Accreditation[]> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_ACCREDITATIONS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("accreditations")
      .select("id, body_name, accreditation_no, logo_url, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_ACCREDITATIONS;
    }

    return data as Accreditation[];
  } catch {
    return DEFAULT_ACCREDITATIONS;
  }
}
