import { createClient } from "@/lib/supabase/server";
import {
  PREVIEW_FEES,
  PREVIEW_FINANCIAL_AID,
  PREVIEW_PAYMENT_METHODS,
  PREVIEW_PROGRAMS,
  PREVIEW_SCHOLARSHIPS,
} from "@/lib/data/preview-expansion";
import type {
  FeeWithProgram,
  FinancialAidContent,
  PaymentMethod,
  Scholarship,
} from "@/lib/types/expansion";

export type FinancialAidAdminData = {
  fees: FeeWithProgram[];
  paymentMethods: PaymentMethod[];
  scholarships: Scholarship[];
  content: FinancialAidContent | null;
  programs: { id: string; name: string }[];
};

const previewFinancialAid = (): FinancialAidAdminData => ({
  fees: PREVIEW_FEES,
  paymentMethods: PREVIEW_PAYMENT_METHODS,
  scholarships: PREVIEW_SCHOLARSHIPS,
  content: PREVIEW_FINANCIAL_AID,
  programs: PREVIEW_PROGRAMS.map((program) => ({
    id: program.id,
    name: program.name,
  })),
});

export async function getFinancialAidForEdit(): Promise<FinancialAidAdminData> {
  try {
  const supabase = await createClient();
  const [feesRes, methodsRes, scholarshipsRes, contentRes, programsRes] =
    await Promise.all([
      supabase
        .from("fees")
        .select("*, program:programs(name, slug)")
        .order("sort_order"),
      supabase.from("payment_methods").select("*").order("sort_order"),
      supabase.from("scholarships").select("*").order("sort_order"),
      supabase.from("financial_aid_content").select("*").eq("id", 1).single(),
      supabase.from("programs").select("id, name").order("name"),
    ]);

  const fees = ((feesRes.data ?? []) as Array<Record<string, unknown>>).map(
    (row) => {
      const prog = row.program as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null;
      const program = Array.isArray(prog) ? prog[0] : prog;
      const { program: _p, ...fee } = row;

      let components = fee.components as import("@/lib/types/expansion").FeeComponent[] | undefined;
      let dueNote = String(fee.due_note ?? "");
      if (dueNote.startsWith("__COMPONENTS__:")) {
        try {
          const parsed = JSON.parse(dueNote.replace("__COMPONENTS__:", ""));
          components = parsed.components;
          dueNote = parsed.note ?? "";
        } catch {}
      }

      return {
        ...fee,
        due_note: dueNote,
        components: components ?? fee.components,
        program: program ?? null,
      } as FeeWithProgram;
    }
  );

  if (fees.length === 0) return previewFinancialAid();

  return {
    fees,
    paymentMethods: (methodsRes.data ?? []) as PaymentMethod[],
    scholarships: (scholarshipsRes.data ?? []) as Scholarship[],
    content: (contentRes.data as FinancialAidContent) ?? PREVIEW_FINANCIAL_AID,
    programs: (programsRes.data ?? []) as { id: string; name: string }[],
  };
  } catch {
    return previewFinancialAid();
  }
}
