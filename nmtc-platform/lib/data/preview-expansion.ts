import type {
  AdmissionsContent,
  AdmissionsFaq,
  CampusSection,
  CollegeEvent,
  Department,
  DocumentRequired,
  Fee,
  FeeWithProgram,
  FinancialAidContent,
  GalleryAlbum,
  GalleryAlbumWithMedia,
  GalleryMedia,
  OrgUnit,
  PaymentMethod,
  Program,
  ProgramDetail,
  ProgramModule,
  ProgramWithDepartment,
  Resource,
  Scholarship,
  StaffProfile,
  StaffProfileWithDepartment,
} from "@/lib/types/expansion";

const DEPT_NURSING: Department = {
  id: "00000000-0000-4000-8000-000000000301",
  name: "Nursing",
  slug: "nursing",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEPT_MIDWIFERY: Department = {
  id: "00000000-0000-4000-8000-000000000302",
  name: "Midwifery",
  slug: "midwifery",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const PREVIEW_DEPARTMENTS = [DEPT_NURSING, DEPT_MIDWIFERY];

const PROGRAM_NURSING: Program = {
  id: "00000000-0000-4000-8000-000000000401",
  slug: "general-nursing",
  name: "General Nursing",
  department_id: DEPT_NURSING.id,
  duration: "3 years",
  qualification: "Diploma",
  entry_requirements:
    "<p>WASSCE credit passes in English, Mathematics, Integrated Science, and three elective subjects including Biology or Chemistry.</p>",
  description:
    "<p>A comprehensive nursing programme preparing students for professional nursing practice in hospitals and community settings.</p>",
  career_prospects:
    "<p>Graduates may work in hospitals, clinics, community health programmes, and pursue further studies in nursing.</p>",
  cutoff_points: "Aggregate 24 or better (contact Admissions for current cut-off)",
  is_published: true,
  sort_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const PROGRAM_MIDWIFERY: Program = {
  id: "00000000-0000-4000-8000-000000000402",
  slug: "general-midwifery",
  name: "General Midwifery",
  department_id: DEPT_MIDWIFERY.id,
  duration: "3 years",
  qualification: "Diploma",
  entry_requirements:
    "<p>WASSCE credit passes in English, Mathematics, Integrated Science, and three elective subjects including Biology.</p>",
  description:
    "<p>Training in safe midwifery care for women, newborns, and families across the continuum of pregnancy and childbirth.</p>",
  career_prospects:
    "<p>Graduates may work in maternity units, teaching hospitals, and community maternal health programmes.</p>",
  cutoff_points: null,
  is_published: true,
  sort_order: 2,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const PREVIEW_PROGRAMS: Program[] = [PROGRAM_NURSING, PROGRAM_MIDWIFERY];

export const PREVIEW_PROGRAM_MODULES: ProgramModule[] = [
  {
    id: "00000000-0000-4000-8000-000000000501",
    program_id: PROGRAM_NURSING.id,
    year_label: "Year 1",
    modules: ["Anatomy & Physiology", "Fundamentals of Nursing", "Microbiology"],
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000502",
    program_id: PROGRAM_MIDWIFERY.id,
    year_label: "Year 1",
    modules: ["Antenatal Care", "Fundamentals of Midwifery", "Community Health"],
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function previewProgramsWithDepartments(): ProgramWithDepartment[] {
  const deptMap = Object.fromEntries(
    PREVIEW_DEPARTMENTS.map((d) => [d.id, { name: d.name, slug: d.slug }])
  );
  return PREVIEW_PROGRAMS.filter((p) => p.is_published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => ({
      ...p,
      department: deptMap[p.department_id] ?? null,
    }));
}

export function previewProgramBySlug(slug: string): ProgramDetail | null {
  const program = PREVIEW_PROGRAMS.find((p) => p.slug === slug && p.is_published);
  if (!program) return null;
  const dept = PREVIEW_DEPARTMENTS.find((d) => d.id === program.department_id);
  return {
    ...program,
    department: dept ? { name: dept.name, slug: dept.slug } : null,
    modules: PREVIEW_PROGRAM_MODULES.filter((m) => m.program_id === program.id).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}

export const PREVIEW_ADMISSIONS: AdmissionsContent = {
  id: 1,
  process_steps: [
    {
      title: "Purchase form",
      body: "Obtain the application form from the Admissions Office or download when available.",
    },
    {
      title: "Submit documents",
      body: "Return the completed form with certified copies of required documents.",
    },
    {
      title: "Interview",
      body: "Shortlisted applicants will be invited for an interview.",
    },
    {
      title: "Admission offer",
      body: "Successful candidates receive an admission letter and fee schedule.",
    },
  ],
  application_form_url: null,
  application_fee: 150,
  payment_instructions:
    "Pay the application fee via bank transfer or mobile money. Keep your receipt.",
  academic_calendar:
    "Academic year typically runs September to July. Consult the Admissions Office for the current calendar.",
  selection_criteria:
    "Selection is based on WASSCE results, interview performance, and programme capacity.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const PREVIEW_DOCUMENTS_REQUIRED: DocumentRequired[] = [
  {
    id: "00000000-0000-4000-8000-000000000601",
    label: "Completed application form",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000602",
    label: "WASSCE results slip (certified copy)",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000603",
    label: "Birth certificate or national ID",
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const PREVIEW_ADMISSIONS_FAQS: AdmissionsFaq[] = [
  {
    id: "00000000-0000-4000-8000-000000000701",
    question: "When does admissions open?",
    answer:
      "Admissions typically open in the second quarter of each year. Check the News page or contact the Admissions Office for exact dates.",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000702",
    question: "Can I apply with awaiting results?",
    answer:
      "Applicants with awaiting WASSCE results may apply provisionally. Final admission depends on meeting entry requirements when results are released.",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const PREVIEW_FEES: FeeWithProgram[] = [
  {
    id: "00000000-0000-4000-8000-000000000801",
    program_id: null,
    year_label: "Year 1",
    fee_type: "Tuition",
    amount: 2800,
    due_note: "Payable at registration",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    program: null,
  },
  {
    id: "00000000-0000-4000-8000-000000000802",
    program_id: null,
    year_label: "Year 1",
    fee_type: "Registration",
    amount: 350,
    due_note: "Non-refundable",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    program: null,
  },
];

export const PREVIEW_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "00000000-0000-4000-8000-000000000901",
    method: "Bank transfer",
    details:
      "Ghana Commercial Bank — contact the Finance Office for the current account number.",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000902",
    method: "MTN Mobile Money",
    details: "Pay to the college MoMo merchant number displayed at the Finance Office.",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const PREVIEW_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "00000000-0000-4000-8000-000000000a01",
    name: "District Assembly Support",
    eligibility:
      "Students from the district with demonstrated financial need and strong academic record.",
    how_to_apply: "Apply through the Student Welfare Office during the first semester.",
    external_url: null,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const PREVIEW_FINANCIAL_AID: FinancialAidContent = {
  id: 1,
  payment_schedule:
    "Fees are typically due at registration at the start of each academic year. Installment arrangements may be discussed with the Finance Office.",
  sltf_info:
    "Eligible students may apply for the Student Loan Trust Fund (SLTF). Visit the SLTF website or the Finance Office for application windows and requirements.",
  hardship_policy:
    "Students facing genuine financial hardship should contact the Student Welfare Office with supporting documentation. Cases are reviewed confidentially.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const STAFF_SAMPLE: StaffProfile = {
  id: "00000000-0000-4000-8000-000000000b01",
  slug: "sample-lecturer",
  full_name: "Dr. Sample Lecturer",
  job_title: "Senior Lecturer",
  department_id: DEPT_NURSING.id,
  qualification: "MSc Nursing Education",
  photo_url: null,
  bio: "<p>Sample profile for development. Replace with real staff directory entries.</p>",
  work_email: "lecturer@nmtc.edu.gh",
  sort_order: 1,
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const PREVIEW_STAFF: StaffProfileWithDepartment[] = [
  {
    ...STAFF_SAMPLE,
    department: { name: DEPT_NURSING.name, slug: DEPT_NURSING.slug },
  },
];

export function previewPublishedStaff(): StaffProfileWithDepartment[] {
  return PREVIEW_STAFF.filter((s) => s.is_published).sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

export function previewStaffBySlug(slug: string): StaffProfileWithDepartment | null {
  return previewPublishedStaff().find((s) => s.slug === slug) ?? null;
}

export const PREVIEW_CAMPUS_SECTIONS: CampusSection[] = [
  {
    id: "00000000-0000-4000-8000-000000000c01",
    section_key: "overview",
    title: "Campus overview",
    body: "NMTC offers a supportive learning environment with classrooms, skills labs, and clinical placement partnerships.",
    image_url: "/images/campus-hero.jpg",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000c02",
    section_key: "accommodation",
    title: "Accommodation",
    body: "Limited hostel accommodation is available. Contact the Student Welfare Office for availability and fees.",
    image_url: "/images/lecture-hall.jpg",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000c03",
    section_key: "dining",
    title: "Clinical Skills & Dining",
    body: "Equipped nursing demonstration skills laboratories alongside a balanced college dining hall for hostel and day students.",
    image_url: "/images/clinical-care.jpg",
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const PREVIEW_GALLERY_ALBUM: GalleryAlbum = {
  id: "00000000-0000-4000-8000-000000000d01",
  title: "Campus Life",
  slug: "campus-life",
  sort_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const PREVIEW_GALLERY_MEDIA: GalleryMedia[] = [
  {
    id: "00000000-0000-4000-8000-000000000d11",
    album_id: "00000000-0000-4000-8000-000000000d01",
    type: "image",
    url: "/images/campus-hero.jpg",
    caption: "Student nurses walking across the Nandom NMTC main courtyard",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000d12",
    album_id: "00000000-0000-4000-8000-000000000d01",
    type: "image",
    url: "/images/clinical-care.jpg",
    caption: "Practical clinical skills training in the demonstration ward",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000d13",
    album_id: "00000000-0000-4000-8000-000000000d01",
    type: "image",
    url: "/images/lecture-hall.jpg",
    caption: "Interactive lecture session in the Main Academic Block",
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000d14",
    album_id: "00000000-0000-4000-8000-000000000d01",
    type: "image",
    url: "/images/healthcare-team.jpg",
    caption: "Community maternal and child health outreach in Nandom",
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000d15",
    album_id: "00000000-0000-4000-8000-000000000d01",
    type: "image",
    url: "/images/graduation.jpg",
    caption: "Graduating nursing and midwifery cohort celebrating induction",
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function previewGalleryAlbums(): GalleryAlbumWithMedia[] {
  return [
    {
      ...PREVIEW_GALLERY_ALBUM,
      media: PREVIEW_GALLERY_MEDIA,
    },
  ];
}

function futureDate(monthsAhead: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsAhead);
  return d.toISOString();
}

function pastDate(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toISOString();
}

export const PREVIEW_EVENTS: CollegeEvent[] = [
  {
    id: "00000000-0000-4000-8000-000000000e01",
    slug: "open-day-2026",
    title: "NMTC Open Day",
    description:
      "Visit the college, meet faculty, and learn about our nursing and midwifery programmes.",
    starts_at: futureDate(3),
    ends_at: null,
    location: "NMTC Main Campus, Nandom",
    cover_image_url: "/images/campus-hero.jpg",
    registration_url: null,
    is_past: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000e02",
    slug: "graduation-2025",
    title: "Graduation Ceremony 2025",
    description: "Celebrating our graduating class of nurses and midwives.",
    starts_at: pastDate(6),
    ends_at: null,
    location: "NMTC Auditorium",
    cover_image_url: "/images/graduation.jpg",
    registration_url: null,
    is_past: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function previewUpcomingEvents(limit = 3): CollegeEvent[] {
  return PREVIEW_EVENTS.filter((e) => !e.is_past)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    .slice(0, limit);
}

export function previewEventBySlug(slug: string): CollegeEvent | null {
  return PREVIEW_EVENTS.find((e) => e.slug === slug) ?? null;
}

export const PREVIEW_RESOURCES: Resource[] = [
  {
    id: "00000000-0000-4000-8000-000000000f01",
    title: "Student Handbook",
    category: "Handbook",
    file_url: "documents/student-handbook.pdf",
    description: "Guidelines for students on conduct, assessment, and college services.",
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000f02",
    title: "Academic Calendar 2025/26",
    category: "Academic Calendar",
    file_url: "documents/academic-calendar.pdf",
    description: "Key dates for the academic year.",
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function previewPublishedResources(): Resource[] {
  return PREVIEW_RESOURCES.filter((r) => r.is_published).sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

export const PREVIEW_ORG_UNITS: OrgUnit[] = [
  {
    id: "00000000-0000-4000-8000-000000001001",
    name: "Academic Affairs",
    head_name: "Academic Officer",
    parent_id: null,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000001002",
    name: "Nursing Department",
    head_name: "Head of Nursing",
    parent_id: "00000000-0000-4000-8000-000000001001",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
