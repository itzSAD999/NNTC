import { createClient } from "@/lib/supabase/server";
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

export async function getFinancialAidForEdit(): Promise<FinancialAidAdminData> {
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

  return {
    fees,
    paymentMethods: (methodsRes.data ?? []) as PaymentMethod[],
    scholarships: (scholarshipsRes.data ?? []) as Scholarship[],
    content: (contentRes.data as FinancialAidContent) ?? null,
    programs: (programsRes.data ?? []) as { id: string; name: string }[],
  };
}
