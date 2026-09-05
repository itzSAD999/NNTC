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

Migrations create **`receipts`** (private), **`public-assets`** (public), and **`documents`** (public). Confirm in Supabase → Storage. See `docs/SECURITY.md` for what belongs in each bucket.

### Auth redirect URLs

Supabase → Authentication → URL Configuration:

| Setting | Value |
|---------|-------|
| Site URL | `https://nmtc.edu.gh` (or your domain) |
| Redirect URLs | `https://nmtc.edu.gh/**`, `https://*.vercel.app/**` |

### MFA (production)

Enable TOTP in Supabase → Authentication → MFA for staff, especially `super_admin`, `principal`, and `accounts`. Details in `docs/SECURITY.md`.

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

Your repo: [github.com/itzSAD999/NNTC](https://github.com/itzSAD999/NNTC) — the Next.js app lives in **`nmtc-platform/`**, not the repo root.

### Option A — Git integration (recommended)

1. Push `main` to GitHub.
2. [Vercel](https://vercel.com) → **Add New Project** → Import **itzSAD999/NNTC**.
3. **Root Directory:** click **Edit** → set to `nmtc-platform` (required).
4. Framework: **Next.js** (auto-detected). Build command: `npm run build`.
5. Deploy. Add environment variables (below), then **Redeploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd nmtc-platform
vercel link
vercel --prod
```

### Environment variables (Vercel → Project → Settings → Environment Variables)

Set for **Production** (and **Preview** if you want staging):

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server only — request submit + receipt upload |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://your-domain.gh` or `https://your-project.vercel.app` until custom domain is live |
| `RESEND_API_KEY` | Yes | Resend API key |
| `EMAIL_FROM` | Yes | e.g. `NMTC <no-reply@nmtc.edu.gh>` (verified domain) |
| `CONTACT_INBOX_EMAIL` | Yes | College inbox for contact form |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes (prod) | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Yes (prod) | Turnstile secret — server only |

Optional: `EMAIL_MAIN` if `CONTACT_INBOX_EMAIL` is unset.

**Important:** `SUPABASE_SERVICE_ROLE_KEY` and `TURNSTILE_SECRET_KEY` must not be prefixed with `NEXT_PUBLIC_`.

After changing env vars, trigger **Redeploy** from the Deployments tab.

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

- [ ] `/login` — staff can sign in (active `staff_accounts` row)
- [ ] `/request` — submit works; Turnstile passes; confirmation email received
- [ ] `/request/track?ref=...` — status lookup works
- [ ] `/contact` — message saved + inbox email
- [ ] `/dashboard/admin/settings` — branding saves
- [ ] Receipt on request detail loads (signed URL; refresh if link expires)
- [ ] Workflow actions work for academic → accounts → principal
- [ ] Audit log shows events

See also `docs/HAPPY_PATH_CHECKLIST.md` and `docs/SECURITY.md`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Vercel | Root Directory must be `nmtc-platform` |
| Emails not sending | `RESEND_API_KEY`, verified domain, env on Production |
| Request submit fails | `SUPABASE_SERVICE_ROLE_KEY` on Vercel; run `supabase db push` |
| Contact/request blocked | Set Turnstile keys in production env |
| Staff login fails | Auth user + `staff_accounts` with `is_active = true` |
| MFA blocks workflow | Enroll MFA in Supabase; sign in with second factor |
| Images broken | Supabase host in `next.config.mjs` `remotePatterns` |

---

## Local development

```bash
cp .env.example .env.local
# Fill in Supabase + Resend keys
npm install
npm run dev
```

For local Supabase: `supabase start` then `supabase db reset`.
