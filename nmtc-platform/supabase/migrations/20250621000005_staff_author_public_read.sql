-- =============================================================================
-- NMTC — Post author byline (safe public exposure)
-- Replaces the idea of a public read policy on staff_accounts. Instead, snapshot
-- the author's name onto posts (like request_events.actor_label), so the public
-- reads the byline from posts — which they can already see — and staff_accounts
-- stays fully locked down. Idempotent. Run after the schema migration.
-- =============================================================================

-- Make sure the leaky policy is gone if it was ever applied.
DROP POLICY IF EXISTS "staff_accounts_public_author_read" ON public.staff_accounts;

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS author_name text;

-- Keep the byline in sync at write time. SECURITY DEFINER so it can read
-- staff_accounts regardless of the writer's RLS.
CREATE OR REPLACE FUNCTION public.set_post_author_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.author_id IS NOT NULL THEN
    SELECT full_name INTO NEW.author_name
    FROM public.staff_accounts
    WHERE id = NEW.author_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_set_author_name ON public.posts;
CREATE TRIGGER posts_set_author_name
  BEFORE INSERT OR UPDATE OF author_id ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_post_author_name();

-- Backfill existing rows once.
UPDATE public.posts p
SET author_name = sa.full_name
FROM public.staff_accounts sa
WHERE p.author_id = sa.id
  AND (p.author_name IS NULL OR p.author_name IS DISTINCT FROM sa.full_name);