-- =============================================================================
-- Financial aid singleton (SLTF, hardship policy, payment schedule)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.financial_aid_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  payment_schedule text NOT NULL DEFAULT '',
  sltf_info text NOT NULL DEFAULT '',
  hardship_policy text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS financial_aid_content_set_updated_at ON public.financial_aid_content;
CREATE TRIGGER financial_aid_content_set_updated_at
  BEFORE UPDATE ON public.financial_aid_content
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.financial_aid_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "financial_aid_content_public_read" ON public.financial_aid_content;
CREATE POLICY "financial_aid_content_public_read"
  ON public.financial_aid_content FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "financial_aid_content_content_staff_insert" ON public.financial_aid_content;
CREATE POLICY "financial_aid_content_content_staff_insert"
  ON public.financial_aid_content FOR INSERT TO authenticated
  WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "financial_aid_content_content_staff_update" ON public.financial_aid_content;
CREATE POLICY "financial_aid_content_content_staff_update"
  ON public.financial_aid_content FOR UPDATE TO authenticated
  USING (public.is_content_staff()) WITH CHECK (public.is_content_staff());

DROP POLICY IF EXISTS "financial_aid_content_content_staff_delete" ON public.financial_aid_content;
CREATE POLICY "financial_aid_content_content_staff_delete"
  ON public.financial_aid_content FOR DELETE TO authenticated
  USING (public.is_content_staff());

INSERT INTO public.financial_aid_content (id, payment_schedule, sltf_info, hardship_policy)
VALUES (
  1,
  'Fees are typically due at registration at the start of each academic year. Installment arrangements may be discussed with the Finance Office before the deadline.',
  'Eligible students may apply for the Student Loan Trust Fund (SLTF). Visit the SLTF website or the Finance Office for current application windows, required documents, and disbursement timelines.',
  'Students facing genuine financial hardship should contact the Student Welfare Office with supporting documentation. Cases are reviewed confidentially by college management.'
)
ON CONFLICT (id) DO NOTHING;
