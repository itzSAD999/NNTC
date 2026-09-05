import { createAdminClient } from "@/lib/supabase/admin";
import { trackFormSchema } from "@/lib/validation/request";
import type { RequestFormValues } from "@/lib/validation/request";

export type ResubmitRequestData = {
  reference_no: string;
  defaults: RequestFormValues;
};

export async function getReturnedRequestForResubmit(
  referenceNo: string
): Promise<ResubmitRequestData | null> {
  const parsed = trackFormSchema.safeParse({ reference_no: referenceNo });
  if (!parsed.success) return null;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("requests")
      .select(
        "reference_no, status, student_name, student_id, student_email, student_phone, program, year_completed, document_type_id, purpose, delivery_method"
      )
      .eq("reference_no", parsed.data.reference_no)
      .single();

    if (error || !data || data.status !== "returned") return null;

    return {
      reference_no: data.reference_no,
      defaults: {
        student_name: data.student_name,
        student_id: data.student_id,
        student_email: data.student_email,
        student_phone: data.student_phone ?? undefined,
        program: data.program,
        year_completed: data.year_completed,
        document_type_id: data.document_type_id,
        purpose: data.purpose,
        delivery_method: data.delivery_method as RequestFormValues["delivery_method"],
      },
    };
  } catch {
    return null;
  }
}
