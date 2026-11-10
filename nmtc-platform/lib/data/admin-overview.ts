import { createClient } from "@/lib/supabase/server";

export type AdminOverviewMetrics = {
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

export async function getAdminOverviewMetrics(): Promise<AdminOverviewMetrics> {
  const supabase = await createClient();

  // 1. Fetch request counts and latest 5
  const { data: requestRows } = await supabase
    .from("requests")
    .select("id, reference_no, student_name, student_id, status, created_at, amount_expected, document_types(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = requestRows ?? [];

  const submitted = rows.filter((r) => r.status === "submitted").length;
  const academicApproved = rows.filter((r) => r.status === "academic_approved").length;
  const paymentConfirmed = rows.filter((r) => r.status === "payment_confirmed").length;
  const approved = rows.filter((r) => r.status === "approved" || r.status === "collected").length;
  const returned = rows.filter((r) => r.status === "returned").length;
  const total = rows.length;

  const recentRequests = rows.slice(0, 5).map((r) => {
    const docRel = r.document_types as { name: string } | { name: string }[] | null;
    const docName = Array.isArray(docRel) ? docRel[0]?.name : docRel?.name ?? "Document";
    return {
      id: r.id,
      reference_no: r.reference_no,
      student_name: r.student_name,
      student_id: r.student_id,
      status: r.status,
      created_at: r.created_at,
      docName,
      amountExpected: r.amount_expected,
    };
  });

  // 2. Fetch content counts
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

  return {
    requests: {
      submitted,
      academicApproved,
      paymentConfirmed,
      approved,
      returned,
      total,
    },
    content: {
      programsCount: programsCount ?? 0,
      postsCount: postsCount ?? 0,
      eventsCount: eventsCount ?? 0,
      messagesCount: messagesCount ?? 0,
      staffCount: staffCount ?? 0,
    },
    recentRequests,
  };
}

