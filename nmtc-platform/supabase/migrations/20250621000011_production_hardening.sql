-- Production hardening (moved from HARDENING.sqL — apply via supabase db push)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.gen_reference_no()
RETURNS text
LANGUAGE sql
VOLATILE
SET search_path = public, extensions
AS $$
  SELECT 'NMTC-' || upper(encode(gen_random_bytes(6), 'hex'));
$$;

ALTER TABLE public.requests
  ALTER COLUMN reference_no SET DEFAULT public.gen_reference_no();

CREATE OR REPLACE FUNCTION public.set_request_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dt_fee    numeric(10, 2);
  dt_active boolean;
BEGIN
  SELECT fee_amount, is_active
    INTO dt_fee, dt_active
    FROM public.document_types
    WHERE id = NEW.document_type_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unknown document_type_id %', NEW.document_type_id;
  END IF;

  IF dt_active IS NOT TRUE THEN
    RAISE EXCEPTION 'Document type % is not active and cannot be requested', NEW.document_type_id;
  END IF;

  NEW.amount_expected := dt_fee;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS requests_set_amount ON public.requests;
CREATE TRIGGER requests_set_amount
  BEFORE INSERT ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_request_amount();

CREATE OR REPLACE FUNCTION public.enforce_request_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  ok boolean;
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  IF public.is_super_admin() THEN
    RETURN NEW;
  END IF;

  ok := CASE OLD.status
    WHEN 'submitted'         THEN NEW.status IN ('academic_approved', 'returned')
    WHEN 'returned'          THEN NEW.status IN ('submitted')
    WHEN 'academic_approved' THEN NEW.status IN ('payment_confirmed', 'returned')
    WHEN 'payment_confirmed' THEN NEW.status IN ('approved', 'returned')
    WHEN 'approved'          THEN NEW.status IN ('collected')
    WHEN 'collected'         THEN false
    ELSE false
  END;

  IF NOT ok THEN
    RAISE EXCEPTION 'Illegal status transition: % -> %', OLD.status, NEW.status
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS requests_enforce_transition ON public.requests;
CREATE TRIGGER requests_enforce_transition
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_request_transition();

DO $$ BEGIN
  ALTER TABLE public.contact_messages
    ADD CONSTRAINT contact_messages_email_format
    CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND char_length(email) <= 200);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.contact_messages
    ADD CONSTRAINT contact_messages_lengths
    CHECK (
      char_length(name)    BETWEEN 1 AND 120 AND
      char_length(subject) BETWEEN 1 AND 200 AND
      char_length(message) BETWEEN 1 AND 5000
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.requests
    ADD CONSTRAINT requests_email_format
    CHECK (student_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND char_length(student_email) <= 200);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.requests
    ADD CONSTRAINT requests_lengths
    CHECK (
      char_length(student_name) BETWEEN 1 AND 150 AND
      char_length(student_id)   BETWEEN 1 AND 60  AND
      char_length(program)      BETWEEN 1 AND 120 AND
      char_length(purpose)      BETWEEN 1 AND 2000
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.staff_accounts
    ADD CONSTRAINT staff_accounts_email_format
    CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.posts
    ADD CONSTRAINT posts_slug_format
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) <= 200);
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS requests_document_type_id_idx
  ON public.requests (document_type_id);

DROP INDEX IF EXISTS public.requests_reference_no_idx;
DROP INDEX IF EXISTS public.posts_slug_idx;
DROP INDEX IF EXISTS public.staff_accounts_email_idx;
