# End-to-end happy path checklist

Run this after deployment (or locally with Supabase + Resend configured) to confirm the full document request workflow.

## Setup

- [ ] `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_INBOX_EMAIL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (required for student submit)
- [ ] Staff users created in Supabase Auth + `staff_accounts` for: academic, accounts, principal
- [ ] Test student email inbox accessible

## 1. Student submits request

1. Open `/request`
2. Fill form with valid data + upload receipt (PDF/JPG)
3. Submit

**Expected:**
- [ ] Redirect to `/request/success?ref=NMTC-...`
- [ ] Student receives **confirmation email** with reference number and track link
- [ ] Request appears in **Academic** dashboard (`/dashboard/academic`)

## 2. Academic approves

1. Sign in as academic staff
2. Open request from queue → **Approve**

**Expected:**
- [ ] Status → `academic_approved`
- [ ] Request appears in **Accounts** dashboard (`/dashboard/accounts`)
- [ ] Audit log entry created

## 3. Accounts confirms payment

1. Sign in as accounts staff
2. Open request → **Confirm payment**

**Expected:**
- [ ] Status → `payment_confirmed`
- [ ] Request appears in **Principal** dashboard (`/dashboard/principal`)

## 4. Principal approves

1. Sign in as principal
2. Open request → **Approve**

**Expected:**
- [ ] Status → `approved`
- [ ] Student receives **approval email** (uses Settings notification template if configured)
- [ ] `notified` event in audit log

## 5. Mark collected

1. Any workflow staff opens request detail
2. **Mark collected**

**Expected:**
- [ ] Status → `collected`
- [ ] Student track page shows collected status

## 6. Send-back path (optional)

1. Academic or Accounts **Send back** with note (≥5 chars)

**Expected:**
- [ ] Status → `returned`
- [ ] Student receives **action required** email with reason

## 7. Contact form

1. Submit `/contact` form

**Expected:**
- [ ] Success message on site
- [ ] Row in `/dashboard/admin/inbox`
- [ ] Email forwarded to `CONTACT_INBOX_EMAIL`

## 8. Branding

- [ ] All emails use college name, colours, and layout from shared template
- [ ] Approval email respects **Settings → notification email template** placeholders:
  `{{student_name}}`, `{{reference_no}}`, `{{document_type}}`, `{{delivery_method}}`, `{{college_name}}`
