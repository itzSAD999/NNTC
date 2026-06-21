-- =============================================================================
-- NMTC Expansion — schema + RLS (Prompt E.1)
-- Idempotent. Run after Phase 1 migrations (needs set_updated_at, is_content_staff).
-- Public: published rows only where is_published exists; otherwise all rows.
-- Writes: super_admin + content_editor via is_content_staff().
-- accreditations already created in 20250621000004 — not duplicated here.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- departments
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT departments_name_length CHECK (char_length(name) BETWEEN 1 AND 200),
  CONSTRAINT departments_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX IF NOT EXISTS departments_slug_idx ON public.departments (slug);

DROP TRIGGER IF EXISTS departments_set_updated_at ON public.departments;
CREATE TRIGGER departments_set_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- programs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  department_id uuid NOT NULL REFERENCES public.departments (id) ON DELETE RESTRICT,
  duration text NOT NULL DEFAULT '',
  qualification text NOT NULL DEFAULT '',
  entry_requirements text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  career_prospects text NOT NULL DEFAULT '',
  cutoff_points text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT programs_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX IF NOT EXISTS programs_department_id_idx ON public.programs (department_id);
CREATE INDEX IF NOT EXISTS programs_slug_idx ON public.programs (slug);
CREATE INDEX IF NOT EXISTS programs_published_sort_idx
  ON public.programs (is_published, sort_order);

DROP TRIGGER IF EXISTS programs_set_updated_at ON public.programs;
CREATE TRIGGER programs_set_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- program_modules
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.program_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.programs (id) ON DELETE CASCADE,
  year_label text NOT NULL,
  modules text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS program_modules_program_id_idx
  ON public.program_modules (program_id, sort_order);

DROP TRIGGER IF EXISTS program_modules_set_updated_at ON public.program_modules;
CREATE TRIGGER program_modules_set_updated_at
  BEFORE UPDATE ON public.program_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- admissions_content (singleton, id = 1)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admissions_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  process_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  application_form_url text,
  application_fee numeric(10, 2) CHECK (application_fee IS NULL OR application_fee >= 0),
  payment_instructions text NOT NULL DEFAULT '',
  academic_calendar text NOT NULL DEFAULT '',
  selection_criteria text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS admissions_content_set_updated_at ON public.admissions_content;
CREATE TRIGGER admissions_content_set_updated_at
  BEFORE UPDATE ON public.admissions_content
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- documents_required
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.documents_required (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT documents_required_label_length CHECK (char_length(label) BETWEEN 1 AND 300)
);

CREATE INDEX IF NOT EXISTS documents_required_sort_order_idx
  ON public.documents_required (sort_order);

DROP TRIGGER IF EXISTS documents_required_set_updated_at ON public.documents_required;
CREATE TRIGGER documents_required_set_updated_at
  BEFORE UPDATE ON public.documents_required
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- admissions_faqs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admissions_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admissions_faqs_sort_order_idx
  ON public.admissions_faqs (sort_order);

DROP TRIGGER IF EXISTS admissions_faqs_set_updated_at ON public.admissions_faqs;
CREATE TRIGGER admissions_faqs_set_updated_at
  BEFORE UPDATE ON public.admissions_faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- fees
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs (id) ON DELETE CASCADE,
  year_label text NOT NULL,
  fee_type text NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  due_note text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fees_program_id_idx ON public.fees (program_id, sort_order);

DROP TRIGGER IF EXISTS fees_set_updated_at ON public.fees;
CREATE TRIGGER fees_set_updated_at
  BEFORE UPDATE ON public.fees
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- payment_methods
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method text NOT NULL,
  details text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_methods_sort_order_idx
  ON public.payment_methods (sort_order);

DROP TRIGGER IF EXISTS payment_methods_set_updated_at ON public.payment_methods;
CREATE TRIGGER payment_methods_set_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- scholarships
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  eligibility text NOT NULL DEFAULT '',
  how_to_apply text NOT NULL DEFAULT '',
  external_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS scholarships_sort_order_idx
  ON public.scholarships (sort_order);

DROP TRIGGER IF EXISTS scholarships_set_updated_at ON public.scholarships;
CREATE TRIGGER scholarships_set_updated_at
  BEFORE UPDATE ON public.scholarships
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- staff_profiles (public directory — NOT staff_accounts)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  full_name text NOT NULL,
  job_title text NOT NULL DEFAULT '',
  department_id uuid REFERENCES public.departments (id) ON DELETE SET NULL,
  qualification text NOT NULL DEFAULT '',
  photo_url text,
  bio text,
  work_email text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT staff_profiles_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX IF NOT EXISTS staff_profiles_department_id_idx
  ON public.staff_profiles (department_id);
CREATE INDEX IF NOT EXISTS staff_profiles_slug_idx ON public.staff_profiles (slug);
CREATE INDEX IF NOT EXISTS staff_profiles_published_sort_idx
  ON public.staff_profiles (is_published, sort_order);

DROP TRIGGER IF EXISTS staff_profiles_set_updated_at ON public.staff_profiles;
CREATE TRIGGER staff_profiles_set_updated_at
  BEFORE UPDATE ON public.staff_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- campus_sections
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.campus_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS campus_sections_sort_order_idx
  ON public.campus_sections (sort_order);

DROP TRIGGER IF EXISTS campus_sections_set_updated_at ON public.campus_sections;
CREATE TRIGGER campus_sections_set_updated_at
  BEFORE UPDATE ON public.campus_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_albums
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gallery_albums_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX IF NOT EXISTS gallery_albums_slug_idx ON public.gallery_albums (slug);
CREATE INDEX IF NOT EXISTS gallery_albums_sort_order_idx
  ON public.gallery_albums (sort_order);

DROP TRIGGER IF EXISTS gallery_albums_set_updated_at ON public.gallery_albums;
CREATE TRIGGER gallery_albums_set_updated_at
  BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- gallery_media
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.gallery_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.gallery_albums (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gallery_media_album_id_idx
  ON public.gallery_media (album_id, sort_order);

DROP TRIGGER IF EXISTS gallery_media_set_updated_at ON public.gallery_media;
CREATE TRIGGER gallery_media_set_updated_at
  BEFORE UPDATE ON public.gallery_media
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text NOT NULL DEFAULT '',
  cover_image_url text,
  registration_url text,
  is_past boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX IF NOT EXISTS events_slug_idx ON public.events (slug);
CREATE INDEX IF NOT EXISTS events_starts_at_idx ON public.events (starts_at DESC);

DROP TRIGGER IF EXISTS events_set_updated_at ON public.events;
CREATE TRIGGER events_set_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- org_units (org chart, self-referencing)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.org_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  head_name text NOT NULL DEFAULT '',
  parent_id uuid REFERENCES public.org_units (id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS org_units_parent_id_idx ON public.org_units (parent_id);
CREATE INDEX IF NOT EXISTS org_units_sort_order_idx ON public.org_units (sort_order);

DROP TRIGGER IF EXISTS org_units_set_updated_at ON public.org_units;
CREATE TRIGGER org_units_set_updated_at
  BEFORE UPDATE ON public.org_units
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- resources (downloadable student materials)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Handbook',
  file_url text NOT NULL,
  description text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resources_published_sort_idx
  ON public.resources (is_published, sort_order);
CREATE INDEX IF NOT EXISTS resources_category_idx ON public.resources (category);

DROP TRIGGER IF EXISTS resources_set_updated_at ON public.resources;
CREATE TRIGGER resources_set_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_required ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Helper: reusable content-staff write policies pattern applied per table below.

-- departments (reference data — public read all)
DROP POLICY IF EXISTS "departments_public_read" ON public.departments;
CREATE POLICY "departments_public_read"
  ON public.departments FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "departments_content_staff_insert" ON public.departments;
CREATE POLICY "departments_content_staff_insert"
  ON public.departments FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "departments_content_staff_update" ON public.departments;
CREATE POLICY "departments_content_staff_update"
  ON public.departments FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "departments_content_staff_delete" ON public.departments;
CREATE POLICY "departments_content_staff_delete"
  ON public.departments FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- programs (public read published only)
DROP POLICY IF EXISTS "programs_public_read_published" ON public.programs;
CREATE POLICY "programs_public_read_published"
  ON public.programs FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "programs_content_staff_read_all" ON public.programs;
CREATE POLICY "programs_content_staff_read_all"
  ON public.programs FOR SELECT TO authenticated
  USING (public.is_content_staff());

DROP POLICY IF EXISTS "programs_content_staff_insert" ON public.programs;
CREATE POLICY "programs_content_staff_insert"
  ON public.programs FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "programs_content_staff_update" ON public.programs;
CREATE POLICY "programs_content_staff_update"
  ON public.programs FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "programs_content_staff_delete" ON public.programs;
CREATE POLICY "programs_content_staff_delete"
  ON public.programs FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- program_modules (public read when parent program is published)
DROP POLICY IF EXISTS "program_modules_public_read_published" ON public.program_modules;
CREATE POLICY "program_modules_public_read_published"
  ON public.program_modules FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.programs p
      WHERE p.id = program_modules.program_id AND p.is_published = true
    )
  );

DROP POLICY IF EXISTS "program_modules_content_staff_read_all" ON public.program_modules;
CREATE POLICY "program_modules_content_staff_read_all"
  ON public.program_modules FOR SELECT TO authenticated
  USING (public.is_content_staff());

DROP POLICY IF EXISTS "program_modules_content_staff_insert" ON public.program_modules;
CREATE POLICY "program_modules_content_staff_insert"
  ON public.program_modules FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "program_modules_content_staff_update" ON public.program_modules;
CREATE POLICY "program_modules_content_staff_update"
  ON public.program_modules FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "program_modules_content_staff_delete" ON public.program_modules;
CREATE POLICY "program_modules_content_staff_delete"
  ON public.program_modules FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- admissions_content (singleton — public read)
DROP POLICY IF EXISTS "admissions_content_public_read" ON public.admissions_content;
CREATE POLICY "admissions_content_public_read"
  ON public.admissions_content FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admissions_content_content_staff_insert" ON public.admissions_content;
CREATE POLICY "admissions_content_content_staff_insert"
  ON public.admissions_content FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "admissions_content_content_staff_update" ON public.admissions_content;
CREATE POLICY "admissions_content_content_staff_update"
  ON public.admissions_content FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "admissions_content_content_staff_delete" ON public.admissions_content;
CREATE POLICY "admissions_content_content_staff_delete"
  ON public.admissions_content FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- documents_required (public read all curated rows)
DROP POLICY IF EXISTS "documents_required_public_read" ON public.documents_required;
CREATE POLICY "documents_required_public_read"
  ON public.documents_required FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "documents_required_content_staff_insert" ON public.documents_required;
CREATE POLICY "documents_required_content_staff_insert"
  ON public.documents_required FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "documents_required_content_staff_update" ON public.documents_required;
CREATE POLICY "documents_required_content_staff_update"
  ON public.documents_required FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "documents_required_content_staff_delete" ON public.documents_required;
CREATE POLICY "documents_required_content_staff_delete"
  ON public.documents_required FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- admissions_faqs
DROP POLICY IF EXISTS "admissions_faqs_public_read" ON public.admissions_faqs;
CREATE POLICY "admissions_faqs_public_read"
  ON public.admissions_faqs FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admissions_faqs_content_staff_insert" ON public.admissions_faqs;
CREATE POLICY "admissions_faqs_content_staff_insert"
  ON public.admissions_faqs FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "admissions_faqs_content_staff_update" ON public.admissions_faqs;
CREATE POLICY "admissions_faqs_content_staff_update"
  ON public.admissions_faqs FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "admissions_faqs_content_staff_delete" ON public.admissions_faqs;
CREATE POLICY "admissions_faqs_content_staff_delete"
  ON public.admissions_faqs FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- fees (public read; hide fees for unpublished programmes)
DROP POLICY IF EXISTS "fees_public_read" ON public.fees;
CREATE POLICY "fees_public_read"
  ON public.fees FOR SELECT TO anon, authenticated
  USING (
    program_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.programs p
      WHERE p.id = fees.program_id AND p.is_published = true
    )
  );

DROP POLICY IF EXISTS "fees_content_staff_read_all" ON public.fees;
CREATE POLICY "fees_content_staff_read_all"
  ON public.fees FOR SELECT TO authenticated
  USING (public.is_content_staff());

DROP POLICY IF EXISTS "fees_content_staff_insert" ON public.fees;
CREATE POLICY "fees_content_staff_insert"
  ON public.fees FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "fees_content_staff_update" ON public.fees;
CREATE POLICY "fees_content_staff_update"
  ON public.fees FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "fees_content_staff_delete" ON public.fees;
CREATE POLICY "fees_content_staff_delete"
  ON public.fees FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- payment_methods
DROP POLICY IF EXISTS "payment_methods_public_read" ON public.payment_methods;
CREATE POLICY "payment_methods_public_read"
  ON public.payment_methods FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "payment_methods_content_staff_insert" ON public.payment_methods;
CREATE POLICY "payment_methods_content_staff_insert"
  ON public.payment_methods FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "payment_methods_content_staff_update" ON public.payment_methods;
CREATE POLICY "payment_methods_content_staff_update"
  ON public.payment_methods FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "payment_methods_content_staff_delete" ON public.payment_methods;
CREATE POLICY "payment_methods_content_staff_delete"
  ON public.payment_methods FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- scholarships
DROP POLICY IF EXISTS "scholarships_public_read" ON public.scholarships;
CREATE POLICY "scholarships_public_read"
  ON public.scholarships FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "scholarships_content_staff_insert" ON public.scholarships;
CREATE POLICY "scholarships_content_staff_insert"
  ON public.scholarships FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "scholarships_content_staff_update" ON public.scholarships;
CREATE POLICY "scholarships_content_staff_update"
  ON public.scholarships FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "scholarships_content_staff_delete" ON public.scholarships;
CREATE POLICY "scholarships_content_staff_delete"
  ON public.scholarships FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- staff_profiles (public read published only)
DROP POLICY IF EXISTS "staff_profiles_public_read_published" ON public.staff_profiles;
CREATE POLICY "staff_profiles_public_read_published"
  ON public.staff_profiles FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "staff_profiles_content_staff_read_all" ON public.staff_profiles;
CREATE POLICY "staff_profiles_content_staff_read_all"
  ON public.staff_profiles FOR SELECT TO authenticated
  USING (public.is_content_staff());

DROP POLICY IF EXISTS "staff_profiles_content_staff_insert" ON public.staff_profiles;
CREATE POLICY "staff_profiles_content_staff_insert"
  ON public.staff_profiles FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "staff_profiles_content_staff_update" ON public.staff_profiles;
CREATE POLICY "staff_profiles_content_staff_update"
  ON public.staff_profiles FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "staff_profiles_content_staff_delete" ON public.staff_profiles;
CREATE POLICY "staff_profiles_content_staff_delete"
  ON public.staff_profiles FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- campus_sections
DROP POLICY IF EXISTS "campus_sections_public_read" ON public.campus_sections;
CREATE POLICY "campus_sections_public_read"
  ON public.campus_sections FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "campus_sections_content_staff_insert" ON public.campus_sections;
CREATE POLICY "campus_sections_content_staff_insert"
  ON public.campus_sections FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "campus_sections_content_staff_update" ON public.campus_sections;
CREATE POLICY "campus_sections_content_staff_update"
  ON public.campus_sections FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "campus_sections_content_staff_delete" ON public.campus_sections;
CREATE POLICY "campus_sections_content_staff_delete"
  ON public.campus_sections FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- gallery_albums
DROP POLICY IF EXISTS "gallery_albums_public_read" ON public.gallery_albums;
CREATE POLICY "gallery_albums_public_read"
  ON public.gallery_albums FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "gallery_albums_content_staff_insert" ON public.gallery_albums;
CREATE POLICY "gallery_albums_content_staff_insert"
  ON public.gallery_albums FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "gallery_albums_content_staff_update" ON public.gallery_albums;
CREATE POLICY "gallery_albums_content_staff_update"
  ON public.gallery_albums FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "gallery_albums_content_staff_delete" ON public.gallery_albums;
CREATE POLICY "gallery_albums_content_staff_delete"
  ON public.gallery_albums FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- gallery_media
DROP POLICY IF EXISTS "gallery_media_public_read" ON public.gallery_media;
CREATE POLICY "gallery_media_public_read"
  ON public.gallery_media FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "gallery_media_content_staff_insert" ON public.gallery_media;
CREATE POLICY "gallery_media_content_staff_insert"
  ON public.gallery_media FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "gallery_media_content_staff_update" ON public.gallery_media;
CREATE POLICY "gallery_media_content_staff_update"
  ON public.gallery_media FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "gallery_media_content_staff_delete" ON public.gallery_media;
CREATE POLICY "gallery_media_content_staff_delete"
  ON public.gallery_media FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- events (public read upcoming/non-past; staff see all)
DROP POLICY IF EXISTS "events_public_read" ON public.events;
CREATE POLICY "events_public_read"
  ON public.events FOR SELECT TO anon, authenticated
  USING (is_past = false);

DROP POLICY IF EXISTS "events_content_staff_read_all" ON public.events;
CREATE POLICY "events_content_staff_read_all"
  ON public.events FOR SELECT TO authenticated
  USING (public.is_content_staff());

DROP POLICY IF EXISTS "events_content_staff_insert" ON public.events;
CREATE POLICY "events_content_staff_insert"
  ON public.events FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "events_content_staff_update" ON public.events;
CREATE POLICY "events_content_staff_update"
  ON public.events FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "events_content_staff_delete" ON public.events;
CREATE POLICY "events_content_staff_delete"
  ON public.events FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- org_units
DROP POLICY IF EXISTS "org_units_public_read" ON public.org_units;
CREATE POLICY "org_units_public_read"
  ON public.org_units FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "org_units_content_staff_insert" ON public.org_units;
CREATE POLICY "org_units_content_staff_insert"
  ON public.org_units FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "org_units_content_staff_update" ON public.org_units;
CREATE POLICY "org_units_content_staff_update"
  ON public.org_units FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "org_units_content_staff_delete" ON public.org_units;
CREATE POLICY "org_units_content_staff_delete"
  ON public.org_units FOR DELETE TO authenticated
  USING (public.is_content_staff());

-- resources (public read published only)
DROP POLICY IF EXISTS "resources_public_read_published" ON public.resources;
CREATE POLICY "resources_public_read_published"
  ON public.resources FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "resources_content_staff_read_all" ON public.resources;
CREATE POLICY "resources_content_staff_read_all"
  ON public.resources FOR SELECT TO authenticated
  USING (public.is_content_staff());

DROP POLICY IF EXISTS "resources_content_staff_insert" ON public.resources;
CREATE POLICY "resources_content_staff_insert"
  ON public.resources FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "resources_content_staff_update" ON public.resources;
CREATE POLICY "resources_content_staff_update"
  ON public.resources FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "resources_content_staff_delete" ON public.resources;
CREATE POLICY "resources_content_staff_delete"
  ON public.resources FOR DELETE TO authenticated
  USING (public.is_content_staff());
