# NMTC Website & Document Request System
## Technical Specification Document (Comprehensive)

**Project:** Nandom Nursing and Midwifery Training College — Website & Document Request System
**Prepared by:** MiStarStudio · Osmond Abdul-Karim Woriwi (Project & Product Manager)
**Version:** 2.1 · June 2026 · Confidential
**Design language:** Clinical-institutional — nursing whites & greens grounded in Harvard/MIT structural rigor (hairline rules, disciplined grid, restrained serif display, clean sans body)

> **Version 2.1 note (June 2026):** Section 7 updated to reflect the implemented App Router structure — `(site)` / `(auth)` route groups, domain-organised `components/`, `lib/data/` + `lib/requests/` helpers, and the `{feature}-page.tsx` naming convention alongside thin `page.tsx` entry files. Public URLs are unchanged.

> **Version 2.0 note:** This revision cross-checks the full *Client Requirements Document* (12 sections) against the build and expands the database schema and page specifications to cover **every** item the college is asked to provide — programmes, admissions, fees, staff directory, campus life, gallery, news & events — in addition to the document request system. Nothing in the requirements document is left unmodelled.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Requirements Traceability Matrix](#2-requirements-traceability-matrix)
3. [Goals & Non-Goals](#3-goals--non-goals)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Design System](#6-design-system)
7. [Project File Structure](#7-project-file-structure)
8. [Routing Map](#8-routing-map)
9. [Database Schema — Full](#9-database-schema--full)
10. [Entity Relationship Overview](#10-entity-relationship-overview)
11. [Roles & Permissions](#11-roles--permissions)
12. [Public Website Pages — Full](#12-public-website-pages--full)
13. [Document Request System](#13-document-request-system)
14. [Admin Dashboards](#14-admin-dashboards)
15. [Content Management (CMS)](#15-content-management-cms)
16. [Request State Machine](#16-request-state-machine)
17. [Notifications](#17-notifications)
18. [Server Actions / API](#18-server-actions--api)
19. [Security & Access Control](#19-security--access-control)
20. [Storage Buckets](#20-storage-buckets)
21. [Environment & Configuration](#21-environment--configuration)
22. [Deployment](#22-deployment)
23. [Phase Plan](#23-phase-plan)
24. [What the College Provides](#24-what-the-college-provides)

---

## 1. Overview

NMTC currently runs its transcript and attestation process on paper: a student writes a physical letter, pays at the bank, carries the receipt to the Accounts Office, and returns later to collect the document. The process is slow, crowds the offices, and offers no way to track a request.

This project delivers:

1. **A complete public website** — Home, About, Programmes, Admissions, Fees & Financial Aid, Staff, Campus Life, Gallery, News, Events, and Contact.
2. **A document request system** — students submit requests online, upload payment receipts, and track status; staff process them through the existing chain (Academic Office → Accounts Office → Principal).
3. **A content management layer** — staff log in and keep every page up to date (announcements, news, events, programmes, staff, gallery) without touching code.

The system mirrors NMTC's existing workflow exactly. The technology fits around the college, not the other way around.

---

## 2. Requirements Traceability Matrix

Every section of the *Client Requirements Document* maps to a page, the data tables that store it, and the CMS screen that maintains it.

| # | Requirements Section | Public Page | Database Tables | CMS Screen |
|---|---|---|---|---|
| 1 | Branding & Identity | Global (header/footer) | `settings` | Admin → Settings |
| 2 | About Us | `/about` | `about_content`, `accreditations`, `org_units` | Admin → About |
| 3 | Programs & Courses | `/programs`, `/programs/[slug]` | `programs`, `program_modules`, `departments` | Admin → Programmes |
| 4 | Admissions | `/admissions` | `admissions_content`, `admissions_faqs`, `documents_required` | Admin → Admissions |
| 5 | Fees & Financial Aid | `/financial-aid` | `fees`, `payment_methods`, `scholarships` | Admin → Fees |
| 6 | Staff & Lecturers | `/faculty`, `/faculty/[slug]` | `staff_profiles`, `departments` | Admin → Staff |
| 7 | Campus Life | `/campus-life` | `campus_sections` | Admin → Campus Life |
| 8 | Photos & Videos | `/gallery` | `gallery_albums`, `gallery_media` | Admin → Gallery |
| 9 | Contact Details | `/contact` | `settings`, `contact_messages` | Admin → Settings / Inbox |
| 10 | News & Events | `/news`, `/events` | `posts`, `events` | Admin → News / Events |
| 10b | Student Resources | `/resources` | `resources` | Admin → Resources |
| 11 | Transcript / Document System | `/request`, `/dashboard/*` | `requests`, `request_events`, `document_types`, `staff_accounts` | Dashboards |
| 12 | Technical Preferences | Config | `settings` | Admin → Settings |

> **Phasing:** Sections 1, 2, 9, 10 (partial), and 11 form the NMTC Phase-1 core (the four pages in the proposal plus the request system). Sections 3–8 are the full-college expansion. This spec models them all so the schema is built once and pages can be switched on per phase without migration churn.

---

## 3. Goals & Non-Goals

### Goals
- Professional online presence reflecting NMTC's accredited standing.
- Every requirement-document item has a home in the data model and a page to display it.
- Replace the paper transcript/attestation process with a trackable digital flow.
- Staff maintain all content themselves through the CMS.
- Every request carries a unique reference number, live status, and complete audit history.

### Non-Goals (Phase 1 of NMTC build)
- No online fee payment (Paystack) — receipt upload only.
- No student login portal — tracking by reference number.
- No SMS (Hubtel) — email only.
- No academic records / results / course registration.

---

## 4. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | Server components, file-based routing, fast on phones/tablets |
| Language | **TypeScript** | Type safety across UI, actions, and DB models |
| Styling | **Tailwind CSS** | Consistent tokens, small bundle |
| UI primitives | **shadcn/ui + Radix** | Accessible, fully styleable |
| Database | **Supabase (PostgreSQL)** | Relational data, Row Level Security |
| File storage | **Supabase Storage** | Receipts, photos, videos, documents |
| Auth (staff) | **Supabase Auth** | Email/password staff logins |
| Email | **Resend** | Transactional + contact-form emails |
| Rich text | **Tiptap** | CMS body editing for news, about, programmes |
| Hosting | **Vercel** | Zero-config Next.js, 24/7, auto HTTPS |
| Forms & validation | **React Hook Form + Zod** | Client + server validation |
| Maps | **Google Maps Embed** | Contact page location |

### Phase 2 additions
| Capability | Technology |
|---|---|
| Online payments | Paystack |
| SMS notifications | Hubtel |
| Student portal | Supabase Auth (student role) |

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                      │
│  Public site · Request form · Track · Staff dashboards · CMS │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│                    NEXT.JS APP (Vercel)                      │
│  Server Components · Server Actions · Route Handlers         │
│  Middleware (auth gate for /dashboard/*)                     │
└───────────┬───────────────────────────────┬─────────────────┘
            │                               │
┌───────────▼─────────────┐     ┌───────────▼─────────────────┐
│        SUPABASE         │     │           RESEND            │
│  Postgres + RLS         │     │  Status emails              │
│  Storage (4 buckets)    │     │  Contact-form forwarding    │
│  Auth (staff accounts)  │     └─────────────────────────────┘
└─────────────────────────┘
```

- **Public pages**: statically rendered / ISR for speed; content pulled from CMS tables.
- **Dashboards & CMS**: under `/dashboard/*`, gated by middleware + role.
- **Server Actions** handle all writes; business rules run server-side.
- **Row Level Security** is the second line of defense at the database.

---

## 6. Design System

Visual direction: **clinical precision meets institutional authority** — the calm, clean feel of a nursing environment (white space, greens) with the structural seriousness of Harvard/MIT (refined serif display, hairline rules, disciplined grid, generous margins).

### Color tokens
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#FBFBF9` | Page background — warm clinical white |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-ink` | `#14241B` | Primary text — deep forest near-black |
| `--color-primary` | `#1A5E3A` | NMTC green — primary actions |
| `--color-primary-deep` | `#0E3D26` | Hovers, dark sections |
| `--color-accent` | `#9A1B2F` | Crimson — Harvard-leaning accent, used sparingly |
| `--color-muted` | `#6B7A72` | Captions, secondary text |
| `--color-line` | `#E2E6E3` | Hairline rules, borders |
| `--color-success` | `#1A7A4A` | Confirmed / approved |
| `--color-warning` | `#B8860B` | Pending / awaiting |
| `--color-danger` | `#9A1B2F` | Rejected / errors |

> If the college supplies official colours (Requirements §1), they override `--color-primary` and `--color-accent`; the rest of the scale is derived from them.

### Typography
| Role | Typeface | Notes |
|---|---|---|
| Display / headings | **Source Serif 4** (or Fraunces) | Serif, used with restraint for authority |
| Body / UI | **Inter** | Clean, legible everywhere |
| Data / mono | **IBM Plex Mono** | Reference numbers, timestamps, audit log |

Type scale (rem): `3.0 / 2.25 / 1.75 / 1.375 / 1.125 / 1.0 / 0.875 / 0.75`

### Signatures
- Hairline rules (1px) separating sections, no heavy borders.
- Reference numbers in mono, e.g. `NMTC-TR-2026-0042`.
- Status pills (dot + label), colour-coded to the state machine.
- Tight border radius (`4px`) — institutional, not playful.

### Accessibility floor
WCAG AA contrast · visible keyboard focus · `prefers-reduced-motion` respected · responsive to 360px.

---

## 7. Project File Structure

> **Structure update (June 2026):** Route groups `(site)` and `(auth)` replace the old `(public)` + separate `request/` layout. Components are organised by domain (`layout/`, `marketing/`, `contact/`, `requests/`). Each route uses a **thin `page.tsx`** that re-exports from a descriptively named `{feature}-page.tsx` sibling file.

```
nmtc-platform/
├── app/
│   ├── layout.tsx                     # Root: fonts, globals
│   ├── globals.css
│   ├── not-found.tsx                  # Global 404
│   ├── error.tsx                      # Global error boundary
│   │
│   ├── (site)/                        # Public marketing site + document requests
│   │   ├── layout.tsx                 # SiteShell: sticky nav + footer (from settings)
│   │   ├── page.tsx                   # → home-page.tsx
│   │   ├── home-page.tsx              # HomePage
│   │   ├── about/
│   │   │   ├── page.tsx               # → about-page.tsx
│   │   │   └── about-page.tsx         # AboutPage
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── contact-page.tsx       # ContactPage
│   │   ├── news/
│   │   │   ├── page.tsx
│   │   │   ├── news-page.tsx          # NewsPage (list)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── news-article-page.tsx
│   │   ├── request/                   # Document request flow (no login)
│   │   │   ├── page.tsx
│   │   │   ├── request-document-page.tsx
│   │   │   ├── success/
│   │   │   │   ├── page.tsx
│   │   │   │   └── request-submitted-page.tsx
│   │   │   └── track/
│   │   │       ├── page.tsx
│   │   │       └── track-your-request-page.tsx
│   │   ├── programs/
│   │   │   ├── page.tsx
│   │   │   ├── programs-page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── program-detail-page.tsx
│   │   ├── admissions/                # page.tsx + admissions-page.tsx
│   │   ├── financial-aid/
│   │   ├── faculty/
│   │   │   └── [slug]/                # staff-profile-page.tsx
│   │   ├── campus-life/
│   │   ├── gallery/
│   │   ├── events/
│   │   │   └── [slug]/                # event-detail-page.tsx
│   │   └── resources/
│   │
│   ├── (auth)/                        # Staff authentication (no site chrome)
│   │   ├── layout.tsx                 # Centred auth shell
│   │   └── login/
│   │       ├── page.tsx
│   │       └── login-page.tsx
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                 # Sidebar + role guard (Phase 2)
│   │   ├── page.tsx                   # → dashboard-page.tsx
│   │   ├── academic/                  # academic-dashboard-page.tsx
│   │   ├── accounts/
│   │   ├── principal/
│   │   ├── requests/[id]/             # request-detail-page.tsx
│   │   └── admin/                     # CMS + Super Admin
│   │       ├── about/                 # admin-about-page.tsx
│   │       ├── programs/
│   │       ├── admissions/
│   │       ├── fees/
│   │       ├── staff/
│   │       ├── campus-life/
│   │       ├── gallery/
│   │       ├── news/
│   │       ├── events/
│   │       ├── resources/
│   │       ├── inbox/
│   │       ├── users/
│   │       ├── settings/
│   │       └── audit/
│   │
│   ├── style-guide/
│   │   ├── page.tsx
│   │   └── style-guide-page.tsx       # Dev reference (noindex)
│   │
│   └── api/                           # Route handlers (webhooks, etc.)
│
├── components/
│   ├── ui/                            # shadcn primitives (Button, Input, StatusPill…)
│   ├── layout/                        # Site chrome
│   │   ├── site-header.tsx            # Sticky nav + mobile menu
│   │   ├── site-footer.tsx            # Footer from settings
│   │   ├── site-shell.tsx             # Header + main + footer wrapper
│   │   ├── page-header.tsx            # Inner-page eyebrow + title
│   │   └── index.ts
│   ├── marketing/                     # Public page sections
│   │   ├── hero-section.tsx
│   │   ├── highlights-strip.tsx
│   │   ├── about-sections.tsx
│   │   ├── news-card.tsx
│   │   ├── share-buttons.tsx
│   │   └── index.ts
│   ├── contact/
│   │   ├── contact-form.tsx
│   │   └── contact-details.tsx
│   ├── requests/                      # Student document request UI
│   │   ├── request-form.tsx           # React Hook Form + Zod
│   │   ├── track-form.tsx
│   │   ├── reference-display.tsx      # IBM Plex Mono reference
│   │   ├── request-timeline.tsx
│   │   └── index.ts
│   ├── dashboard/                     # Staff queue, detail views (Phase 2)
│   └── cms/                           # Tiptap editors, media picker (Phase 2)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser client
│   │   ├── server.ts                  # Server Components / actions
│   │   ├── admin.ts                   # Service-role (server only)
│   │   ├── middleware.ts              # Session refresh helper
│   │   └── config.ts                  # isSupabaseConfigured()
│   ├── data/                          # Read layer (RSC pages consume these)
│   │   ├── settings.ts
│   │   ├── about.ts
│   │   ├── posts.ts
│   │   ├── document-types.ts
│   │   └── preview.ts                 # Fallback content when DB unset
│   ├── actions/                       # Server Actions — see Section 18
│   │   ├── contact.ts
│   │   ├── requests.ts                # submitRequest, trackByReference
│   │   ├── posts.ts
│   │   ├── events.ts
│   │   ├── programs.ts
│   │   ├── staff.ts
│   │   ├── fees.ts
│   │   ├── gallery.ts
│   │   ├── about.ts
│   │   ├── resources.ts
│   │   ├── users.ts
│   │   └── settings.ts
│   ├── requests/                      # Request-domain helpers (not routes)
│   │   ├── reference.ts               # NMTC-TR-2026-0042 generation
│   │   └── status-labels.ts           # Public status + timeline labels
│   ├── email/
│   │   ├── send.ts                    # Resend wrapper
│   │   └── request.ts                 # Student confirmation template
│   ├── validation/                    # Zod schemas (contact, request, …)
│   ├── constants.ts                   # statuses, roles, storage bucket names
│   └── utils/
│       ├── cn.ts                      # Tailwind class merge (shadcn)
│       ├── format.ts                  # dates, storage URLs
│       └── index.ts                   # Barrel export
│
├── hooks/                             # Shared React hooks (reserved)
├── types/
│   └── database.ts                    # Generated Supabase types
├── scripts/
│   └── split-route-pages.mjs          # Scaffold helper: page.tsx → *-page.tsx
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
├── public/
│   └── images/
├── .cursor/rules/                     # Cursor conventions (design, routes)
├── middleware.ts
├── tailwind.config.ts
├── next.config.mjs
├── components.json                    # shadcn config
├── .env.example
└── package.json
```

### 7.1 Route page naming convention

Next.js requires `page.tsx` as the route entry. **All page UI lives in a descriptively named sibling file** so the codebase scales as routes grow.

| Rule | Example |
|---|---|
| `page.tsx` is a thin re-export only | `export { default, metadata } from "./about-page";` |
| Named file = kebab-case + `-page` | `AboutPage` → `about-page.tsx` |
| Component = PascalCase + `Page` | `RequestDocumentPage`, `AdminSettingsPage` |
| Route groups `(site)`, `(auth)` do **not** appear in URLs | `(site)/about` → `/about` |

**Examples**

| URL | Folder | Named page file | Component |
|---|---|---|---|
| `/` | `(site)/` | `home-page.tsx` | `HomePage` |
| `/news/[slug]` | `(site)/news/[slug]/` | `news-article-page.tsx` | `NewsArticlePage` |
| `/request` | `(site)/request/` | `request-document-page.tsx` | `RequestDocumentPage` |
| `/request/success` | `(site)/request/success/` | `request-submitted-page.tsx` | `RequestSubmittedPage` |
| `/login` | `(auth)/login/` | `login-page.tsx` | `LoginPage` |
| `/dashboard/admin/inbox` | `dashboard/admin/inbox/` | `admin-inbox-page.tsx` | `AdminInboxPage` |

After scaffolding stub routes, run `node scripts/split-route-pages.mjs` to split monolithic `page.tsx` files automatically. Convention is also documented in `.cursor/rules/nmtc-route-pages.mdc`.

### 7.2 Import aliases

| Alias | Path |
|---|---|
| `@/components` | `components/` |
| `@/components/ui` | `components/ui/` |
| `@/lib` | `lib/` |
| `@/lib/utils` | `lib/utils/` (barrel: `cn`, `formatDate`, …) |
| `@/hooks` | `hooks/` |


---

## 8. Routing Map

Route groups `(site)` and `(auth)` organise layouts in the filesystem; **they do not change public URLs**. See [§7.1](#71-route-page-naming-convention) for the matching `*-page.tsx` file per route.

| Route | Access | App folder | Page file | Requirements § |
|---|---|---|---|---|
| `/` | Public | `(site)/` | `home-page.tsx` | Home |
| `/about` | Public | `(site)/about/` | `about-page.tsx` | 2 |
| `/programs`, `/programs/[slug]` | Public | `(site)/programs/` | `programs-page.tsx`, `program-detail-page.tsx` | 3 |
| `/admissions` | Public | `(site)/admissions/` | `admissions-page.tsx` | 4 |
| `/financial-aid` | Public | `(site)/financial-aid/` | `financial-aid-page.tsx` | 5 |
| `/faculty`, `/faculty/[slug]` | Public | `(site)/faculty/` | `faculty-page.tsx`, `staff-profile-page.tsx` | 6 |
| `/campus-life` | Public | `(site)/campus-life/` | `campus-life-page.tsx` | 7 |
| `/gallery` | Public | `(site)/gallery/` | `gallery-page.tsx` | 8 |
| `/news`, `/news/[slug]` | Public | `(site)/news/` | `news-page.tsx`, `news-article-page.tsx` | 10 |
| `/events`, `/events/[slug]` | Public | `(site)/events/` | `events-page.tsx`, `event-detail-page.tsx` | 10 |
| `/resources` | Public | `(site)/resources/` | `resources-page.tsx` | 10b |
| `/contact` | Public | `(site)/contact/` | `contact-page.tsx` | 9 |
| `/request` | Public | `(site)/request/` | `request-document-page.tsx` | 11 |
| `/request/success` | Public | `(site)/request/success/` | `request-submitted-page.tsx` | 11 |
| `/request/track` | Public | `(site)/request/track/` | `track-your-request-page.tsx` | 11 |
| `/login` | Public | `(auth)/login/` | `login-page.tsx` | 11 |
| `/dashboard/academic` | Academic Office | `dashboard/academic/` | `academic-dashboard-page.tsx` | 11 |
| `/dashboard/accounts` | Accounts Office | `dashboard/accounts/` | `accounts-dashboard-page.tsx` | 11 |
| `/dashboard/principal` | Principal | `dashboard/principal/` | `principal-dashboard-page.tsx` | 11 |
| `/dashboard/requests/[id]` | Staff (scoped) | `dashboard/requests/[id]/` | `request-detail-page.tsx` | 11 |
| `/dashboard/admin/*` | Super Admin / Content Editor | `dashboard/admin/*/` | `admin-*-page.tsx` | 1–10 |

---

## 9. Database Schema — Full

PostgreSQL via Supabase. All tables: `uuid` PKs, `timestamptz` timestamps, `created_at`/`updated_at` where relevant. `slug` columns are unique and URL-safe.

### A. Identity & configuration

#### `settings` (singleton, id = 1) — Requirements §1, §9, §12
| Column | Type | Notes |
|---|---|---|
| id | int (PK) | always 1 |
| college_name | text | official name |
| motto | text | tagline |
| logo_url | text | storage path |
| primary_color | text | hex, overrides token |
| accent_color | text | hex |
| phone_main | text | |
| phone_admissions | text | |
| phone_finance | text | |
| email_main | text | |
| email_admissions | text | |
| email_finance | text | |
| address | text | postal + GPS |
| google_maps_url | text | embed link |
| office_hours | text | |
| facebook_url, instagram_url, x_url, whatsapp | text | social |
| domain | text | preferred domain |
| default_language | text | "en" |
| notification_email_template | text | transcript-ready email body |

### B. About (Requirements §2)

#### `about_content` (singleton, id = 1)
| Column | Type | Notes |
|---|---|---|
| id | int (PK) | always 1 |
| history | text | rich text |
| vision | text | |
| mission | text | |
| core_values | text[] | list |
| principal_name | text | |
| principal_title | text | |
| principal_message | text | rich text |
| principal_photo_url | text | storage path |

#### `accreditations`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| body_name | text | e.g. "Nursing & Midwifery Council of Ghana" |
| accreditation_no | text | nullable |
| logo_url | text | nullable |
| sort_order | int | |

#### `org_units` (optional org chart)
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | department/unit |
| head_name | text | |
| parent_id | uuid (FK, nullable) | self-reference |
| sort_order | int | |

### C. Programmes (Requirements §3)

#### `departments`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | e.g. "Nursing", "Midwifery" |
| slug | text (unique) | |

#### `programs`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text (unique) | |
| name | text | "General Nursing" |
| department_id | uuid (FK) | → departments |
| duration | text | "3 years" |
| qualification | text | Certificate / Diploma / Degree |
| entry_requirements | text | WASSCE subjects/grades, age, medical |
| description | text | rich text |
| career_prospects | text | rich text |
| cutoff_points | text | nullable |
| is_published | boolean | default true |
| sort_order | int | |

#### `program_modules` (curriculum per year)
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| program_id | uuid (FK) | → programs |
| year_label | text | "Year 1" |
| modules | text[] | subjects list |
| sort_order | int | |

### D. Admissions (Requirements §4)

#### `admissions_content` (singleton, id = 1)
| Column | Type | Notes |
|---|---|---|
| id | int (PK) | always 1 |
| process_steps | jsonb | ordered list of steps |
| application_form_url | text | storage path |
| application_fee | numeric(10,2) | |
| payment_instructions | text | |
| academic_calendar | text | rich text |
| selection_criteria | text | rich text |

#### `documents_required`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| label | text | "WASSCE results slip" |
| sort_order | int | |

#### `admissions_faqs`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| question | text | |
| answer | text | |
| sort_order | int | |

### E. Fees & Financial Aid (Requirements §5)

#### `fees`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| program_id | uuid (FK, nullable) | null = applies to all |
| year_label | text | "Year 1" |
| fee_type | text | Tuition / Registration / Exam / Accommodation / ID |
| amount | numeric(10,2) | GHS |
| due_note | text | when payable |
| sort_order | int | |

#### `payment_methods`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| method | text | Bank / MTN MoMo / Vodafone Cash / Cash |
| details | text | account no / number |
| sort_order | int | |

#### `scholarships`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | |
| eligibility | text | |
| how_to_apply | text | |
| external_url | text | nullable |

### F. Staff directory (Requirements §6) — public, distinct from login accounts

#### `staff_profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text (unique) | |
| full_name | text | |
| job_title | text | |
| department_id | uuid (FK) | → departments |
| qualification | text | highest |
| photo_url | text | storage path |
| bio | text | nullable |
| work_email | text | nullable |
| sort_order | int | |
| is_published | boolean | default true |

### G. Campus life (Requirements §7)

#### `campus_sections`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| section_key | text | overview / accommodation / dining / clubs / sports / welfare / library |
| title | text | |
| body | text | rich text |
| image_url | text | nullable |
| sort_order | int | |

### H. Gallery (Requirements §8)

#### `gallery_albums`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| title | text | Graduation / Clinical / Campus / Events / Student Life |
| slug | text (unique) | |
| sort_order | int | |

#### `gallery_media`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| album_id | uuid (FK) | → gallery_albums |
| type | text | image / video |
| url | text | storage path |
| caption | text | nullable |
| sort_order | int | |

### I. News & Events (Requirements §10)

#### `posts` (news & announcements)
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text (unique) | |
| title | text | |
| body | text | rich text |
| excerpt | text | auto/edited |
| category | text | News / Announcement / Press Release / Achievement |
| cover_image_url | text | nullable |
| is_pinned | boolean | default false |
| published_at | timestamptz | null = draft |
| author_id | uuid (FK) | → staff_accounts |

#### `events`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text (unique) | |
| title | text | |
| description | text | rich text |
| starts_at | timestamptz | |
| ends_at | timestamptz | nullable |
| location | text | |
| cover_image_url | text | nullable |
| registration_url | text | nullable |
| is_past | boolean | computed/flag |

#### `resources` (downloadable student materials) — Requirements: Student Resources page
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| title | text | "First Year Handbook 2026" |
| category | text | Handbook / Timetable / Health Guideline / Form / Academic Calendar |
| file_url | text | storage path (documents bucket) |
| description | text | nullable |
| is_published | boolean | default true |
| sort_order | int | |
| created_at | timestamptz | |

### J. Contact (Requirements §9)

#### `contact_messages`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | |
| email | text | |
| phone | text | nullable |
| subject | text | Admissions / Fees / Academic / Other |
| message | text | |
| is_read | boolean | default false |
| created_at | timestamptz | |

### K. Document request system (Requirements §11)

#### `staff_accounts` (login accounts — distinct from `staff_profiles`)
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | matches `auth.users.id` |
| full_name | text | |
| email | text (unique) | |
| role | text | `super_admin` · `content_editor` · `academic` · `accounts` · `principal` |
| is_active | boolean | default true |

#### `document_types`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| name | text | "Official Transcript", "Attestation Letter" |
| code | text | TR / AT (used in reference no) |
| fee_amount | numeric(10,2) | GHS |
| is_active | boolean | default true |

#### `requests`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| reference_no | text (unique) | `NMTC-TR-2026-0042` |
| student_name | text | |
| student_id | text | index/registration no |
| student_email | text | |
| student_phone | text | nullable |
| program | text | |
| year_completed | text | |
| document_type_id | uuid (FK) | → document_types |
| purpose | text | |
| delivery_method | text | collection / email |
| status | text | see state machine §16 |
| receipt_url | text | storage path |
| amount_expected | numeric(10,2) | copied at submit |
| created_at, updated_at | timestamptz | |

#### `request_events` (append-only history / audit)
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| request_id | uuid (FK) | → requests |
| actor_id | uuid (FK, nullable) | → staff_accounts (null = system/student) |
| actor_label | text | "Academic Office" / "System" / "Student" |
| action | text | submitted / academic_approved / sent_back / payment_confirmed / rejected_receipt / principal_approved / notified / collected |
| note | text | nullable (reason on send-back) |
| created_at | timestamptz | |

---

## 10. Entity Relationship Overview

```
settings (1)            about_content (1)            admissions_content (1)
                              │
                        accreditations *              documents_required *
                        org_units * (self)            admissions_faqs *

departments 1───* programs 1───* program_modules
departments 1───* staff_profiles
programs    1───* fees
payment_methods *        scholarships *
campus_sections *
gallery_albums 1───* gallery_media
posts *  (author → staff_accounts)
events *
resources *
contact_messages *

staff_accounts 1───* request_events *───1 requests *───1 document_types
requests 1───* request_events            (audit, append-only)
```

---

## 11. User Accounts & Roles

The system has **five staff account types**. Each person gets their own secure login (email + password via Supabase Auth) and sees only what their role allows. Two of these roles run the website content; three run the document request workflow.

### 11.1 The five accounts at a glance

| # | Account / Role | Group | One-line job |
|---|---|---|---|
| 1 | **Super Admin** | System | Full control over everything — website content, request system, and all user accounts |
| 2 | **Content Editor** | Website | Keeps the public website pages up to date — news, events, programmes, staff, gallery, fees, campus life |
| 3 | **Academic Office** | Requests | First stage of a document request — checks the student details and forwards or sends back |
| 4 | **Accounts Office** | Requests | Second stage — confirms the uploaded payment receipt |
| 5 | **Principal** | Requests | Final stage — gives one-click approval to release the document |

> `staff_accounts.role` enum: `super_admin` · `content_editor` · `academic` · `accounts` · `principal`

### 11.2 Each account in detail

#### 1. Super Admin
The single trusted person who runs the whole platform — usually the IT officer or a senior administrator.
- Full access to **every** website page editor and **every** request queue (view).
- Creates, edits, and deactivates all other staff accounts; assigns roles; resets passwords.
- Sets branding (logo, colours, college name), transcript/attestation fees, and the student email template.
- Sees the full, tamper-proof audit log of every action in the system.

#### 2. Content Editor — *the page-update person*
The person (or people) responsible for keeping the website fresh. **This is the role that updates the pages.** No technical skill needed — they log in and edit through simple forms.
- Can create, edit, publish, and reorder content on: **News, Events, Programmes, Admissions, Fees & Financial Aid, Staff directory, Campus Life, Gallery, About**.
- Can read and respond to messages from the Contact form inbox.
- **Cannot** touch the document request system, staff accounts, settings, or the audit log.
- Typically the college's PRO (Public Relations Officer), a secretary, or an administrative assistant.

#### 3. Academic Office
- Sees the queue of **new** document requests (`status = submitted`).
- Reviews each request: student name, ID, programme, year, document type, and the uploaded receipt.
- **Approve & forward** to Accounts, or **Send back** to the student with a note explaining what to fix.
- Sees the full history of any request it can access.

#### 4. Accounts Office
- Sees requests the Academic Office has already approved (`status = academic_approved`).
- Reviews the uploaded payment receipt against the expected amount.
- **Confirm payment** to move it to the Principal, or **Reject receipt** with a note.
- Sees the full history of any request it can access.

#### 5. Principal
- Sees only fully-verified requests (`status = payment_confirmed`) — clean list, nothing incomplete.
- **Approve** with one click → the system automatically emails the student that the document is ready.
- Can **Send back** to the Academic Office if something still looks wrong.
- Sees a summary of requests processed this week, this month, and in total.

### 11.3 Full permissions matrix

| Capability | Super Admin | Content Editor | Academic | Accounts | Principal |
|---|---|---|---|---|---|
| View public site | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit Home highlights | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit About | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Programmes | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Admissions | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Fees & Financial Aid | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Staff directory | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Campus Life | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage Gallery | ✓ | ✓ | ✗ | ✗ | ✗ |
| Publish News | ✓ | ✓ | ✗ | ✗ | ✗ |
| Publish Events | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage Student Resources | ✓ | ✓ | ✗ | ✗ | ✗ |
| Read contact inbox | ✓ | ✓ | ✗ | ✗ | ✗ |
| Academic request queue (act) | view | ✗ | ✓ | ✗ | ✗ |
| Accounts request queue (act) | view | ✗ | ✗ | ✓ | ✗ |
| Principal queue (act) | view | ✗ | ✗ | ✗ | ✓ |
| Manage staff accounts & roles | ✓ | ✗ | ✗ | ✗ | ✗ |
| Settings (branding, fees, templates) | ✓ | ✗ | ✗ | ✗ | ✗ |
| Audit log | ✓ | ✗ | ✗ | ✗ | ✗ |

Every staff member sees the **full history** of any request they can access but can only act at their own stage. `view` = Super Admin can see a queue for oversight but the day-to-day actor is the role owner.

### 11.4 What the Content Editor can update — page by page

| Public page | Content Editor can change |
|---|---|
| Home | Highlights, featured programmes (which appear) |
| About | History, vision, mission, values, accreditations, Principal message & photo, org chart |
| Programmes | Add/edit/remove programmes, durations, requirements, curriculum, career prospects |
| Admissions | Process steps, application form file, fees, required documents, academic calendar, FAQs |
| Fees & Financial Aid | Fee tables, payment methods, scholarships |
| Staff | Add/edit/remove staff profiles, photos, titles, bios |
| Campus Life | All campus sections and photos |
| Gallery | Albums, photos, videos |
| News | Write, edit, publish, pin announcements and news |
| Events | Add upcoming events, archive past ones |
| Student Resources | Upload/replace downloadable handbooks, timetables, forms, calendars |

> The Content Editor **cannot** see student requests, change fees in the request system, manage logins, or alter settings — those stay with Super Admin and the request-workflow roles.

---

## 12. Public Website Pages — Full

Each page below lists its purpose, the components it renders, and the tables it reads.

### 12.1 Home (`/`)
**Reads:** `settings`, `posts` (latest 3 published), `events` (next 2–3), `programs` (featured).
Hero (college name, logo, CTA "Request a Document" + "View Announcements") · highlights · latest news · upcoming events · programmes preview · footer. Sticky nav, mobile hamburger.

### 12.2 About (`/about`) — §2
**Reads:** `about_content`, `accreditations`, `org_units`.
History · Vision/Mission/Core Values · accreditation logos & numbers · Principal message + photo · org chart.

### 12.3 Programmes (`/programs`, `/programs/[slug]`) — §3
**Reads:** `programs`, `program_modules`, `departments`.
List: cards (name, duration, qualification). Detail: description, entry requirements, curriculum by year, career prospects, cut-off, "Apply" → `/admissions`.

### 12.4 Admissions (`/admissions`) — §4
**Reads:** `admissions_content`, `documents_required`, `admissions_faqs`.
Step-by-step process · entry requirements · downloadable form · application fee & payment · academic calendar · selection criteria · required documents · FAQs · admissions contact.

### 12.5 Financial Aid & Fees (`/financial-aid`) — §5
**Reads:** `fees`, `payment_methods`, `scholarships`.
Fee table by programme/year · payment schedule & methods · scholarships/bursaries · SLTF info · hardship policy · finance contact.

### 12.6 Staff & Lecturers (`/faculty`, `/faculty/[slug]`) — §6
**Reads:** `staff_profiles`, `departments`.
Directory with department filter; cards (photo, name, title, qualification); profile page (bio, specialisation, work email).

### 12.7 Campus Life (`/campus-life`) — §7
**Reads:** `campus_sections`.
Overview · accommodation · dining · clubs · sports · welfare · library; photos link to Gallery.

### 12.8 Gallery (`/gallery`) — §8
**Reads:** `gallery_albums`, `gallery_media`.
Albums by category; image/video grid; lightbox.

### 12.9 News (`/news`, `/news/[slug]`) — §10
**Reads:** `posts`.
Card list, categories, pinned first, search; single post with body, author, date, share.

### 12.10 Events (`/events`, `/events/[slug]`) — §10
**Reads:** `events`.
Upcoming list, detail page, past-events archive, optional calendar view.

### 12.11 Contact (`/contact`) — §9
**Reads:** `settings`. **Writes:** `contact_messages`.
Contact form (name, email, phone, subject, message) → stores row + emails college; phones/emails by office; address; Google Map; office hours; social links.

### 12.12 Student Resources (`/resources`) — §10b
**Reads:** `resources`.
Downloadable materials grouped by category — programme handbooks, timetables, health guidelines, important forms, and academic calendars. Each item shows title, description, category tag, and a download button. Reduces routine office visits for documents students can fetch themselves.

### 12.13 Complete page list (master)

Every page the website will contain, so nothing is missed during build.

| # | Page | Route | Group | Page file (in `app/`) | Phase |
|---|---|---|---|---|---|
| 1 | Home | `/` | `(site)` | `home-page.tsx` | 1 |
| 2 | About Us | `/about` | `(site)` | `about-page.tsx` | 1 |
| 3 | Programmes (list) | `/programs` | `(site)` | `programs-page.tsx` | Expansion |
| 4 | Programme detail | `/programs/[slug]` | `(site)` | `program-detail-page.tsx` | Expansion |
| 5 | Admissions | `/admissions` | `(site)` | `admissions-page.tsx` | Expansion |
| 6 | Financial Aid & Fees | `/financial-aid` | `(site)` | `financial-aid-page.tsx` | Expansion |
| 7 | Staff & Lecturers (list) | `/faculty` | `(site)` | `faculty-page.tsx` | Expansion |
| 8 | Staff profile | `/faculty/[slug]` | `(site)` | `staff-profile-page.tsx` | Expansion |
| 9 | Campus Life | `/campus-life` | `(site)` | `campus-life-page.tsx` | Expansion |
| 10 | Gallery | `/gallery` | `(site)` | `gallery-page.tsx` | Expansion |
| 11 | News (list) | `/news` | `(site)` | `news-page.tsx` | 1 |
| 12 | News article | `/news/[slug]` | `(site)` | `news-article-page.tsx` | 1 |
| 13 | Events (list) | `/events` | `(site)` | `events-page.tsx` | Expansion |
| 14 | Event detail | `/events/[slug]` | `(site)` | `event-detail-page.tsx` | Expansion |
| 15 | Student Resources | `/resources` | `(site)` | `resources-page.tsx` | Expansion |
| 16 | Contact | `/contact` | `(site)` | `contact-page.tsx` | 1 |
| 17 | Submit Request | `/request` | `(site)` | `request-document-page.tsx` | 1 |
| 18 | Request Success | `/request/success` | `(site)` | `request-submitted-page.tsx` | 1 |
| 19 | Track Request | `/request/track` | `(site)` | `track-your-request-page.tsx` | 1 |
| 20 | Staff Login | `/login` | `(auth)` | `login-page.tsx` | 1 |
| 21 | Academic dashboard | `/dashboard/academic` | `dashboard` | `academic-dashboard-page.tsx` | 1 |
| 22 | Accounts dashboard | `/dashboard/accounts` | `dashboard` | `accounts-dashboard-page.tsx` | 1 |
| 23 | Principal dashboard | `/dashboard/principal` | `dashboard` | `principal-dashboard-page.tsx` | 1 |
| 24 | Request detail | `/dashboard/requests/[id]` | `dashboard` | `request-detail-page.tsx` | 1 |
| 25 | CMS: About | `/dashboard/admin/about` | `dashboard` | `admin-about-page.tsx` | Expansion |
| 26 | CMS: Programmes | `/dashboard/admin/programs` | `dashboard` | `admin-programs-page.tsx` | Expansion |
| 27 | CMS: Admissions | `/dashboard/admin/admissions` | `dashboard` | `admin-admissions-page.tsx` | Expansion |
| 28 | CMS: Fees | `/dashboard/admin/fees` | `dashboard` | `admin-fees-page.tsx` | Expansion |
| 29 | CMS: Staff | `/dashboard/admin/staff` | `dashboard` | `admin-staff-page.tsx` | Expansion |
| 30 | CMS: Campus Life | `/dashboard/admin/campus-life` | `dashboard` | `admin-campus-life-page.tsx` | Expansion |
| 31 | CMS: Gallery | `/dashboard/admin/gallery` | `dashboard` | `admin-gallery-page.tsx` | Expansion |
| 32 | CMS: News | `/dashboard/admin/news` | `dashboard` | `admin-news-page.tsx` | 1 |
| 33 | CMS: Events | `/dashboard/admin/events` | `dashboard` | `admin-events-page.tsx` | Expansion |
| 34 | CMS: Resources | `/dashboard/admin/resources` | `dashboard` | `admin-resources-page.tsx` | Expansion |
| 35 | Contact Inbox | `/dashboard/admin/inbox` | `dashboard` | `admin-inbox-page.tsx` | 1 |
| 36 | Manage Users | `/dashboard/admin/users` | `dashboard` | `admin-users-page.tsx` | 1 |
| 37 | Settings | `/dashboard/admin/settings` | `dashboard` | `admin-settings-page.tsx` | 1 |
| 38 | Audit Log | `/dashboard/admin/audit` | `dashboard` | `admin-audit-page.tsx` | 1 |

---

## 13. Document Request System

### 13.1 Student experience
1. Open `/request` (`request-document-page.tsx` + `components/requests/request-form.tsx`), fill the form.
2. Upload payment receipt (photo/scan) to private `receipts` bucket via `submitRequest` in `lib/actions/requests.ts`.
3. Receive a unique **reference number** on `/request/success` (`request-submitted-page.tsx` + `ReferenceDisplay`).
4. Track anytime at `/request/track` (`track-your-request-page.tsx` + `TrackForm`).
5. Get an **email** when the document is ready (`lib/email/request.ts` via Resend).

### 13.2 Request form fields (`/request`)
| Field | Type | Required | Validation |
|---|---|---|---|
| Student full name | text | ✓ | min 3 chars |
| Student ID / index | text | ✓ | non-empty |
| Email | email | ✓ | valid |
| Phone | tel | ✗ | Ghana format |
| Programme | select | ✓ | from `programs` |
| Year completed | text | ✓ | |
| Document type | select | ✓ | from `document_types` |
| Purpose | textarea | ✓ | min 10 chars |
| Delivery method | radio | ✓ | Collection / Email |
| Payment receipt | file | ✓ | jpg/png/pdf ≤ 5 MB |

### 13.3 Reference number format
```
NMTC-<DOC>-<YEAR>-<SEQ>
Example: NMTC-TR-2026-0042
DOC = document_types.code (TR, AT) · SEQ = zero-padded yearly sequence
```

### 13.4 Tracking (`/request/track`)
Reference number → current status + simplified timeline (no internal notes). Unknown reference → clear "not found" guidance.

---

## 14. Admin Dashboards

### 14.1 Academic Office (`/dashboard/academic`)
Queue: `status = submitted`. Detail: student info, receipt thumbnail, full history. Actions: **Approve & forward** → `academic_approved`; **Send back** (note) → `returned` + email.

### 14.2 Accounts Office (`/dashboard/accounts`)
Queue: `academic_approved`. Detail: full receipt, expected amount, history. Actions: **Confirm payment** → `payment_confirmed`; **Reject receipt** (note) → `returned` + email.

### 14.3 Principal (`/dashboard/principal`)
Queue: `payment_confirmed` only. Summary strip: processed this week/month/total. Actions: **Approve** → `approved` + auto email; **Send back** (note) → Academic.

### 14.4 Super Admin (`/dashboard/admin/*`)
Users · Settings · Audit log · plus all CMS screens (Section 15).

---

## 15. Content Management (CMS)

Staff maintain every page without code. Super Admin and Content Editor share CMS access (except Users/Settings/Audit, which are Super-Admin-only).

| CMS Screen | Maintains tables | Public page |
|---|---|---|
| About | `about_content`, `accreditations`, `org_units` | `/about` |
| Programmes | `programs`, `program_modules`, `departments` | `/programs` |
| Admissions | `admissions_content`, `documents_required`, `admissions_faqs` | `/admissions` |
| Fees | `fees`, `payment_methods`, `scholarships` | `/financial-aid` |
| Staff | `staff_profiles`, `departments` | `/faculty` |
| Campus Life | `campus_sections` | `/campus-life` |
| Gallery | `gallery_albums`, `gallery_media` | `/gallery` |
| News | `posts` | `/news` |
| Events | `events` | `/events` |
| Resources | `resources` | `/resources` |
| Inbox | `contact_messages` (read/mark read) | — |

Each CMS screen: list view → create/edit form (rich text via Tiptap where applicable) → publish toggle → sort order. Media picker uploads to the appropriate storage bucket (Section 20).

---

## 16. Request State Machine

```
        submit
          │
          ▼
     ┌───────────┐  send back (note)  ┌──────────┐
     │ submitted │ ─────────────────▶ │ returned │ ─▶ student resubmits
     └────┬──────┘                    └──────────┘
          │ academic approves
          ▼
   ┌──────────────────┐  reject receipt (note)  ┌──────────┐
   │ academic_approved│ ──────────────────────▶ │ returned │
   └───────┬──────────┘                         └──────────┘
           │ accounts confirms payment
           ▼
   ┌──────────────────┐  send back (note)  ┌──────────┐
   │ payment_confirmed│ ─────────────────▶ │ returned │
   └───────┬──────────┘                    └──────────┘
           │ principal approves
           ▼
     ┌──────────┐  system emails student
     │ approved │ ─────────────────────────▶ (notified)
     └────┬─────┘
          │ staff marks collected
          ▼
     ┌──────────┐
     │ collected│  (terminal)
     └──────────┘
```

| Status | Meaning | Who advances |
|---|---|---|
| `submitted` | New, awaiting Academic | Academic Office |
| `returned` | Sent back to student | Student (resubmit) |
| `academic_approved` | Passed Academic, awaiting payment | Accounts Office |
| `payment_confirmed` | Payment verified, awaiting Principal | Principal |
| `approved` | Final approval; student emailed | Staff (mark collected) |
| `collected` | Handed over — terminal | — |

**Rule:** no stage can be skipped; each server action validates current status before transitioning.

---

## 17. Notifications

Phase 1 = email only (Resend), triggered by transitions.

| Trigger | Recipient | Content |
|---|---|---|
| Request submitted | Student | Confirmation + reference number |
| Sent back / receipt rejected | Student | Reason + how to resubmit |
| Final approval (`approved`) | Student | Document ready for collection |
| New contact message | College inbox email | Forwarded form contents |
| New request in queue | Relevant staff | Dashboard badge (+ optional email) |

Template body configurable in Settings. Phase 2 adds Hubtel SMS on the same triggers.

---

## 18. Server Actions / API

All writes are typed server actions in `lib/actions/`. Each validates input (Zod), checks role + current status, writes, appends `request_events` where relevant, and fires email.

### `requests.ts`
`submitRequest` · `academicApprove` · `sendBack(note)` · `confirmPayment` · `rejectReceipt(note)` · `principalApprove` · `markCollected` · `trackByReference`

### `posts.ts` / `events.ts`
`create` · `update` · `publish` · `togglePin` (posts) · `delete`

### `programs.ts` / `staff.ts` / `fees.ts` / `gallery.ts` / `about.ts` / `resources.ts`
CRUD + `reorder` + `togglePublish` for their respective tables.

### `contact.ts`
`submitContactMessage` (public) · `markRead` (staff)

### `users.ts` (Super Admin)
`createStaff` · `updateStaffRole` · `deactivateStaff` · `resetPassword`

### `settings.ts` (Super Admin)
`updateSettings` · `updateDocumentTypeFee`

> Every action re-checks permissions server-side. UI hiding a control is convenience, not security.

---

## 19. Security & Access Control

- **Middleware** protects `/dashboard/*`; no valid staff session → `/login`.
- **Role checks** inside every server action.
- **Row Level Security** on all tables:
  - Public content tables: public **read** of published rows only; writes restricted to `super_admin` / `content_editor`.
  - `requests`: staff read scoped by role/status; no direct student DB access (all via actions).
  - `request_events`: insert-only; no update/delete (audit integrity).
  - `staff_accounts`, `settings`: Super Admin only.
  - `contact_messages`: insert by public; read by Super Admin / Content Editor.
- **Private buckets** for receipts; signed, time-limited URLs server-side.
- **Validation**: Zod client + server; file type/size enforced.
- **No secrets on client**: service role & Resend keys server-only.

---

## 20. Storage Buckets

| Bucket | Visibility | Contents |
|---|---|---|
| `receipts` | Private | Student payment receipts (signed URLs only) |
| `media` | Public | Gallery images/videos, news/event covers |
| `staff` | Public | Staff & Principal photos |
| `documents` | Public | Application form, downloadable resources |

---

## 21. Environment & Configuration

`.env.local` (never committed):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=
EMAIL_FROM="NMTC <no-reply@nmtc.edu.gh>"
CONTACT_INBOX_EMAIL=
```

Seed (`supabase/seed.sql`): `settings` singleton, `about_content` / `admissions_content` singletons, default `departments`, `document_types` (Transcript TR, Attestation AT) with fees, and initial `staff_accounts`.

---

## 22. Deployment

- **Host:** Vercel, auto-deploy on push to `main`; preview per pull request.
- **DB & storage:** Supabase production project.
- **Domain:** college domain → Vercel; automatic HTTPS.
- **Migrations:** Supabase CLI before each release.
- **Post-launch:** 2-month warranty — launch bugs fixed at no cost.

---

## 23. Phase Plan

### Phase 1 — NMTC core
Home · About · Announcements/News · Contact · full document request system · Academic/Accounts/Principal/Super Admin dashboards · email notifications · receipt upload · reference tracking · deployment · staff training · 2-month warranty. **8–10 weeks.**

### Full-college expansion (schema already built here)
Programmes · Admissions · Fees & Financial Aid · Staff directory · Campus Life · Gallery · Events. Each can be switched on without schema migration because all tables exist from day one.

### Phase 2 — platform features
Paystack payments · Hubtel SMS · Student portal · announcement email blasts.

---

## 24. What the College Provides

Mirrors the *Client Requirements Document*; each item lands in the table noted.

| Requirements § | Item | Stored in |
|---|---|---|
| 1 | Logo, name, motto, colours | `settings` |
| 2 | History, vision, mission, values, accreditations, Principal message + photo | `about_content`, `accreditations` |
| 3 | Per-programme details + curriculum | `programs`, `program_modules` |
| 4 | Application process, form, fee, required docs, calendar, FAQs | `admissions_content`, `documents_required`, `admissions_faqs` |
| 5 | Fee schedule, payment methods, scholarships | `fees`, `payment_methods`, `scholarships` |
| 6 | Staff names, titles, photos, bios | `staff_profiles` |
| 7 | Campus life details | `campus_sections` |
| 8 | Campus/student/staff photos, video | `gallery_media`, `staff_profiles`, `settings` |
| 9 | All contact details, social media | `settings` |
| 10 | Starter news + events | `posts`, `events` |
| 11 | 5 staff accounts, transcript fee, delivery method, email template | `staff_accounts`, `document_types`, `settings` |
| 12 | Domain, design preference, language | `settings` |

---

### Document control

| | |
|---|---|
| **Prepared by** | Osmond Abdul-Karim Woriwi — Project & Product Manager, MiStarStudio |
| **For** | Mr. Jonas Kunfiri — Nandom Nursing and Midwifery Training College |
| **Version** | 2.0 — May 2026 (comprehensive; cross-checked against Client Requirements Document) |
| **Status** | Confidential — for client and development team use only |
