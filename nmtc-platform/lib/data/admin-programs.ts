import { createClient } from "@/lib/supabase/server";
import type {
  AdmissionsContent,
  AdmissionsFaq,
  Department,
  DocumentRequired,
  ProgramDetail,
  ProgramModule,
  ProgramWithDepartment,
} from "@/lib/types/expansion";

export async function listAllPrograms(): Promise<ProgramWithDepartment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*, department:departments(name, slug)")
    .order("sort_order");

  if (error || !data) return [];

  return (data as Array<Record<string, unknown>>).map((row) => {
    const dept = row.department as
      | { name: string; slug: string }
      | { name: string; slug: string }[]
      | null;
    const department = Array.isArray(dept) ? dept[0] : dept;
    const { department: _d, ...program } = row;
    return { ...program, department: department ?? null } as ProgramWithDepartment;
  });
}

export async function listDepartments(): Promise<Department[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("departments")
    .select("*")
    .order("name");

  return (data ?? []) as Department[];
}

export async function getProgramForEdit(id: string): Promise<ProgramDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("*, department:departments(name, slug), modules:program_modules(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const dept = row.department as
    | { name: string; slug: string }
    | { name: string; slug: string }[]
    | null;
  const modules = (row.modules as ProgramModule[]) ?? [];
  const department = Array.isArray(dept) ? dept[0] : dept;
  const { department: _d, modules: _m, ...program } = row;

  return {
    ...(program as Omit<ProgramDetail, "department" | "modules">),
    department: department ?? null,
    modules: [...modules].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export type AdmissionsAdminData = {
  content: AdmissionsContent;
  documents: DocumentRequired[];
  faqs: AdmissionsFaq[];
};

export async function getAdmissionsForEdit(): Promise<AdmissionsAdminData> {
  const supabase = await createClient();
  const [contentRes, docsRes, faqsRes] = await Promise.all([
    supabase.from("admissions_content").select("*").eq("id", 1).single(),
    supabase.from("documents_required").select("*").order("sort_order"),
    supabase.from("admissions_faqs").select("*").order("sort_order"),
  ]);

  const fallback: AdmissionsContent = {
    id: 1,
    process_steps: [],
    application_form_url: null,
    application_fee: null,
    payment_instructions: "",
    academic_calendar: "",
    selection_criteria: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    content: (contentRes.data as AdmissionsContent) ?? fallback,
    documents: (docsRes.data ?? []) as DocumentRequired[],
    faqs: (faqsRes.data ?? []) as AdmissionsFaq[],
  };
}
