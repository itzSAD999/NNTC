-- Allow workflow staff to mark approved requests as collected.

CREATE POLICY "requests_workflow_mark_collected"
  ON public.requests
  FOR UPDATE
  TO authenticated
  USING (
    public.is_request_staff()
    AND status = 'approved'
  )
  WITH CHECK (public.is_request_staff());
