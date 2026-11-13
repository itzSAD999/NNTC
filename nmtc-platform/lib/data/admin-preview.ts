import type { AuditEventRow } from "@/lib/data/admin-audit";
import type { RequestWithDocType } from "@/lib/data/dashboard-requests";
import { DEFAULT_DOCUMENT_TYPES } from "@/lib/data/document-types";
import { PREVIEW_POSTS } from "@/lib/data/preview";
import {
  PREVIEW_EVENTS,
  PREVIEW_RESOURCES,
  previewGalleryAlbums,
  previewProgramsWithDepartments,
  previewPublishedStaff,
} from "@/lib/data/preview-expansion";
import type { ContactMessage, Request, StaffAccount } from "@/types/database";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

const DOC = {
  transcript: DEFAULT_DOCUMENT_TYPES[0],
  attestation: DEFAULT_DOCUMENT_TYPES[1],
  english: DEFAULT_DOCUMENT_TYPES[2],
};

function request(
  partial: Pick<
    Request,
    | "id"
    | "reference_no"
    | "student_name"
    | "student_id"
    | "student_email"
    | "status"
    | "document_type_id"
    | "amount_expected"
    | "purpose"
  > &
    Partial<Request> & { doc: { name: string; fee_amount: number } }
): RequestWithDocType {
  const { doc, ...rest } = partial;
  return {
    student_phone: "+233 24 555 0100",
    program: "General Nursing",
    year_completed: "2024",
    delivery_method: "collection",
    receipt_url: null,
    created_at: daysAgo(3),
    updated_at: daysAgo(1),
    ...rest,
    document_types: { name: doc.name, fee_amount: doc.fee_amount },
  };
}

export const PREVIEW_REQUESTS: RequestWithDocType[] = [
  request({
    id: "preview-req-01",
    reference_no: "NMTC-TR-2026-0042",
    student_name: "Amina Kuuzie",
    student_id: "NMTC/RGN/21/014",
    student_email: "amina.kuuzie@example.com",
    student_phone: "+233 24 811 2044",
    status: "submitted",
    document_type_id: DOC.transcript.id,
    amount_expected: DOC.transcript.fee_amount,
    purpose: "University of Ghana postgraduate application",
    created_at: daysAgo(1),
    doc: DOC.transcript,
  }),
  request({
    id: "preview-req-02",
    reference_no: "NMTC-AT-2026-0018",
    student_name: "Emmanuel Dakurah",
    student_id: "NMTC/RGN/20/008",
    student_email: "e.dakurah@example.com",
    status: "submitted",
    document_type_id: DOC.attestation.id,
    amount_expected: DOC.attestation.fee_amount,
    purpose: "Ghana College of Nurses and Midwives",
    created_at: daysAgo(2),
    doc: DOC.attestation,
  }),
  request({
    id: "preview-req-03",
    reference_no: "NMTC-TR-2026-0039",
    student_name: "Mary Naah",
    student_id: "NMTC/MW/19/022",
    student_email: "mary.naah@example.com",
    program: "General Midwifery",
    status: "academic_approved",
    document_type_id: DOC.transcript.id,
    amount_expected: DOC.transcript.fee_amount,
    purpose: "UK NMC registration",
    delivery_method: "email",
    created_at: daysAgo(4),
    doc: DOC.transcript,
  }),
  request({
    id: "preview-req-04",
    reference_no: "NMTC-EP-2026-0007",
    student_name: "Ibrahim Sulemana",
    student_id: "NMTC/RGN/18/031",
    student_email: "ibrahim.s@example.com",
    status: "academic_approved",
    document_type_id: DOC.english.id,
    amount_expected: DOC.english.fee_amount,
    purpose: "Embassy of Canada study visa",
    delivery_method: "email",
    created_at: daysAgo(5),
    doc: DOC.english,
  }),
  request({
    id: "preview-req-05",
    reference_no: "NMTC-TR-2026-0031",
    student_name: "Comfort Bawumia",
    student_id: "NMTC/MW/20/011",
    student_email: "c.bawumia@example.com",
    program: "General Midwifery",
    status: "payment_confirmed",
    document_type_id: DOC.transcript.id,
    amount_expected: DOC.transcript.fee_amount,
    purpose: "Employment at St. Theresa's Hospital",
    created_at: daysAgo(6),
    doc: DOC.transcript,
  }),
  request({
    id: "preview-req-06",
    reference_no: "NMTC-AT-2026-0012",
    student_name: "Peter Yirimea",
    student_id: "NMTC/RGN/17/004",
    student_email: "peter.yirimea@example.com",
    status: "approved",
    document_type_id: DOC.attestation.id,
    amount_expected: DOC.attestation.fee_amount,
    purpose: "Ministry of Health posting",
    created_at: daysAgo(12),
    doc: DOC.attestation,
  }),
  request({
    id: "preview-req-07",
    reference_no: "NMTC-TR-2025-0188",
    student_name: "Grace Puozuing",
    student_id: "NMTC/MW/16/009",
    student_email: "grace.p@example.com",
    program: "General Midwifery",
    status: "collected",
    document_type_id: DOC.transcript.id,
    amount_expected: DOC.transcript.fee_amount,
    purpose: "Further studies — KNUST",
    created_at: daysAgo(20),
    doc: DOC.transcript,
  }),
  request({
    id: "preview-req-08",
    reference_no: "NMTC-TR-2026-0028",
    student_name: "Daniel Kpema",
    student_id: "NMTC/RGN/22/041",
    student_email: "d.kpema@example.com",
    status: "returned",
    document_type_id: DOC.transcript.id,
    amount_expected: DOC.transcript.fee_amount,
    purpose: "Scholarship board",
    created_at: daysAgo(3),
    doc: DOC.transcript,
  }),
];

export const PREVIEW_MESSAGES: ContactMessage[] = [
  {
    id: "preview-msg-01",
    name: "Agnes Dery",
    email: "agnes.dery@example.com",
    phone: "+233 20 444 1188",
    subject: "Admissions",
    message:
      "Please confirm the WASSCE grades needed for Registered General Nursing for 2026/2027.",
    is_read: false,
    created_at: daysAgo(0),
  },
  {
    id: "preview-msg-02",
    name: "Kwame Osei",
    email: "kwame.osei@sttheresas.org",
    phone: "+233 24 900 2211",
    subject: "Verification",
    message:
      "We need to confirm a 2023 midwifery graduate before issuing a ward posting letter.",
    is_read: false,
    created_at: daysAgo(1),
  },
  {
    id: "preview-msg-03",
    name: "Lydia Naa",
    email: "lydia.naa@example.com",
    phone: null,
    subject: "Fees",
    message: "Can hostel fees be paid in two instalments this semester?",
    is_read: true,
    created_at: daysAgo(4),
  },
];

export const PREVIEW_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: "preview-user-01",
    full_name: "Sr. Theresa Dery",
    email: "principal@nmtc.edu.gh",
    role: "principal",
    is_active: true,
    created_at: daysAgo(400),
    updated_at: daysAgo(10),
  },
  {
    id: "preview-user-02",
    full_name: "Mr. Francis Kuukpen",
    email: "academic@nmtc.edu.gh",
    role: "academic",
    is_active: true,
    created_at: daysAgo(300),
    updated_at: daysAgo(8),
  },
  {
    id: "preview-user-03",
    full_name: "Mrs. Helen Bayor",
    email: "accounts@nmtc.edu.gh",
    role: "accounts",
    is_active: true,
    created_at: daysAgo(280),
    updated_at: daysAgo(6),
  },
  {
    id: "preview-user-04",
    full_name: "Ms. Rita Naalognong",
    email: "editor@nmtc.edu.gh",
    role: "content_editor",
    is_active: true,
    created_at: daysAgo(120),
    updated_at: daysAgo(2),
  },
  {
    id: "preview-user-05",
    full_name: "Admin Desk",
    email: "admin@nmtc.edu.gh",
    role: "super_admin",
    is_active: true,
    created_at: daysAgo(500),
    updated_at: daysAgo(1),
  },
];

export const PREVIEW_AUDIT: AuditEventRow[] = [
  {
    id: "preview-audit-01",
    action: "academic_approved",
    actor_label: "Mr. Francis Kuukpen",
    note: "Academic records verified.",
    created_at: daysAgo(4),
    request_id: "preview-req-03",
    reference_no: "NMTC-TR-2026-0039",
    request_status: "academic_approved",
  },
  {
    id: "preview-audit-02",
    action: "payment_confirmed",
    actor_label: "Mrs. Helen Bayor",
    note: "MoMo receipt NMTC-PAY-8841 matched.",
    created_at: daysAgo(5),
    request_id: "preview-req-05",
    reference_no: "NMTC-TR-2026-0031",
    request_status: "payment_confirmed",
  },
  {
    id: "preview-audit-03",
    action: "principal_approved",
    actor_label: "Sr. Theresa Dery",
    note: "Signed and issued.",
    created_at: daysAgo(12),
    request_id: "preview-req-06",
    reference_no: "NMTC-AT-2026-0012",
    request_status: "approved",
  },
  {
    id: "preview-audit-04",
    action: "returned",
    actor_label: "Mr. Francis Kuukpen",
    note: "Student ID does not match academic register.",
    created_at: daysAgo(3),
    request_id: "preview-req-08",
    reference_no: "NMTC-TR-2026-0028",
    request_status: "returned",
  },
];

export function previewRequestsByStatus(
  statuses: RequestWithDocType["status"][]
): RequestWithDocType[] {
  return PREVIEW_REQUESTS.filter((r) => statuses.includes(r.status));
}

export function previewRequestById(id: string): RequestWithDocType | null {
  return PREVIEW_REQUESTS.find((r) => r.id === id) ?? null;
}

export function previewContentCounts() {
  return {
    programs: previewProgramsWithDepartments(),
    posts: PREVIEW_POSTS,
    events: PREVIEW_EVENTS,
    resources: PREVIEW_RESOURCES,
    gallery: previewGalleryAlbums(),
    staff: previewPublishedStaff(),
  };
}

export function withPreview<T>(live: T[] | null | undefined, preview: T[]): T[] {
  if (!live || live.length === 0) return preview;
  return live;
}

export function isPreviewId(id: string | null | undefined): boolean {
  if (!id) return false;
  return (
    id.startsWith("preview-") || id.startsWith("00000000-0000-4000-8000-")
  );
}

export function listLooksPreviewed(items: Array<{ id: string }>): boolean {
  return items.length > 0 && items.every((item) => isPreviewId(item.id));
}

export function previewEventsForRequest(id: string) {
  const req = previewRequestById(id);
  if (!req) return [];

  const events: Array<{
    id: string;
    request_id: string;
    actor_id: string | null;
    actor_label: string;
    action: string;
    note: string | null;
    created_at: string;
    actor: { full_name: string } | null;
  }> = [
    {
      id: `${id}-ev-submitted`,
      request_id: id,
      actor_id: null,
      actor_label: req.student_name,
      action: "submitted",
      note: "Submitted online with supporting details.",
      created_at: req.created_at,
      actor: null,
    },
  ];

  const later = (days: number) =>
    new Date(new Date(req.created_at).getTime() + days * 36e5 * 24).toISOString();

  if (
    ["academic_approved", "payment_confirmed", "approved", "returned"].includes(
      req.status
    )
  ) {
    events.push({
      id: `${id}-ev-academic`,
      request_id: id,
      actor_id: "preview-user-02",
      actor_label: "Mr. Francis Kuukpen",
      action: req.status === "returned" ? "returned" : "academic_approved",
      note:
        req.status === "returned"
          ? "Student ID does not match the academic register."
          : "Academic records verified.",
      created_at: later(1),
      actor: { full_name: "Mr. Francis Kuukpen" },
    });
  }

  if (["payment_confirmed", "approved"].includes(req.status)) {
    events.push({
      id: `${id}-ev-accounts`,
      request_id: id,
      actor_id: "preview-user-03",
      actor_label: "Mrs. Helen Bayor",
      action: "payment_confirmed",
      note: "Payment matched to the issued invoice.",
      created_at: later(2),
      actor: { full_name: "Mrs. Helen Bayor" },
    });
  }

  if (req.status === "approved") {
    events.push({
      id: `${id}-ev-principal`,
      request_id: id,
      actor_id: "preview-user-01",
      actor_label: "Sr. Theresa Dery",
      action: "principal_approved",
      note: "Signed and issued.",
      created_at: later(3),
      actor: { full_name: "Sr. Theresa Dery" },
    });
  }

  return events;
}
