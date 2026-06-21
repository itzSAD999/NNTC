-- Documents bucket for student resources (PDFs, forms)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 'documents', true, 20971520,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "documents_read" ON storage.objects;
CREATE POLICY "documents_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "documents_content_staff_insert" ON storage.objects;
CREATE POLICY "documents_content_staff_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND public.is_content_staff());

DROP POLICY IF EXISTS "documents_content_staff_update" ON storage.objects;
CREATE POLICY "documents_content_staff_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documents' AND public.is_content_staff())
  WITH CHECK (bucket_id = 'documents' AND public.is_content_staff());

DROP POLICY IF EXISTS "documents_content_staff_delete" ON storage.objects;
CREATE POLICY "documents_content_staff_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND public.is_content_staff());
