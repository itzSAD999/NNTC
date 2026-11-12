import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  PREVIEW_FEES,
  PREVIEW_FINANCIAL_AID,
  PREVIEW_PAYMENT_METHODS,
  PREVIEW_SCHOLARSHIPS,
} from "@/lib/data/preview-expansion";
import type {
  FeeWithProgram,
  FinancialAidContent,
  PaymentMethod,
  Scholarship,
} from "@/lib/types/expansion";

export type FinancialAidPageData = {
  fees: FeeWithProgram[];
  paymentMethods: PaymentMethod[];
  scholarships: Scholarship[];
  content: FinancialAidContent;
};

export async function getFinancialAidPageData(): Promise<FinancialAidPageData> {
  if (!isSupabaseConfigured()) {
    return {
      fees: PREVIEW_FEES,
      paymentMethods: PREVIEW_PAYMENT_METHODS,
      scholarships: PREVIEW_SCHOLARSHIPS,
      content: PREVIEW_FINANCIAL_AID,
    };
  }

  try {
    const supabase = await createClient();
    const [feesRes, methodsRes, scholarshipsRes, contentRes] = await Promise.all([
      supabase
        .from("fees")
        .select("*, program:programs(name, slug)")
        .order("sort_order"),
      supabase.from("payment_methods").select("*").order("sort_order"),
      supabase.from("scholarships").select("*").order("sort_order"),
      supabase.from("financial_aid_content").select("*").eq("id", 1).single(),
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

    const dbScholarships = (scholarshipsRes.data ?? []) as Scholarship[];
    const hasHub = dbScholarships.some(
      (s) =>
        s.name.toLowerCase().includes("scholarship hub") ||
        s.name.toLowerCase().includes("secretariat")
    );
    const scholarships = dbScholarships.length
      ? (hasHub ? dbScholarships : [PREVIEW_SCHOLARSHIPS[0], ...dbScholarships])
      : PREVIEW_SCHOLARSHIPS;

    return {
      fees: fees.length ? fees : PREVIEW_FEES,
      paymentMethods: methodsRes.data?.length
        ? (methodsRes.data as PaymentMethod[])
        : PREVIEW_PAYMENT_METHODS,
      scholarships,
      content:
        (contentRes.data as FinancialAidContent) ?? PREVIEW_FINANCIAL_AID,
    };
  } catch {
    return {
      fees: PREVIEW_FEES,
      paymentMethods: PREVIEW_PAYMENT_METHODS,
      scholarships: PREVIEW_SCHOLARSHIPS,
      content: PREVIEW_FINANCIAL_AID,
    };
  }
}
