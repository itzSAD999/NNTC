import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSettings } from "@/lib/data/settings";

export interface VerificationResult {
  found: boolean;
  referenceNo: string;
  studentName?: string;
  documentType?: string;
  status?: string;
  isVerified?: boolean;
  isPending?: boolean;
  issuedAt?: string;
  collegeName: string;
  message?: string;
}

export async function verifyDocumentByReference(
  rawRef: string
): Promise<VerificationResult> {
  const ref = rawRef.trim().toUpperCase();
  const settings = await getSettings();
  const collegeName = settings.college_name || "Nursing and Midwifery Training College";

  if (!ref) {
    return {
      found: false,
      referenceNo: "",
      collegeName,
      message: "Please enter a valid document reference number.",
    };
  }

  // Handle local dev preview / when Supabase is unlinked
  if (!isSupabaseConfigured()) {
    if (ref.startsWith("NMTC-") || ref.startsWith("TRN-") || ref.includes("-202")) {
      return {
        found: true,
        referenceNo: ref,
        studentName: "Ama Mensah",
        documentType: "Official Academic Transcript",
        status: "approved",
        isVerified: true,
        isPending: false,
        issuedAt: new Date().toISOString(),
        collegeName,
      };
    }
    return {
      found: false,
      referenceNo: ref,
      collegeName,
      message: "No document matching this reference number was found in the institutional registry.",
    };
  }

  try {
    const supabase = createAdminClient();
    const { data: request, error } = await supabase
      .from("requests")
      .select(`
        id,
        reference_no,
        student_name,
        status,
        created_at,
        updated_at,
        document_types (
          name
        ),
        request_events (
          action,
          created_at
        )
      `)
      .eq("reference_no", ref)
      .maybeSingle();

    if (error || !request) {
      return {
        found: false,
        referenceNo: ref,
        collegeName,
        message:
          "No record matching this reference number was found. Please check the reference printed on the document.",
      };
    }

    const docRel = request.document_types as unknown as
      | { name: string }
      | { name: string }[]
      | null;
    const documentType = Array.isArray(docRel)
      ? docRel[0]?.name
      : docRel?.name ?? "Official Document";

    // Find the timestamp when the document was approved by the Principal / issued
    const events = (request.request_events as unknown as { action: string; created_at: string }[]) || [];
    const approvalEvent = events.find((e) => e.action === "approved" || e.action === "collected");
    const issuedAt = approvalEvent?.created_at ?? request.updated_at ?? request.created_at;

    const isVerified = request.status === "approved" || request.status === "collected";
    const isPending =
      request.status === "submitted" ||
      request.status === "academic_approved" ||
      request.status === "payment_confirmed";

    return {
      found: true,
      referenceNo: request.reference_no,
      studentName: request.student_name,
      documentType,
      status: request.status,
      isVerified,
      isPending,
      issuedAt,
      collegeName,
    };
  } catch {
    return {
      found: false,
      referenceNo: ref,
      collegeName,
      message: "An unexpected error occurred while verifying this document. Please try again.",
    };
  }
}
