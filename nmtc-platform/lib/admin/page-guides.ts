export type AdminSectionKey =
  | "news"
  | "programs"
  | "departments"
  | "admissions"
  | "fees"
  | "staff"
  | "campus-life"
  | "gallery"
  | "events"
  | "resources"
  | "about"
  | "inbox"
  | "settings"
  | "users"
  | "audit";

export type AdminSectionGuide = {
  title: string;
  description: string;
  howItWorks: string;
  publicPath?: string;
};

export const ADMIN_SECTION_GUIDES: Record<AdminSectionKey, AdminSectionGuide> = {
  news: {
    title: "News & Bulletins",
    description: "Publish articles and notices on the public News page and homepage.",
    howItWorks:
      "Tick 'Published' to make an article public immediately. Pinned articles stay at the top of the list. Unticked drafts stay hidden.",
    publicPath: "/news",
  },
  programs: {
    title: "Programmes & Curricula",
    description: "Manage nursing and midwifery programme details and entry requirements.",
    howItWorks:
      "Each programme features entry criteria, career pathways, and year-by-year module curriculum. Tick 'Published' when live.",
    publicPath: "/programs",
  },
  departments: {
    title: "Academic Departments",
    description: "Departments for grouping academic programmes and faculty profiles.",
    howItWorks:
      "Add department names; web URLs are generated automatically. Programmes and faculty profiles are linked to these departments.",
  },
  admissions: {
    title: "Admissions & Intake",
    description: "Manage admission steps, required documents, and prospective student FAQs.",
    howItWorks:
      "Update application requirements, admission guidelines, and FAQs. Changes reflect immediately on the public admissions page.",
    publicPath: "/admissions",
  },
  fees: {
    title: "Fees & Financial Aid",
    description: "Fee schedules, payment methods (MoMo / Bank), and scholarship details.",
    howItWorks:
      "Maintain fee schedules per programme and level. List accepted payment channels and available financial aid options.",
    publicPath: "/financial-aid",
  },
  staff: {
    title: "Faculty & Staff Directory",
    description: "Manage tutor, lecturer, and administrative staff profiles.",
    howItWorks:
      "Each profile includes photo, designation, department, and bio. Set display sort order and tick 'Published' to display.",
    publicPath: "/faculty",
  },
  "campus-life": {
    title: "Campus Life & Amenities",
    description: "Hostels, clinical skills lab, sports, and student life amenities.",
    howItWorks:
      "Manage photo and text blocks describing campus facilities. Sort order determines the layout position on the page.",
    publicPath: "/campus-life",
  },
  gallery: {
    title: "Media & Photo Gallery",
    description: "Photo albums and video features covering matriculation and ceremonies.",
    howItWorks:
      "Create albums and upload photos or embed video links. Published albums appear in sort order on the public gallery page.",
    publicPath: "/gallery",
  },
  events: {
    title: "Events & Calendar",
    description: "Academic calendar, clinical rotation dates, matriculation, and exams.",
    howItWorks:
      "Set event title, date range, venue, and description. Events automatically sort into upcoming and past sections.",
    publicPath: "/events",
  },
  resources: {
    title: "Student Resources",
    description: "Downloadable handbooks, clinical guides, timetables, and academic forms.",
    howItWorks:
      "Upload documents (PDFs) with categories (Handbook, Clinical, Timetable). Trainees can download them from the Resources portal.",
    publicPath: "/resources",
  },
  about: {
    title: "About Institution",
    description: "College history, vision, mission, core values, leadership, and governance.",
    howItWorks:
      "Update the principal's message, vision/mission, accreditation certificates, and the administrative organogram.",
    publicPath: "/about",
  },
  inbox: {
    title: "Inquiries & Inbox",
    description: "Inquiries submitted by prospective students and the general public.",
    howItWorks:
      "Messages sent via the Contact page appear here. Mark inquiries as read after responding by phone or email.",
    publicPath: "/contact",
  },
  settings: {
    title: "College Settings",
    description: "Institutional branding, document request fees, and notification templates.",
    howItWorks:
      "Set college name, logo/crest, colors, and official fees for document requests. Templates use variables like {{student_name}}.",
  },
  users: {
    title: "Staff Accounts & Roles",
    description: "Manage staff logins and role-based permissions (RBAC).",
    howItWorks:
      "Assign roles: Academic Office, Accounts/Bursary, Principal, Content Editor, or Super Admin. Deactivated accounts cannot sign in.",
  },
  audit: {
    title: "Security & Audit Trail",
    description: "Immutable activity log for document requests and verification events.",
    howItWorks:
      "Every approval, fee confirmation, rejection, and document generation is permanently timestamped with the actor's identity.",
  },
};

export const CMS_SCOPE_NOTE =
  "You manage words, images, and documents on the public portal.";

export const SORT_ORDER_HINT =
  "Lower numbers appear first on the page (e.g. 1 before 2).";

export const PUBLISH_HINT =
  "When ticked, this item is publicly visible. Untick to save as a draft.";
