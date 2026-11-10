-- =============================================================================
-- Migration: 20250621000013_mistar_nursing_ems.sql
-- Nandom Nursing and Midwifery Training College (Nandom NMTC)
-- Single-Institution Student Records, Clinical Rotations & Bursary Billing
-- =============================================================================

-- 1. Student Information System (SIS)
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  index_number text NOT NULL UNIQUE,
  admission_number text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  current_level int NOT NULL DEFAULT 100 CHECK (current_level IN (100, 200, 300)),
  admission_year int NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended', 'withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for instant lookup by index number and email
CREATE INDEX IF NOT EXISTS idx_students_index_number ON public.students(index_number);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);

DROP TRIGGER IF EXISTS students_set_updated_at ON public.students;
CREATE TRIGGER students_set_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2. Clinical Placements & Ward Rotations (Nursing & Midwifery Practical Training)
CREATE TABLE IF NOT EXISTS public.clinical_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  hospital_name text NOT NULL, -- e.g. Nandom Municipal Hospital, St. Joseph Hospital, Lawra Municipal Hospital
  ward_unit text NOT NULL, -- e.g. Surgical Ward, Pediatric, Maternity, Out-Patient Dept (OPD)
  start_date date NOT NULL,
  end_date date NOT NULL,
  supervisor_name text,
  assessment_score numeric(5, 2) CHECK (assessment_score >= 0 AND assessment_score <= 100),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clinical_placements_student_id ON public.clinical_placements(student_id);

DROP TRIGGER IF EXISTS clinical_placements_set_updated_at ON public.clinical_placements;
CREATE TRIGGER clinical_placements_set_updated_at
  BEFORE UPDATE ON public.clinical_placements
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 3. Bursary Invoices & Student Billing
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year text NOT NULL, -- e.g. '2026/2027'
  semester int NOT NULL CHECK (semester IN (1, 2)),
  title text NOT NULL,
  amount_due numeric(10, 2) NOT NULL CHECK (amount_due >= 0),
  amount_paid numeric(10, 2) NOT NULL DEFAULT 0.00 CHECK (amount_paid >= 0),
  status text NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'cleared')),
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_student_id ON public.invoices(student_id);

DROP TRIGGER IF EXISTS invoices_set_updated_at ON public.invoices;
CREATE TRIGGER invoices_set_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Staff full access to student records
CREATE POLICY "students_staff_all"
  ON public.students
  FOR ALL
  TO authenticated
  USING (public.is_staff_role(ARRAY['super_admin', 'academic', 'accounts', 'principal']::public.staff_role[]))
  WITH CHECK (public.is_staff_role(ARRAY['super_admin', 'academic', 'accounts', 'principal']::public.staff_role[]));

-- Students can view their own record if linked to Supabase auth user
CREATE POLICY "students_self_read"
  ON public.students
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Staff full access to clinical placements
CREATE POLICY "clinical_placements_staff_all"
  ON public.clinical_placements
  FOR ALL
  TO authenticated
  USING (public.is_staff_role(ARRAY['super_admin', 'academic', 'principal']::public.staff_role[]))
  WITH CHECK (public.is_staff_role(ARRAY['super_admin', 'academic', 'principal']::public.staff_role[]));

-- Students can view their own clinical placements
CREATE POLICY "clinical_placements_self_read"
  ON public.clinical_placements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = clinical_placements.student_id AND s.user_id = auth.uid()
    )
  );

-- Staff full access to invoices (Bursary & Accounts)
CREATE POLICY "invoices_staff_all"
  ON public.invoices
  FOR ALL
  TO authenticated
  USING (public.is_staff_role(ARRAY['super_admin', 'accounts', 'principal']::public.staff_role[]))
  WITH CHECK (public.is_staff_role(ARRAY['super_admin', 'accounts', 'principal']::public.staff_role[]));

-- Students can view their own invoices
CREATE POLICY "invoices_self_read"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = invoices.student_id AND s.user_id = auth.uid()
    )
  );
