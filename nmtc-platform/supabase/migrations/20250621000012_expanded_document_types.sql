-- =============================================================================
-- Migration: 20250621000012_expanded_document_types.sql
-- Nandom Nursing and Midwifery Training College (Nandom NMTC)
-- Expanded Official Document Types:
--   - Official Transcript (TR)
--   - Attestation Letter (AT)
--   - English Proficiency Letter (EP)
--   - Recommendation / Introduction Letter (RL)
--   - Statement of Results (SR)
--   - Certified True Copy / Verification (CT)
-- =============================================================================

INSERT INTO public.document_types (name, code, fee_amount, is_active)
VALUES
  ('Official Transcript', 'TR', 50.00, true),
  ('Attestation Letter', 'AT', 30.00, true),
  ('English Proficiency Letter', 'EP', 40.00, true),
  ('Recommendation / Introduction Letter', 'RL', 35.00, true),
  ('Statement of Results', 'SR', 25.00, true),
  ('Certified True Copy / Verification', 'CT', 30.00, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  fee_amount = EXCLUDED.fee_amount,
  is_active = EXCLUDED.is_active,
  updated_at = now();
