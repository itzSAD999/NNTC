ALTER TABLE public.documents_required
  ADD COLUMN IF NOT EXISTS details text;

UPDATE public.documents_required
SET details = 'Complete the current intake form — either the college application or the Ministry of Health Health Training Institutions portal, as advertised for the year. Incomplete forms delay processing. Keep your voucher PIN and serial if you applied through the MoH portal.'
WHERE label = 'Completed application form' AND (details IS NULL OR details = '');

UPDATE public.documents_required
SET details = 'Submit a certified copy of your WASSCE (or equivalent SSCE) results slip. Diploma programmes typically ask for credit passes (A1–C6) in English Language, Mathematics, Integrated Science, and three relevant electives (Biology or Chemistry for General Nursing; Biology for Midwifery). Confirm the current intake aggregate with the Admissions Office — published cut-offs change by year and programme.'
WHERE label = 'WASSCE results slip (certified copy)' AND (details IS NULL OR details = '');

UPDATE public.documents_required
SET details = 'Bring your original birth certificate or a valid Ghana Card, plus a photocopy. Names must match your WASSCE records. If they differ, include a gazette notice or affidavit as used by Ghanaian training institutions.'
WHERE label = 'Birth certificate or national ID' AND (details IS NULL OR details = '');

UPDATE public.documents_required
SET details = 'Four recent colour passport photographs, usually on a white background, from the same sitting. Write your full name lightly on the reverse. Follow any extra instructions on the current admission notice.'
WHERE label = 'Passport photographs (4)' AND (details IS NULL OR details = '');

UPDATE public.documents_required
SET details = 'A medical fitness report from a licensed medical officer, preferably a government or accredited facility, confirming you are fit for nursing or midwifery training. Use the checklist in your admission letter if specific tests are requested for this intake.'
WHERE label = 'Medical fitness report' AND (details IS NULL OR details = '');
