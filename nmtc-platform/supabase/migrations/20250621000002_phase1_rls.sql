-- =============================================================================
-- NMTC Phase 1 — Row Level Security
-- =============================================================================

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_events ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- settings — public read; super_admin write
-- ---------------------------------------------------------------------------

CREATE POLICY "settings_public_read"
  ON public.settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "settings_super_admin_insert"
  ON public.settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "settings_super_admin_update"
  ON public.settings
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "settings_super_admin_delete"
  ON public.settings
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- about_content — public read; content staff write
-- ---------------------------------------------------------------------------

CREATE POLICY "about_content_public_read"
  ON public.about_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "about_content_content_staff_insert"
  ON public.about_content
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_content_staff());

CREATE POLICY "about_content_content_staff_update"
  ON public.about_content
  FOR UPDATE
  TO authenticated
  USING (public.is_content_staff())
  WITH CHECK (public.is_content_staff());

CREATE POLICY "about_content_super_admin_delete"
  ON public.about_content
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- staff_accounts — super_admin only
-- ---------------------------------------------------------------------------

CREATE POLICY "staff_accounts_super_admin_select"
  ON public.staff_accounts
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "staff_accounts_super_admin_insert"
  ON public.staff_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "staff_accounts_super_admin_update"
  ON public.staff_accounts
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "staff_accounts_super_admin_delete"
  ON public.staff_accounts
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- Staff can read their own row (needed for session/role checks in app)
CREATE POLICY "staff_accounts_self_read"
  ON public.staff_accounts
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- ---------------------------------------------------------------------------
-- document_types — public read active; super_admin write
-- ---------------------------------------------------------------------------

CREATE POLICY "document_types_public_read_active"
  ON public.document_types
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "document_types_super_admin_read_all"
  ON public.document_types
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "document_types_super_admin_insert"
  ON public.document_types
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin());

CREATE POLICY "document_types_super_admin_update"
  ON public.document_types
  FOR UPDATE
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "document_types_super_admin_delete"
  ON public.document_types
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- posts — public read published; content staff write
-- ---------------------------------------------------------------------------

CREATE POLICY "posts_public_read_published"
  ON public.posts
  FOR SELECT
  TO anon, authenticated
  USING (
    published_at IS NOT NULL
    AND published_at <= now()
  );

CREATE POLICY "posts_content_staff_read_all"
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (public.is_content_staff());

CREATE POLICY "posts_content_staff_insert"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_content_staff());

CREATE POLICY "posts_content_staff_update"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (public.is_content_staff())
  WITH CHECK (public.is_content_staff());

CREATE POLICY "posts_content_staff_delete"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (public.is_content_staff());

-- ---------------------------------------------------------------------------
-- contact_messages — public insert; inbox staff read/update
-- ---------------------------------------------------------------------------

CREATE POLICY "contact_messages_public_insert"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contact_messages_inbox_read"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (public.is_content_staff());

CREATE POLICY "contact_messages_inbox_update"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (public.is_content_staff())
  WITH CHECK (public.is_content_staff());

CREATE POLICY "contact_messages_super_admin_delete"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (public.is_super_admin());

-- ---------------------------------------------------------------------------
-- requests — no direct public access; workflow staff via server actions
-- Inserts/tracking use service role in server actions (bypasses RLS).
-- ---------------------------------------------------------------------------

CREATE POLICY "requests_super_admin_all"
  ON public.requests
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "requests_workflow_staff_select"
  ON public.requests
  FOR SELECT
  TO authenticated
  USING (public.is_request_staff());

CREATE POLICY "requests_academic_update"
  ON public.requests
  FOR UPDATE
  TO authenticated
  USING (
    public.is_staff_role(ARRAY['academic']::public.staff_role[])
    AND status IN ('submitted', 'returned')
  )
  WITH CHECK (
    public.is_staff_role(ARRAY['academic']::public.staff_role[])
  );

CREATE POLICY "requests_accounts_update"
  ON public.requests
  FOR UPDATE
  TO authenticated
  USING (
    public.is_staff_role(ARRAY['accounts']::public.staff_role[])
    AND status = 'academic_approved'
  )
  WITH CHECK (
    public.is_staff_role(ARRAY['accounts']::public.staff_role[])
  );

CREATE POLICY "requests_principal_update"
  ON public.requests
  FOR UPDATE
  TO authenticated
  USING (
    public.is_staff_role(ARRAY['principal']::public.staff_role[])
    AND status = 'payment_confirmed'
  )
  WITH CHECK (
    public.is_staff_role(ARRAY['principal']::public.staff_role[])
  );

-- ---------------------------------------------------------------------------
-- request_events — append-only; workflow staff read/insert
-- No UPDATE or DELETE policies (trigger also blocks mutations).
-- ---------------------------------------------------------------------------

CREATE POLICY "request_events_super_admin_select"
  ON public.request_events
  FOR SELECT
  TO authenticated
  USING (public.is_super_admin());

CREATE POLICY "request_events_workflow_staff_select"
  ON public.request_events
  FOR SELECT
  TO authenticated
  USING (
    public.is_request_staff()
    AND EXISTS (
      SELECT 1
      FROM public.requests r
      WHERE r.id = request_events.request_id
    )
  );

CREATE POLICY "request_events_workflow_staff_insert"
  ON public.request_events
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_request_staff());

-- Explicit deny update/delete: no policies granted (RLS default deny)
