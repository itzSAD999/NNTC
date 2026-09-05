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
    title: "News & announcements",
    description:
      "Write articles that appear on the public News page and homepage announcements.",
    howItWorks:
      "Create an article, add a title and body, then tick Published when it should go live. Pinned articles stay at the top of the list. Drafts are saved but hidden from visitors until you publish.",
    publicPath: "/news",
  },
  programs: {
    title: "Programmes",
    description:
      "Manage nursing and midwifery programme details shown on the public Programmes pages.",
    howItWorks:
      "Each programme gets its own public page with entry requirements, curriculum, and career information. Link it to a department, set display order, and tick Published when ready. Unpublished programmes stay out of the public catalogue.",
    publicPath: "/programs",
  },
  departments: {
    title: "Departments",
    description:
      "Academic departments used when assigning programmes and staff profiles.",
    howItWorks:
      "Add a department name — the page link is created automatically. Programmes and faculty profiles pick from this list. Departments do not have their own public page; they group content on other pages.",
  },
  admissions: {
    title: "Admissions",
    description:
      "Edit everything on the public Admissions page — steps, fees, documents, and FAQs.",
    howItWorks:
      "Changes save to the live Admissions page when you click Save. Use steps to walk applicants through the process, list required documents, and add FAQs. The application form link sends students to the external application system if you provide a URL.",
    publicPath: "/admissions",
  },
  fees: {
    title: "Fees & financial aid",
    description:
      "Fee tables, payment methods, scholarships, and aid policies on the Financial Aid page.",
    howItWorks:
      "Build the fee table row by row (programme, year, amount). Add payment methods and scholarship entries visitors can read on the public site. Document request fees are set separately under Settings.",
    publicPath: "/financial-aid",
  },
  staff: {
    title: "Faculty & staff profiles",
    description:
      "Public profiles for lecturers and staff on the Faculty directory.",
    howItWorks:
      "Each person gets a profile page with photo, role, and biography. Assign a department, set display order, and publish when the profile should appear. Unpublished profiles are hidden from the directory.",
    publicPath: "/faculty",
  },
  "campus-life": {
    title: "Campus life",
    description:
      "Sections on the public Campus Life page — accommodation, dining, clubs, and more.",
    howItWorks:
      "Each section is a block of text (and optional image) on the Campus Life page. Display order controls which section appears first. New sections need a short internal section ID when first created — ask your site administrator if unsure.",
    publicPath: "/campus-life",
  },
  gallery: {
    title: "Photo gallery",
    description: "Albums and images on the public Gallery page.",
    howItWorks:
      "Create an album, upload images or add a video link, then save. Albums appear on the Gallery page in sort order. Visitors browse albums — each album groups related photos.",
    publicPath: "/gallery",
  },
  events: {
    title: "Events",
    description: "College events on the public Events page.",
    howItWorks:
      "Add title, dates, location, and description. Events appear on the public Events page automatically. Upcoming and past lists are sorted from the start and end dates — no manual publish step needed.",
    publicPath: "/events",
  },
  resources: {
    title: "Student resources",
    description:
      "Handbooks, timetables, forms, and calendars on the Resources page.",
    howItWorks:
      "Upload a document file, choose a category, and publish. Students download files from the public Resources page. Unpublished files stay internal until you tick Published.",
    publicPath: "/resources",
  },
  about: {
    title: "About the college",
    description:
      "History, vision, mission, principal's message, accreditations, and organisation chart.",
    howItWorks:
      "All content appears on the public About page. Update the principal's message and photo when leadership changes. Accreditations and organisation units can be reordered — lower numbers appear first.",
    publicPath: "/about",
  },
  inbox: {
    title: "Contact inbox",
    description: "Messages sent through the public Contact form.",
    howItWorks:
      "When someone submits the contact form on the website, their message appears here. Open a message to read it and mark it as read. Reply by email outside this system using the sender's address.",
    publicPath: "/contact",
  },
  settings: {
    title: "College settings",
    description:
      "Branding, document request fees, and email templates for student notifications.",
    howItWorks:
      "College name and colours appear across the public site. Document fees control what students see on the request form. Email templates use placeholders like student name and reference number — do not remove the curly-bracket tags.",
  },
  users: {
    title: "Staff accounts",
    description: "Create logins and assign roles for dashboard access.",
    howItWorks:
      "Each staff member needs an email and role. Content Editors manage website pages; Academic, Accounts, and Principal roles handle document requests; Super Admin can do everything. Deactivated accounts cannot sign in.",
  },
  audit: {
    title: "Audit log",
    description: "Read-only history of document request actions.",
    howItWorks:
      "Every approve, reject, or status change on a document request is recorded here with who did it and when. Use filters to find a specific month or reference number. This log cannot be edited.",
  },
};

export const CMS_SCOPE_NOTE =
  "You manage the words, images, and documents visitors see on the public website. Page design, layout, and navigation are built into the site by the development team — staff do not need to change those.";

export const SORT_ORDER_HINT =
  "Controls position on the public page — lower numbers appear first (e.g. 1 before 2).";

export const PUBLISH_HINT =
  "When ticked, this is visible on the public website. Leave unticked to keep a draft.";
