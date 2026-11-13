import { createClient } from "@/lib/supabase/server";
import {
  PREVIEW_MESSAGES,
  PREVIEW_REQUESTS,
  withPreview,
} from "@/lib/data/admin-preview";
import { PREVIEW_POSTS } from "@/lib/data/preview";
import {
  PREVIEW_EVENTS,
  previewProgramsWithDepartments,
  previewPublishedStaff,
} from "@/lib/data/preview-expansion";

export type AdminOverviewMetrics = {
  isPreview: boolean;
  requests: {
    submitted: number;
    academicApproved: number;
    paymentConfirmed: number;
    approved: number;
    returned: number;
    total: number;
  };
  content: {
    programsCount: number;
    postsCount: number;
    eventsCount: number;
    messagesCount: number;
    staffCount: number;
  };
  recentRequests: Array<{
    id: string;
    reference_no: string;
    student_name: string;
    student_id: string;
    status: string;
    created_at: string;
    docName: string;
    amountExpected: number;
  }>;
};

function metricsFromRows(
  rows: Array<{
    id: string;
    reference_no: string;
    student_name: string;
    student_id: string;
    status: string;
    created_at: string;
    amountExpected: number;
    docName: string;
  }>,
  content: AdminOverviewMetrics["content"],
  isPreview: boolean
): AdminOverviewMetrics {
  return {
    isPreview,
    requests: {
      submitted: rows.filter((r) => r.status === "submitted").length,
      academicApproved: rows.filter((r) => r.status === "academic_approved").length,
      paymentConfirmed: rows.filter((r) => r.status === "payment_confirmed").length,
      approved: rows.filter((r) => r.status === "approved" || r.status === "collected").length,
      returned: rows.filter((r) => r.status === "returned").length,
      total: rows.length,
    },
    content,
    recentRequests: rows.slice(0, 6),
  };
}

export async function getAdminOverviewMetrics(): Promise<AdminOverviewMetrics> {
  const previewRows = PREVIEW_REQUESTS.map((r) => ({
    id: r.id,
    reference_no: r.reference_no,
    student_name: r.student_name,
    student_id: r.student_id,
    status: r.status,
    created_at: r.created_at,
    amountExpected: r.amount_expected,
    docName: r.document_types?.name ?? "Document",
  }));
  const previewContent = {
    programsCount: previewProgramsWithDepartments().length,
    postsCount: PREVIEW_POSTS.length,
    eventsCount: PREVIEW_EVENTS.length,
    messagesCount: PREVIEW_MESSAGES.length,
    staffCount: previewPublishedStaff().length,
  };

  try {
    const supabase = await createClient();
    const { data: requestRows } = await supabase
      .from("requests")
      .select(
        "id, reference_no, student_name, student_id, status, created_at, amount_expected, document_types(name)"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    const liveRows = (requestRows ?? []).map((r) => {
      const docRel = r.document_types as { name: string } | { name: string }[] | null;
      const docName = Array.isArray(docRel) ? docRel[0]?.name : docRel?.name ?? "Document";
      return {
        id: r.id,
        reference_no: r.reference_no,
        student_name: r.student_name,
        student_id: r.student_id,
        status: r.status,
        created_at: r.created_at,
        amountExpected: r.amount_expected,
        docName,
      };
    });

    const [
      { count: programsCount },
      { count: postsCount },
      { count: eventsCount },
      { count: messagesCount },
      { count: staffCount },
    ] = await Promise.all([
      supabase.from("programs").select("*", { count: "exact", head: true }),
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("staff_profiles").select("*", { count: "exact", head: true }),
    ]);

    const rows = withPreview(liveRows, previewRows);
    const isPreview = liveRows.length === 0;
    const content = isPreview
      ? previewContent
      : {
          programsCount: programsCount ?? 0,
          postsCount: postsCount ?? 0,
          eventsCount: eventsCount ?? 0,
          messagesCount: messagesCount ?? 0,
          staffCount: staffCount ?? 0,
        };

    return metricsFromRows(rows, content, isPreview);
  } catch {
    return metricsFromRows(previewRows, previewContent, true);
  }
}
