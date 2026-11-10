export type AcademicMilestone = {
  id: string;
  dateLabel: string;
  day: string;
  month: string;
  year: string;
  title: string;
  semester: "First Semester" | "Second Semester" | "Annual";
  category: "registration" | "ceremony" | "clinical" | "examination" | "recess";
  cohort: string;
  details: string;
};

export const ACADEMIC_CALENDAR_MILESTONES: AcademicMilestone[] = [
  {
    id: "milestone-1",
    dateLabel: "14 Oct 2025",
    day: "14",
    month: "OCT",
    year: "2025",
    title: "First Semester Academic Resumption & Registration",
    semester: "First Semester",
    category: "registration",
    cohort: "All Levels",
    details: "Online portal registration and fee clearance at the Bursary desk.",
  },
  {
    id: "milestone-2",
    dateLabel: "21–25 Oct 2025",
    day: "21",
    month: "OCT",
    year: "2025",
    title: "Freshers Orientation & Clinical Etiquette Week",
    semester: "First Semester",
    category: "registration",
    cohort: "Level 100 Freshers",
    details: "Campus tour, library induction, and introduction to hospital regulations.",
  },
  {
    id: "milestone-3",
    dateLabel: "15 Nov 2025",
    day: "15",
    month: "NOV",
    year: "2025",
    title: "18th Official Matriculation Ceremony",
    semester: "First Semester",
    category: "ceremony",
    cohort: "Freshers",
    details: "Formal matriculation and nursing pledge ceremony at the NMTC Great Hall.",
  },
  {
    id: "milestone-4",
    dateLabel: "05 Jan 2026",
    day: "05",
    month: "JAN",
    year: "2026",
    title: "Clinical Ward Rotations & Practical Practicum Begins",
    semester: "First Semester",
    category: "clinical",
    cohort: "Levels 200 & 300",
    details: "Hospital postings to St. Theresa's Hospital, Nandom and district clinics.",
  },
  {
    id: "milestone-5",
    dateLabel: "16–20 Feb 2026",
    day: "16",
    month: "FEB",
    year: "2026",
    title: "NMC Licensure Revision & Mock Simulation",
    semester: "First Semester",
    category: "examination",
    cohort: "Final Year (Level 300)",
    details: "Nursing and Midwifery Council (NMC) comprehensive practice examination.",
  },
  {
    id: "milestone-6",
    dateLabel: "23 Feb – 06 Mar 2026",
    day: "23",
    month: "FEB",
    year: "2026",
    title: "First Semester End-of-Semester Examinations",
    semester: "First Semester",
    category: "examination",
    cohort: "All Levels",
    details: "Theory papers and Objective Structured Clinical Examination (OSCE).",
  },
  {
    id: "milestone-7",
    dateLabel: "07 Apr 2026",
    day: "07",
    month: "APR",
    year: "2026",
    title: "Second Semester Resumption & Clinical Reporting",
    semester: "Second Semester",
    category: "registration",
    cohort: "All Levels",
    details: "Reporting to campus and resumption of classroom lectures.",
  },
  {
    id: "milestone-8",
    dateLabel: "27 Jun 2026",
    day: "27",
    month: "JUN",
    year: "2026",
    title: "14th Annual Congregation & Induction Ceremony",
    semester: "Annual",
    category: "ceremony",
    cohort: "Graduating Nurses & Midwives",
    details: "Award of diplomas, pin induction, and presentation of special prizes.",
  },
];

