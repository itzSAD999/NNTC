# NMTC Platform — Production deployment

This guide covers deploying the Next.js app to **Vercel**, connecting the **Supabase production** project, running migrations, configuring **Resend** email, and pointing the college domain with automatic HTTPS.

---

## Prerequisites

- [Vercel](https://vercel.com) account
- [Supabase](https://supabase.com) production project (or create one)
- [Resend](https://resend.com) account with verified sending domain (`nmtc.edu.gh` or your domain)
- Git repository (GitHub/GitLab/Bitbucket) — recommended for Vercel auto-deploy
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed locally

---

## 1. Supabase production setup

### Create / link project

```bash
cd nmtc-platform
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Find `YOUR_PROJECT_REF` in Supabase → Project Settings → General.

### Run migrations

```bash
supabase db push
```

This applies all files in `supabase/migrations/` to production.

### Seed (optional, first deploy only)

Run `supabase/seed.sql` in the SQL Editor or:

```bash
supabase db execute --file supabase/seed.sql
```

### Create staff auth users

1. Supabase Dashboard → **Authentication** → **Users** → Add user (email + password) for each staff member.
2. Run SQL to link `staff_accounts` (replace UUID and email):

```sql
INSERT INTO public.staff_accounts (id, full_name, email, role, is_active)
VALUES ('AUTH_USER_UUID', 'Admin Name', 'admin@nmtc.edu.gh', 'super_admin', true)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, is_active = true;
```

Repeat for `academic`, `accounts`, `principal`, and `content_editor` roles as needed.

### Storage buckets

Migrations create `receipts`, `media`, `staff`, `documents` buckets. Confirm in Supabase → Storage.

### Auth redirect URLs

Supabase → Authentication → URL Configuration:

| Setting | Value |
|---------|-------|
| Site URL | `https://nmtc.edu.gh` (or your domain) |
| Redirect URLs | `https://nmtc.edu.gh/**`, `https://*.vercel.app/**` |

---

## 2. Resend email setup

1. Add and verify domain in Resend (DNS: SPF, DKIM).
2. Create API key.
3. Set `EMAIL_FROM` to a verified address, e.g. `NMTC <no-reply@nmtc.edu.gh>`.

**Emails sent in Phase 1:**

| Trigger | Recipient |
|---------|-----------|
| Request submitted | Student (reference + track link) |
| Sent back / receipt rejected | Student (reason) |
| Principal approves | Student (uses Settings → notification template) |
| Contact form | College inbox |

---

## 3. Vercel deployment

### Option A — Git integration (recommended)

1. Push `nmtc-platform` to GitHub.
2. Vercel → **Add New Project** → Import repository.
3. Set **Root Directory** to `nmtc-platform` if the repo root is the parent folder.
4. Framework preset: **Next.js** (auto-detected).

### Option B — Vercel CLI

```bash
npm i -g vercel
cd nmtc-platform
vercel
vercel --prod
```

### Environment variables (Vercel → Settings → Environment Variables)

Set for **Production** (and Preview if desired):

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | `eyJ...` (server only — never expose) |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://nmtc.edu.gh` |
| `RESEND_API_KEY` | Yes | `re_...` |
| `EMAIL_FROM` | Yes | `NMTC <no-reply@nmtc.edu.gh>` |
| `CONTACT_INBOX_EMAIL` | Yes | `info@nmtc.edu.gh` |

Optional fallback: `EMAIL_MAIN` if `CONTACT_INBOX_EMAIL` is unset (settings `email_main` is also used).

Redeploy after adding variables.

---

## 4. Custom domain + HTTPS

1. Vercel → Project → **Settings** → **Domains**.
2. Add `nmtc.edu.gh` and `www.nmtc.edu.gh`.
3. Add DNS records at your registrar (Vercel shows exact values):

   - **A** record → `76.76.21.21` (or CNAME to `cname.vercel-dns.com`)
   - **www** CNAME → `cname.vercel-dns.com`

4. Vercel provisions **automatic HTTPS** (Let’s Encrypt) once DNS propagates.
5. Update `NEXT_PUBLIC_SITE_URL` to `https://nmtc.edu.gh` and redeploy.
6. Update Supabase Auth Site URL to match.

---

## 5. End-to-end happy path test

Use `docs/HAPPY_PATH_CHECKLIST.md` for a step-by-step verification:

1. **Student** submits document request at `/request` → receives confirmation email with reference.
2. **Academic** (`/dashboard/academic`) approves → moves to Accounts queue.
3. **Accounts** (`/dashboard/accounts`) confirms payment.
4. **Principal** (`/dashboard/principal`) approves → student receives approval email.
5. Staff marks **collected** on request detail page.
6. **Contact** form at `/contact` → message in inbox + forwarded email.

---

## 6. Post-deploy checks

- [ ] `/login` — staff can sign in
- [ ] `/request` — submit works; email received
- [ ] `/request/track?ref=...` — status updates after workflow steps
- [ ] `/dashboard/admin/settings` — branding saves
- [ ] `/news` — published posts visible
- [ ] Receipt signed URLs load for staff on request detail
- [ ] Audit log shows workflow events

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Emails not sending | Check `RESEND_API_KEY`, verified domain, Vercel env vars |
| Request submit fails | `SUPABASE_SERVICE_ROLE_KEY` must be set on Vercel |
| Staff login fails | User exists in Auth + matching `staff_accounts` row with `is_active = true` |
| Images broken | Add Supabase storage hostname in `next.config.mjs` `remotePatterns` |
| OneDrive build errors | Delete `.next` locally before build |

---

## Local development

```bash
cp .env.example .env.local
# Fill in Supabase + Resend keys
npm install
npm run dev
```

For local Supabase: `supabase start` then `supabase db reset`.
