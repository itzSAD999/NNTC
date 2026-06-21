-- Allow public read of past events for the archive page

DROP POLICY IF EXISTS "events_public_read" ON public.events;
CREATE POLICY "events_public_read"
  ON public.events FOR SELECT TO anon, authenticated
  USING (true);
