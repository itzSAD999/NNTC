import type { Post } from "@/types/database";

const now = new Date();
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

export const PREVIEW_POSTS: Post[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    slug: "admissions-open-2026",
    title: "Admissions open for 2026/2027 academic year",
    body: `<p>Nandom Nursing and Midwifery Training College invites qualified applicants for the 2026/2027 academic year.</p>
<p>Programmes include General Nursing and Midwifery. Visit the Admissions office or contact us for entry requirements and deadlines.</p>
<p>Applications close on <strong>31 July 2026</strong>.</p>`,
    excerpt:
      "Applications are now open for General Nursing and Midwifery programmes. Deadline: 31 July 2026.",
    category: "Admissions",
    cover_image_url: null,
    is_pinned: true,
    published_at: daysAgo(2),
    author_id: null,
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    slug: "clinical-rotation-schedule",
    title: "Updated clinical rotation schedule published",
    body: `<p>The Academic Office has published the clinical rotation schedule for current students.</p>
<p>Students should collect printed copies from the Academic Office and confirm placements with their clinical instructors.</p>`,
    excerpt:
      "Current students: collect your clinical rotation schedule from the Academic Office.",
    category: "Academic",
    cover_image_url: null,
    is_pinned: false,
    published_at: daysAgo(8),
    author_id: null,
    created_at: daysAgo(8),
    updated_at: daysAgo(8),
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    slug: "graduation-ceremony-2025",
    title: "Congratulations to the Class of 2025",
    body: `<p>NMTC celebrated the graduation of nurses and midwives who completed their training with distinction.</p>
<p>We commend our graduates for their dedication and wish them success in serving communities across Ghana.</p>`,
    excerpt:
      "NMTC celebrates the Class of 2025 — nurses and midwives ready to serve Ghana's communities.",
    category: "News",
    cover_image_url: null,
    is_pinned: false,
    published_at: daysAgo(21),
    author_id: null,
    created_at: daysAgo(21),
    updated_at: daysAgo(21),
  },
];
