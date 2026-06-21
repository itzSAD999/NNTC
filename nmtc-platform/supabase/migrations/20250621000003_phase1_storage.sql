-- =============================================================================
-- NMTC Phase 1 — Storage (buckets + object RLS)
-- Idempotent. Run in Supabase (the `storage` schema is provided by Supabase).
-- RLS on storage.objects is already enabled by Supabase; we only add policies.
--
-- Two buckets:
--   receipts       PRIVATE  — payment evidence (PII). Staff-only, served via
--                             short-lived signed URLs from the app. Never public.
--   public-assets  PUBLIC   — logos, principal photo, post cover images.
-- Both enforce size + mime limits at the storage layer.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Buckets
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts', 'receipts', false, 5242880,  -- 5 MB
  ARRAY['image/png', 'image/jpeg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets', 'public-assets', true, 5242880,  -- 5 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- receipts (private): request staff read/write; super_admin delete.
-- Public uploads happen server-side via the service role (which bypasses RLS),
-- consistent with how requests themselves are inserted.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "receipts_staff_read" ON storage.objects;
CREATE POLICY "receipts_staff_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'receipts' AND public.is_request_staff());

DROP POLICY IF EXISTS "receipts_staff_insert" ON storage.objects;
CREATE POLICY "receipts_staff_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND public.is_request_staff());

DROP POLICY IF EXISTS "receipts_super_admin_delete" ON storage.objects;
CREATE POLICY "receipts_super_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'receipts' AND public.is_super_admin());

-- ---------------------------------------------------------------------------
-- public-assets (public): world read; content staff write/update/delete.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "public_assets_read" ON storage.objects;
CREATE POLICY "public_assets_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'public-assets');

DROP POLICY IF EXISTS "public_assets_insert" ON storage.objects;
CREATE POLICY "public_assets_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'public-assets' AND public.is_content_staff());

DROP POLICY IF EXISTS "public_assets_update" ON storage.objects;
CREATE POLICY "public_assets_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'public-assets' AND public.is_content_staff())
  WITH CHECK (bucket_id = 'public-assets' AND public.is_content_staff());

DROP POLICY IF EXISTS "public_assets_delete" ON storage.objects;
CREATE POLICY "public_assets_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'public-assets' AND public.is_content_staff());