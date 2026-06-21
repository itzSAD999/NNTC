-- =============================================================================
-- NMTC Phase 1 — Core schema + RLS (Supabase)
-- Idempotent: safe to run repeatedly. Existing objects are patched, not dropped.
-- Order: extensions -> enums -> generic functions -> tables (FK order, each with
--        guards/indexes/triggers) -> role helpers -> RLS & policies -> RPCs.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums  (CREATE TYPE has no IF NOT EXISTS, so guard each one)
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.staff_role AS ENUM (
    'super_admin',
    'content_editor',
    'academic',
    'accounts',
    'principal'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.request_status AS ENUM (
    'submitted',
    'returned',
    'academic_approved',
    'payment_confirmed',
    'approved',
    'collected'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ---------------------------------------------------------------------------
-- Generic functions  (CREATE OR REPLACE is already idempotent)
-- search_path is pinned to satisfy the Supabase linter (function_search_path_mutable)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_request_events_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION 'request_events is append-only; updates and deletes are not permitted';
END;
$$;

-- ---------------------------------------------------------------------------
-- settings (singleton, id = 1)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  college_name text NOT NULL DEFAULT 'Nandom Nursing and Midwifery Training College',
  motto text NOT NULL DEFAULT '',
  logo_url text,
  primary_color text DEFAULT '#1A5E3A',
  accent_color text DEFAULT '#9A1B2F',
  phone_main text,
  phone_admissions text,
  phone_finance text,
  email_main text,
  email_admissions text,
  email_finance text,
  address text,
  google_maps_url text,
  office_hours text,
  facebook_url text,
  instagram_url text,
  x_url text,
  whatsapp text,
  domain text,
  default_language text NOT NULL DEFAULT 'en',
  notification_email_template text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Patch missing columns if the table already existed in an older shape
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS college_name text NOT NULL DEFAULT 'Nandom Nursing and Midwifery Training College',
  ADD COLUMN IF NOT EXISTS motto text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#1A5E3A',
  ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#9A1B2F',
  ADD COLUMN IF NOT EXISTS phone_main text,
  ADD COLUMN IF NOT EXISTS phone_admissions text,
  ADD COLUMN IF NOT EXISTS phone_finance text,
  ADD COLUMN IF NOT EXISTS email_main text,
  ADD COLUMN IF NOT EXISTS email_admissions text,
  ADD COLUMN IF NOT EXISTS email_finance text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS google_maps_url text,
  ADD COLUMN IF NOT EXISTS office_hours text,
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS x_url text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS domain text,
  ADD COLUMN IF NOT EXISTS default_language text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS notification_email_template text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS settings_set_updated_at ON public.settings;
CREATE TRIGGER settings_set_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- about_content (singleton, id = 1)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.about_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  history text NOT NULL DEFAULT '',
  vision text NOT NULL DEFAULT '',
  mission text NOT NULL DEFAULT '',
  core_values text[] NOT NULL DEFAULT '{}',
  principal_name text,
  principal_title text,
  principal_message text NOT NULL DEFAULT '',
  principal_photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.about_content
  ADD COLUMN IF NOT EXISTS history text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS vision text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS mission text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS core_values text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS principal_name text,
  ADD COLUMN IF NOT EXISTS principal_title text,
  ADD COLUMN IF NOT EXISTS principal_message text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS principal_photo_url text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS about_content_set_updated_at ON public.about_content;
CREATE TRIGGER about_content_set_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- staff_accounts (login accounts — id matches auth.users)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.staff_accounts (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role public.staff_role NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_accounts
  ADD COLUMN IF NOT EXISTS full_name text NOT NULL,
  ADD COLUMN IF NOT EXISTS email text NOT NULL,
  ADD COLUMN IF NOT EXISTS role public.staff_role NOT NULL,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS staff_accounts_role_idx ON public.staff_accounts (role);
CREATE INDEX IF NOT EXISTS staff_accounts_email_idx ON public.staff_accounts (email);

DROP TRIGGER IF EXISTS staff_accounts_set_updated_at ON public.staff_accounts;
CREATE TRIGGER staff_accounts_set_updated_at
  BEFORE UPDATE ON public.staff_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Staff role helpers (must exist after staff_accounts; used by the RLS policies below).
-- SECURITY DEFINER so they bypass RLS on staff_accounts -> no recursive policy evaluation.
CREATE OR REPLACE FUNCTION public.is_staff_role(allowed_roles public.staff_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.staff_accounts sa
    WHERE sa.id = auth.uid()
      AND sa.is_active = true
      AND sa.role = ANY (allowed_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_staff_role(ARRAY['super_admin']::public.staff_role[]);
$$;

CREATE OR REPLACE FUNCTION public.is_content_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_staff_role(
    ARRAY['super_admin', 'content_editor']::public.staff_role[]
  );
$$;

CREATE OR REPLACE FUNCTION public.is_request_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_staff_role(
    ARRAY['super_admin', 'academic', 'accounts', 'principal']::public.staff_role[]
  );
$$;

-- ---------------------------------------------------------------------------
-- document_types
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.document_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  fee_amount numeric(10, 2) NOT NULL CHECK (fee_amount >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.document_types
  ADD COLUMN IF NOT EXISTS name text NOT NULL,
  ADD COLUMN IF NOT EXISTS code text NOT NULL,
  ADD COLUMN IF NOT EXISTS fee_amount numeric(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS document_types_set_updated_at ON public.document_types;
CREATE TRIGGER document_types_set_updated_at
  BEFORE UPDATE ON public.document_types
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'News',
  cover_image_url text,
  is_pinned boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  author_id uuid REFERENCES public.staff_accounts (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS slug text NOT NULL,
  ADD COLUMN IF NOT EXISTS title text NOT NULL,
  ADD COLUMN IF NOT EXISTS body text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS excerpt text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'News',
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS author_id uuid,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts (published_at DESC);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts (slug);
CREATE INDEX IF NOT EXISTS posts_is_pinned_idx ON public.posts (is_pinned);

DROP TRIGGER IF EXISTS posts_set_updated_at ON public.posts;
CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS name text NOT NULL,
  ADD COLUMN IF NOT EXISTS email text NOT NULL,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS subject text NOT NULL,
  ADD COLUMN IF NOT EXISTS message text NOT NULL,
  ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS contact_messages_is_read_idx ON public.contact_messages (is_read);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages (created_at DESC);

-- ---------------------------------------------------------------------------
-- requests
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no text NOT NULL UNIQUE,
  student_name text NOT NULL,
  student_id text NOT NULL,
  student_email text NOT NULL,
  student_phone text,
  program text NOT NULL,
  year_completed text NOT NULL,
  document_type_id uuid NOT NULL REFERENCES public.document_types (id),
  purpose text NOT NULL,
  delivery_method text NOT NULL CHECK (delivery_method IN ('collection', 'email')),
  status public.request_status NOT NULL DEFAULT 'submitted',
  receipt_url text,
  amount_expected numeric(10, 2) NOT NULL CHECK (amount_expected >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS reference_no text NOT NULL,
  ADD COLUMN IF NOT EXISTS student_name text NOT NULL,
  ADD COLUMN IF NOT EXISTS student_id text NOT NULL,
  ADD COLUMN IF NOT EXISTS student_email text NOT NULL,
  ADD COLUMN IF NOT EXISTS student_phone text,
  ADD COLUMN IF NOT EXISTS program text NOT NULL,
  ADD COLUMN IF NOT EXISTS year_completed text NOT NULL,
  ADD COLUMN IF NOT EXISTS document_type_id uuid NOT NULL,
  ADD COLUMN IF NOT EXISTS purpose text NOT NULL,
  ADD COLUMN IF NOT EXISTS delivery_method text NOT NULL DEFAULT 'collection',
  ADD COLUMN IF NOT EXISTS status public.request_status NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS receipt_url text,
  ADD COLUMN IF NOT EXISTS amount_expected numeric(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS requests_reference_no_idx ON public.requests (reference_no);
CREATE INDEX IF NOT EXISTS requests_status_idx ON public.requests (status);
CREATE INDEX IF NOT EXISTS requests_created_at_idx ON public.requests (created_at DESC);

DROP TRIGGER IF EXISTS requests_set_updated_at ON public.requests;
CREATE TRIGGER requests_set_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- request_events (append-only audit log)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.request_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.requests (id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.staff_accounts (id) ON DELETE SET NULL,
  actor_label text NOT NULL,
  action text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.request_events
  ADD COLUMN IF NOT EXISTS request_id uuid NOT NULL,
  ADD COLUMN IF NOT EXISTS actor_id uuid,
  ADD COLUMN IF NOT EXISTS actor_label text NOT NULL,
  ADD COLUMN IF NOT EXISTS action text NOT NULL,
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS request_events_request_id_idx ON public.request_events (request_id);
CREATE INDEX IF NOT EXISTS request_events_created_at_idx ON public.request_events (created_at);

DROP TRIGGER IF EXISTS request_events_no_update ON public.request_events;
CREATE TRIGGER request_events_no_update
  BEFORE UPDATE OR DELETE ON public.request_events
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_request_events_mutation();