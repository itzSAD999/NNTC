-- =============================================================================
-- NMTC seed data (Phase 1 + Expansion)
-- Run after migrations: supabase db reset  OR  supabase db push && psql seed
-- =============================================================================

-- ---------------------------------------------------------------------------
-- settings singleton
-- ---------------------------------------------------------------------------

INSERT INTO public.settings (
  id,
  college_name,
  motto,
  primary_color,
  accent_color,
  phone_main,
  email_main,
  address,
  office_hours,
  domain,
  default_language,
  notification_email_template
)
VALUES (
  1,
  'Nandom Nursing and Midwifery Training College',
  'Excellence in Nursing and Midwifery Education',
  '#1A5E3A',
  '#9A1B2F',
  NULL,
  'info@nmtc.edu.gh',
  'Nandom, Upper West Region, Ghana',
  'Monday – Friday, 8:00 AM – 4:00 PM',
  'nmtc.edu.gh',
  'en',
  'Dear {{student_name}}, your {{document_type}} (reference {{reference_no}}) is ready for {{delivery_method}}. Please contact the Academic Office if you have questions.'
)
ON CONFLICT (id) DO UPDATE SET
  college_name = EXCLUDED.college_name,
  motto = EXCLUDED.motto,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- about_content singleton
-- ---------------------------------------------------------------------------

INSERT INTO public.about_content (
  id,
  history,
  vision,
  mission,
  core_values,
  principal_name,
  principal_title,
  principal_message
)
VALUES (
  1,
  '',
  'To be a centre of excellence in nursing and midwifery education in Ghana.',
  'To train competent, compassionate nurses and midwives who serve with integrity.',
  ARRAY['Excellence', 'Integrity', 'Compassion', 'Professionalism'],
  NULL,
  'Principal',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- document_types
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- staff_accounts — linked to auth.users by email
-- Create these 5 users in Supabase Auth first (Dashboard or Admin API), then
-- re-run seed. Passwords are set at user creation, not in this file.
-- ---------------------------------------------------------------------------

INSERT INTO public.staff_accounts (id, full_name, email, role)
SELECT u.id, 'Super Admin', 'admin@nmtc.edu.gh', 'super_admin'::public.staff_role
FROM auth.users u
WHERE u.email = 'admin@nmtc.edu.gh'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

INSERT INTO public.staff_accounts (id, full_name, email, role)
SELECT u.id, 'Content Editor', 'editor@nmtc.edu.gh', 'content_editor'::public.staff_role
FROM auth.users u
WHERE u.email = 'editor@nmtc.edu.gh'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

INSERT INTO public.staff_accounts (id, full_name, email, role)
SELECT u.id, 'Academic Office', 'academic@nmtc.edu.gh', 'academic'::public.staff_role
FROM auth.users u
WHERE u.email = 'academic@nmtc.edu.gh'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

INSERT INTO public.staff_accounts (id, full_name, email, role)
SELECT u.id, 'Accounts Office', 'accounts@nmtc.edu.gh', 'accounts'::public.staff_role
FROM auth.users u
WHERE u.email = 'accounts@nmtc.edu.gh'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

INSERT INTO public.staff_accounts (id, full_name, email, role)
SELECT u.id, 'Principal', 'principal@nmtc.edu.gh', 'principal'::public.staff_role
FROM auth.users u
WHERE u.email = 'principal@nmtc.edu.gh'
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- accreditations
-- ---------------------------------------------------------------------------

INSERT INTO public.accreditations (body_name, accreditation_no, sort_order)
SELECT 'Nursing & Midwifery Council of Ghana', NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.accreditations
  WHERE body_name = 'Nursing & Midwifery Council of Ghana'
);

-- ---------------------------------------------------------------------------
-- Expansion — departments
-- ---------------------------------------------------------------------------

INSERT INTO public.departments (name, slug)
VALUES
  ('Nursing', 'nursing'),
  ('Midwifery', 'midwifery')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Expansion — programmes + curriculum
-- ---------------------------------------------------------------------------

INSERT INTO public.programs (
  slug,
  name,
  department_id,
  duration,
  qualification,
  entry_requirements,
  description,
  career_prospects,
  is_published,
  sort_order
)
SELECT
  'general-nursing',
  'General Nursing',
  d.id,
  '3 years',
  'Diploma',
  'WASSCE credit passes in English, Mathematics, Integrated Science, and three elective subjects including Biology or Chemistry.',
  'A comprehensive nursing programme preparing students for professional nursing practice.',
  'Graduates may work in hospitals, clinics, community health, and pursue further studies.',
  true,
  1
FROM public.departments d
WHERE d.slug = 'nursing'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  department_id = EXCLUDED.department_id,
  duration = EXCLUDED.duration,
  qualification = EXCLUDED.qualification,
  entry_requirements = EXCLUDED.entry_requirements,
  description = EXCLUDED.description,
  career_prospects = EXCLUDED.career_prospects,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO public.programs (
  slug,
  name,
  department_id,
  duration,
  qualification,
  entry_requirements,
  description,
  career_prospects,
  is_published,
  sort_order
)
SELECT
  'general-midwifery',
  'General Midwifery',
  d.id,
  '3 years',
  'Diploma',
  'WASSCE credit passes in English, Mathematics, Integrated Science, and three elective subjects including Biology.',
  'Training in safe midwifery care for women, newborns, and families.',
  'Graduates may work in maternity units, community health, and teaching hospitals.',
  true,
  2
FROM public.departments d
WHERE d.slug = 'midwifery'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  department_id = EXCLUDED.department_id,
  duration = EXCLUDED.duration,
  qualification = EXCLUDED.qualification,
  entry_requirements = EXCLUDED.entry_requirements,
  description = EXCLUDED.description,
  career_prospects = EXCLUDED.career_prospects,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO public.program_modules (program_id, year_label, modules, sort_order)
SELECT p.id, 'Year 1', ARRAY['Anatomy & Physiology', 'Fundamentals of Nursing', 'Microbiology'], 1
FROM public.programs p
WHERE p.slug = 'general-nursing'
  AND NOT EXISTS (
    SELECT 1 FROM public.program_modules pm
    WHERE pm.program_id = p.id AND pm.year_label = 'Year 1'
  );

INSERT INTO public.program_modules (program_id, year_label, modules, sort_order)
SELECT p.id, 'Year 1', ARRAY['Antenatal Care', 'Fundamentals of Midwifery', 'Community Health'], 1
FROM public.programs p
WHERE p.slug = 'general-midwifery'
  AND NOT EXISTS (
    SELECT 1 FROM public.program_modules pm
    WHERE pm.program_id = p.id AND pm.year_label = 'Year 1'
  );

-- ---------------------------------------------------------------------------
-- Expansion — admissions
-- ---------------------------------------------------------------------------

INSERT INTO public.admissions_content (
  id,
  process_steps,
  application_fee,
  payment_instructions,
  academic_calendar,
  selection_criteria
)
VALUES (
  1,
  '[
    {"title": "Purchase form", "body": "Obtain the application form from the Admissions Office or download when available."},
    {"title": "Submit documents", "body": "Return the completed form with certified copies of required documents."},
    {"title": "Interview", "body": "Shortlisted applicants will be invited for an interview."},
    {"title": "Admission offer", "body": "Successful candidates receive an admission letter and fee schedule."}
  ]'::jsonb,
  150.00,
  'Pay the application fee via bank transfer or mobile money. Keep your receipt.',
  'Academic year typically runs September to July. Consult the Admissions Office for the current calendar.',
  'Selection is based on WASSCE results, interview performance, and programme capacity.'
)
ON CONFLICT (id) DO UPDATE SET
  process_steps = EXCLUDED.process_steps,
  application_fee = EXCLUDED.application_fee,
  payment_instructions = EXCLUDED.payment_instructions,
  academic_calendar = EXCLUDED.academic_calendar,
  selection_criteria = EXCLUDED.selection_criteria,
  updated_at = now();

INSERT INTO public.documents_required (label, sort_order)
SELECT v.label, v.sort_order
FROM (VALUES
  ('Completed application form', 1),
  ('WASSCE results slip (certified copy)', 2),
  ('Birth certificate or national ID', 3),
  ('Passport photographs (4)', 4),
  ('Medical fitness report', 5)
) AS v(label, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.documents_required dr WHERE dr.label = v.label
);

INSERT INTO public.admissions_faqs (question, answer, sort_order)
SELECT v.question, v.answer, v.sort_order
FROM (VALUES
  (
    'When does admissions open?',
    'Admissions typically open in the second quarter of each year. Check the News page or contact the Admissions Office for exact dates.',
    1
  ),
  (
    'Can I apply with awaiting results?',
    'Applicants with awaiting WASSCE results may apply provisionally. Final admission depends on meeting entry requirements when results are released.',
    2
  )
) AS v(question, answer, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.admissions_faqs f WHERE f.question = v.question
);

-- ---------------------------------------------------------------------------
-- Expansion — fees & financial aid
-- ---------------------------------------------------------------------------

INSERT INTO public.fees (program_id, year_label, fee_type, amount, due_note, sort_order)
SELECT NULL, 'Year 1', 'Tuition', 2800.00, 'Payable at registration', 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.fees
  WHERE program_id IS NULL AND year_label = 'Year 1' AND fee_type = 'Tuition'
);

INSERT INTO public.fees (program_id, year_label, fee_type, amount, due_note, sort_order)
SELECT NULL, 'Year 1', 'Registration', 350.00, 'Non-refundable', 2
WHERE NOT EXISTS (
  SELECT 1 FROM public.fees
  WHERE program_id IS NULL AND year_label = 'Year 1' AND fee_type = 'Registration'
);

INSERT INTO public.payment_methods (method, details, sort_order)
SELECT v.method, v.details, v.sort_order
FROM (VALUES
  ('Bank transfer', 'Ghana Commercial Bank — NMTC Fees Account (contact Finance Office for account number)', 1),
  ('MTN Mobile Money', 'Pay to the college MoMo merchant number displayed at the Finance Office', 2)
) AS v(method, details, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.payment_methods pm WHERE pm.method = v.method
);

INSERT INTO public.scholarships (name, eligibility, how_to_apply, sort_order)
SELECT
  'District Assembly Support',
  'Students from the district with demonstrated financial need and strong academic record.',
  'Apply through the Student Welfare Office during the first semester.',
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.scholarships s WHERE s.name = 'District Assembly Support'
);

-- ---------------------------------------------------------------------------
-- Expansion — staff directory (public profiles, not login accounts)
-- ---------------------------------------------------------------------------

INSERT INTO public.staff_profiles (
  slug,
  full_name,
  job_title,
  department_id,
  qualification,
  bio,
  is_published,
  sort_order
)
SELECT
  'sample-lecturer',
  'Dr. Sample Lecturer',
  'Senior Lecturer',
  d.id,
  'MSc Nursing Education',
  'Sample profile for development. Replace with real staff directory entries.',
  true,
  1
FROM public.departments d
WHERE d.slug = 'nursing'
ON CONFLICT (slug) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  job_title = EXCLUDED.job_title,
  department_id = EXCLUDED.department_id,
  qualification = EXCLUDED.qualification,
  bio = EXCLUDED.bio,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Expansion — campus life
-- ---------------------------------------------------------------------------

INSERT INTO public.campus_sections (section_key, title, body, sort_order)
SELECT v.section_key, v.title, v.body, v.sort_order
FROM (VALUES
  (
    'overview',
    'Campus overview',
    'NMTC offers a supportive learning environment with classrooms, skills labs, and clinical placement partnerships.',
    1
  ),
  (
    'accommodation',
    'Accommodation',
    'Limited hostel accommodation is available. Contact the Student Welfare Office for availability and fees.',
    2
  )
) AS v(section_key, title, body, sort_order)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Expansion — gallery
-- ---------------------------------------------------------------------------

INSERT INTO public.gallery_albums (title, slug, sort_order)
VALUES ('Campus Life', 'campus-life', 1)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Expansion — events
-- ---------------------------------------------------------------------------

INSERT INTO public.events (
  slug,
  title,
  description,
  starts_at,
  location,
  is_past
)
SELECT
  'open-day-2026',
  'NMTC Open Day',
  'Visit the college, meet faculty, and learn about our nursing and midwifery programmes.',
  (date_trunc('year', now()) + interval '6 months')::timestamptz,
  'NMTC Main Campus, Nandom',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.events e WHERE e.slug = 'open-day-2026'
);

-- ---------------------------------------------------------------------------
-- Expansion — org chart
-- ---------------------------------------------------------------------------

INSERT INTO public.org_units (name, head_name, parent_id, sort_order)
SELECT 'Academic Affairs', 'Academic Officer', NULL, 1
WHERE NOT EXISTS (
  SELECT 1 FROM public.org_units ou WHERE ou.name = 'Academic Affairs'
);

INSERT INTO public.org_units (name, head_name, parent_id, sort_order)
SELECT
  'Nursing Department',
  'Head of Nursing',
  parent.id,
  2
FROM public.org_units parent
WHERE parent.name = 'Academic Affairs'
  AND NOT EXISTS (
    SELECT 1 FROM public.org_units ou WHERE ou.name = 'Nursing Department'
  );

-- ---------------------------------------------------------------------------
-- Expansion — student resources
-- ---------------------------------------------------------------------------

INSERT INTO public.resources (title, category, file_url, description, is_published, sort_order)
SELECT
  'Student Handbook',
  'Handbook',
  'documents/student-handbook.pdf',
  'Guidelines for students on conduct, assessment, and college services.',
  true,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources r WHERE r.title = 'Student Handbook'
);
