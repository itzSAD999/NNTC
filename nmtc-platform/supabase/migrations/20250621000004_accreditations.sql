-- =============================================================================
-- NMTC — Accreditations (About page). Expansion migration, no Phase 1 conflict.
-- Idempotent. Run AFTER the schema migration (needs set_updated_at + is_content_staff).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.accreditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body_name text NOT NULL,
  accreditation_no text,
  logo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.accreditations
  ADD COLUMN IF NOT EXISTS body_name text NOT NULL,
  ADD COLUMN IF NOT EXISTS accreditation_no text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- light data-quality bounds (staff-entered, so this is for sanity not abuse defense)
DO $$ BEGIN
  ALTER TABLE public.accreditations
    ADD CONSTRAINT accreditations_lengths
    CHECK (
      char_length(body_name) BETWEEN 1 AND 200 AND
      (accreditation_no IS NULL OR char_length(accreditation_no) <= 120)
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS accreditations_sort_order_idx
  ON public.accreditations (sort_order);

DROP TRIGGER IF EXISTS accreditations_set_updated_at ON public.accreditations;
CREATE TRIGGER accreditations_set_updated_at
  BEFORE UPDATE ON public.accreditations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.accreditations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accreditations_public_read" ON public.accreditations;
CREATE POLICY "accreditations_public_read"
  ON public.accreditations
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "accreditations_content_staff_insert" ON public.accreditations;
CREATE POLICY "accreditations_content_staff_insert"
  ON public.accreditations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "accreditations_content_staff_update" ON public.accreditations;
CREATE POLICY "accreditations_content_staff_update"
  ON public.accreditations
  FOR UPDATE
  TO authenticated
  USING (public.is_content_staff())
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "accreditations_content_staff_delete" ON public.accreditations;
CREATE POLICY "accreditations_content_staff_delete"
  ON public.accreditations
  FOR DELETE
  TO authenticated
  USING (public.is_content_staff());