export type Department = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Program = {
  id: string;
  slug: string;
  name: string;
  department_id: string;
  duration: string;
  qualification: string;
  entry_requirements: string;
  description: string;
  career_prospects: string;
  cutoff_points: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProgramModule = {
  id: string;
  program_id: string;
  year_label: string;
  modules: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProgramWithDepartment = Program & {
  department: Pick<Department, "name" | "slug"> | null;
};

export type ProgramDetail = ProgramWithDepartment & {
  modules: ProgramModule[];
};

export type AdmissionsProcessStep = {
  title: string;
  body: string;
};

export type AdmissionsContent = {
  id: number;
  process_steps: AdmissionsProcessStep[];
  application_form_url: string | null;
  application_fee: number | null;
  payment_instructions: string;
  academic_calendar: string;
  selection_criteria: string;
  created_at: string;
  updated_at: string;
};

export type DocumentRequired = {
  id: string;
  label: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AdmissionsFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Fee = {
  id: string;
  program_id: string | null;
  year_label: string;
  fee_type: string;
  amount: number;
  due_note: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FeeWithProgram = Fee & {
  program: Pick<Program, "name" | "slug"> | null;
};

export type PaymentMethod = {
  id: string;
  method: string;
  details: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Scholarship = {
  id: string;
  name: string;
  eligibility: string;
  how_to_apply: string;
  external_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type FinancialAidContent = {
  id: number;
  payment_schedule: string;
  sltf_info: string;
  hardship_policy: string;
  created_at: string;
  updated_at: string;
};

export type StaffProfile = {
  id: string;
  slug: string;
  full_name: string;
  job_title: string;
  department_id: string | null;
  qualification: string;
  photo_url: string | null;
  bio: string | null;
  work_email: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type StaffProfileWithDepartment = StaffProfile & {
  department: Pick<Department, "name" | "slug"> | null;
};

export type CampusSection = {
  id: string;
  section_key: string;
  title: string;
  body: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryMedia = {
  id: string;
  album_id: string;
  type: "image" | "video";
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryAlbumWithMedia = GalleryAlbum & {
  media: GalleryMedia[];
};

export type CollegeEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  cover_image_url: string | null;
  registration_url: string | null;
  is_past: boolean;
  created_at: string;
  updated_at: string;
};

export type Resource = {
  id: string;
  title: string;
  category: string;
  file_url: string;
  description: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrgUnit = {
  id: string;
  name: string;
  head_name: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Accreditation = {
  id: string;
  body_name: string;
  accreditation_no: string | null;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
