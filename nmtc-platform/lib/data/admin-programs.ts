import {
  PREVIEW_ADMISSIONS,
  PREVIEW_ADMISSIONS_FAQS,
  PREVIEW_DEPARTMENTS,
  PREVIEW_DOCUMENTS_REQUIRED,
  PREVIEW_PROGRAM_MODULES,
  previewProgramsWithDepartments,
} from "@/lib/data/preview-expansion";
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
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*, department:departments(name, slug)")
      .order("sort_order");

    if (error || !data || data.length === 0) return previewProgramsWithDepartments();

    return (data as Array<Record<string, unknown>>).map((row) => {
      const dept = row.department as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null;
      const department = Array.isArray(dept) ? dept[0] : dept;
      const { department: _d, ...program } = row;
      return { ...program, department: department ?? null } as ProgramWithDepartment;
    });
  } catch {
    return previewProgramsWithDepartments();
  }
}

export async function listDepartments(): Promise<Department[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("departments").select("*").order("name");
    if (!data || data.length === 0) return PREVIEW_DEPARTMENTS;
    return data as Department[];
  } catch {
    return PREVIEW_DEPARTMENTS;
  }
}

function previewProgramDetail(id: string): ProgramDetail | null {
  const program = previewProgramsWithDepartments().find((row) => row.id === id);
  if (!program) return null;
  return {
    ...program,
    modules: PREVIEW_PROGRAM_MODULES.filter((mod) => mod.program_id === id).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}

export async function getProgramForEdit(id: string): Promise<ProgramDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("*, department:departments(name, slug), modules:program_modules(*)")
      .eq("id", id)
      .single();

    if (error || !data) return previewProgramDetail(id);

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
  } catch {
    return previewProgramDetail(id);
  }
}

export type AdmissionsAdminData = {
  content: AdmissionsContent;
  documents: DocumentRequired[];
  faqs: AdmissionsFaq[];
};

export async function getAdmissionsForEdit(): Promise<AdmissionsAdminData> {
  const preview: AdmissionsAdminData = {
    content: PREVIEW_ADMISSIONS,
    documents: PREVIEW_DOCUMENTS_REQUIRED,
    faqs: PREVIEW_ADMISSIONS_FAQS,
  };

  try {
    const supabase = await createClient();
    const [contentRes, docsRes, faqsRes] = await Promise.all([
      supabase.from("admissions_content").select("*").eq("id", 1).single(),
      supabase.from("documents_required").select("*").order("sort_order"),
      supabase.from("admissions_faqs").select("*").order("sort_order"),
    ]);

    const documents = (docsRes.data ?? []) as DocumentRequired[];
    const faqs = (faqsRes.data ?? []) as AdmissionsFaq[];
    if (!contentRes.data && documents.length === 0 && faqs.length === 0) {
      return preview;
    }

    return {
      content: (contentRes.data as AdmissionsContent) ?? PREVIEW_ADMISSIONS,
      documents: documents.length ? documents : PREVIEW_DOCUMENTS_REQUIRED,
      faqs: faqs.length ? faqs : PREVIEW_ADMISSIONS_FAQS,
    };
  } catch {
    return preview;
  }
}
