# AGENTS.md — PPID BAZNAS Kabupaten Cianjur

> Instruction file for AI Coding Agents (OpenCode, AntyGravity, Cursor, Windsurf, etc.)
> Read this file ENTIRELY before writing any code. All decisions must align with this document.

---

## 1. PROJECT OVERVIEW

**Project:** Website PPID (Pejabat Pengelola Informasi dan Dokumentasi) BAZNAS Kabupaten Cianjur
**Purpose:** Fulfill legal obligation under UU No. 14/2008 (Keterbukaan Informasi Publik) and increase public trust in BAZNAS's management of ZIS (Zakat, Infak, Sedekah) funds.
**Reference PRD:** `docs/PRD_PPID_BAZNAS_Kab_Cianjur_v1.0.docx`

### Core Users

| Persona               | Primary Need                                   |
| --------------------- | ---------------------------------------------- |
| Masyarakat Umum       | Submit & track permohonan informasi online     |
| Wartawan / Jurnalis   | Access public documents & statistics quickly   |
| Lembaga / Auditor     | Download official reports (keuangan ZIS, LKPJ) |
| Admin PPID (internal) | Manage requests via dashboard, SLA monitoring  |

---

## 2. TECH STACK (NON-NEGOTIABLE)

Do NOT deviate from this stack without explicit user approval.

| Layer            | Technology                            | Version           |
| ---------------- | ------------------------------------- | ----------------- |
| Frontend         | Next.js (App Router)                  | 14.x              |
| Language         | TypeScript                            | 5.x (strict mode) |
| Styling          | Tailwind CSS + shadcn/ui              | latest            |
| CMS              | Payload CMS (self-hosted)             | 3.x               |
| Database         | PostgreSQL                            | 16.x              |
| API Layer        | Next.js API Routes + tRPC             | latest            |
| Auth             | Auth.js (NextAuth v5)                 | 5.x               |
| Email            | Nodemailer + SMTP (Resend compatible) | latest            |
| File Storage     | MinIO (S3-compatible, self-hosted)    | latest            |
| ORM              | Drizzle ORM                           | latest            |
| Containerization | Docker + Docker Compose               | latest            |
| Reverse Proxy    | Nginx                                 | stable            |
| Package Manager  | pnpm                                  | 9.x               |
| Monorepo         | Turborepo                             | latest            |

### Forbidden Alternatives

- ❌ Do NOT use `npm` or `yarn` — use `pnpm` only
- ❌ Do NOT use Prisma — use Drizzle ORM
- ❌ Do NOT use `pages/` router — use `app/` router only
- ❌ Do NOT use any CSS-in-JS (styled-components, emotion)
- ❌ Do NOT use `any` TypeScript type — use `unknown` + type guards
- ❌ Do NOT use `var` — use `const`/`let` only
- ❌ Do NOT hardcode secrets — always use environment variables

---

## 3. MONOREPO STRUCTURE

```
ppid-baznas-cianjur/
├── AGENTS.md                  ← this file
├── README.md
├── package.json               ← root (pnpm workspace)
├── pnpm-workspace.yaml
├── turbo.json
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
│
├── apps/
│   ├── web/                   ← Next.js 14 (public frontend)
│   │   ├── src/
│   │   │   ├── app/           ← App Router pages
│   │   │   ├── components/    ← UI components
│   │   │   ├── lib/           ← utilities, helpers
│   │   │   ├── hooks/         ← custom React hooks
│   │   │   ├── server/        ← tRPC routers, server actions
│   │   │   ├── styles/        ← global CSS
│   │   │   └── types/         ← shared TypeScript types
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── cms/                   ← Payload CMS (admin panel)
│       ├── src/
│       │   ├── collections/   ← Payload collections (Pengumuman, FAQ, etc.)
│       │   ├── globals/       ← Payload globals (SiteSettings, Maklumat)
│       │   ├── hooks/         ← Payload hooks
│       │   └── payload.config.ts
│       └── package.json
│
├── packages/
│   ├── db/                    ← Drizzle ORM schema + migrations
│   │   ├── src/
│   │   │   ├── schema/        ← table definitions per domain
│   │   │   ├── migrations/    ← auto-generated migration files
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── email/                 ← email templates (React Email)
│   │   ├── src/
│   │   │   ├── templates/     ← per-event email templates
│   │   │   └── send.ts        ← send helper
│   │   └── package.json
│   │
│   ├── ui/                    ← shared shadcn/ui components
│   │   ├── src/
│   │   │   └── components/
│   │   └── package.json
│   │
│   └── config/                ← shared ESLint, TS, Tailwind configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── infra/
│   ├── nginx/
│   │   └── nginx.conf
│   └── scripts/
│       ├── backup.sh
│       └── deploy.sh
│
└── docs/
    ├── PRD_PPID_BAZNAS_Kab_Cianjur_v1.0.docx
    ├── api-spec.md            ← generated from tRPC (TBD)
    ├── database-schema.md     ← visual ERD description
    └── adr/                   ← Architecture Decision Records
        └── 001-monorepo-turborepo.md
```

---

## 4. CODING CONVENTIONS

### General Rules

- All code comments, variable names, and function names: **English**
- All user-facing strings (UI labels, messages, errors): **Bahasa Indonesia**
- File naming: `kebab-case` for files/folders, `PascalCase` for components, `camelCase` for functions
- Every function must have a JSDoc comment explaining its purpose
- No file should exceed **300 lines** — split into smaller modules

### TypeScript

```typescript
// ✅ CORRECT — explicit types, no `any`
interface PermohonanStatus {
  id: string
  nomorTiket: string
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak' | 'perpanjangan'
  createdAt: Date
  updatedAt: Date
}

// ✅ CORRECT — use Result pattern for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

// ❌ WRONG
const data: any = await fetch(...)
```

### React / Next.js

```typescript
// ✅ CORRECT — Server Component by default
// apps/web/src/app/permohonan/page.tsx
export default async function PermohonanPage() {
  const data = await getPermohonanList()
  return <PermohonanList data={data} />
}

// ✅ CORRECT — Client Component only when needed
'use client'
// Only add this when: useState, useEffect, event handlers, browser APIs

// ✅ CORRECT — Loading & Error boundaries always present
// app/permohonan/loading.tsx  → skeleton UI
// app/permohonan/error.tsx    → error boundary
```

### API / tRPC

```typescript
// ✅ CORRECT — input validation with Zod, always
export const permohonanRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        namaPemohon: z.string().min(3).max(100),
        email: z.string().email(),
        nomorIdentitas: z.string().min(16).max(16),
        // ...
      }),
    )
    .mutation(async ({ input }) => {
      // implementation
    }),
})
```

### Database (Drizzle)

```typescript
// ✅ CORRECT — schema in packages/db/src/schema/
// One file per domain
export const permohonan = pgTable('permohonan', {
  id: uuid('id').defaultRandom().primaryKey(),
  nomorTiket: varchar('nomor_tiket', { length: 20 }).notNull().unique(),
  // ...
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

### Environment Variables

```bash
# All secrets in .env.local (never committed)
# Document every variable in .env.example with description
DATABASE_URL=          # PostgreSQL connection string
NEXTAUTH_SECRET=       # Auth.js secret (min 32 chars)
MINIO_ENDPOINT=        # MinIO server URL
MINIO_ACCESS_KEY=      # MinIO access key
MINIO_SECRET_KEY=      # MinIO secret key
RESEND_API_KEY=        # Email service API key
PAYLOAD_SECRET=        # Payload CMS secret
```

---

## 5. DOMAIN MODEL

### Core Entities

#### `permohonan` (Information Request)

| Field             | Type         | Description                                                                                |
| ----------------- | ------------ | ------------------------------------------------------------------------------------------ |
| id                | uuid         | Primary key                                                                                |
| nomorTiket        | varchar(20)  | Auto-generated, format: `PPID-YYYYMM-XXXX`                                                 |
| namaPemohon       | varchar(100) | Requester's full name                                                                      |
| email             | varchar(255) | For notifications & tracking                                                               |
| nomorIdentitas    | varchar(16)  | KTP/NIK number                                                                             |
| alamat            | text         | Requester's address                                                                        |
| tujuanPermohonan  | text         | Purpose of request                                                                         |
| rincianInformasi  | text         | Detail of requested information                                                            |
| kategoriInformasi | enum         | berkala / serta_merta / setiap_saat                                                        |
| caraMendapatkan   | enum         | email / langsung / pos                                                                     |
| lampiranIdentitas | varchar      | MinIO file path                                                                            |
| status            | enum         | pending / diterima / klarifikasi / diproses / selesai / ditolak / perpanjangan / keberatan |
| catatanAdmin      | text         | Internal admin notes                                                                       |
| lampiranJawaban   | varchar      | MinIO file path for response doc                                                           |
| tanggalDiterima   | timestamp    | When admin validated                                                                       |
| tanggalDeadline   | timestamp    | SLA deadline (10 working days from diterima)                                               |
| tanggalSelesai    | timestamp    | When completed/rejected                                                                    |
| adminId           | uuid         | FK → user                                                                                  |
| createdAt         | timestamp    |                                                                                            |
| updatedAt         | timestamp    |                                                                                            |

#### `user` (Admin Users)

| Field     | Type         | Description                         |
| --------- | ------------ | ----------------------------------- |
| id        | uuid         | Primary key                         |
| name      | varchar(100) |                                     |
| email     | varchar(255) | Unique                              |
| password  | varchar      | Hashed (bcrypt)                     |
| role      | enum         | super_admin / admin_ppid / operator |
| isActive  | boolean      |                                     |
| createdAt | timestamp    |                                     |

#### `riwayat_permohonan` (Audit Log)

| Field        | Type      | Description             |
| ------------ | --------- | ----------------------- |
| id           | uuid      | Primary key             |
| permohonanId | uuid      | FK → permohonan         |
| statusDari   | enum      | Previous status         |
| statusKe     | enum      | New status              |
| catatan      | text      | Change note             |
| userId       | uuid      | FK → user (who changed) |
| createdAt    | timestamp |                         |

#### `pengumuman` (Announcements) — managed by Payload CMS

#### `faq` — managed by Payload CMS

#### `dokumen_publik` (Download Center) — managed by Payload CMS

---

## 6. SLA BUSINESS RULES

These rules are CRITICAL and must be implemented exactly as specified:

```
Working days calculation:
- Exclude: Saturdays, Sundays, and Indonesian national holidays
- Use library: `date-holidays` (npm) for holiday data

SLA Rules (from UU KIP No.14/2008):
1. Admin must validate request within:    1 working day  of submission
2. Max processing time:                  10 working days from validation date
3. Extension (perpanjangan) allowed:      7 additional working days (with reason)
4. Keberatan (objection) deadline:        30 working days from rejection date

Reminder schedule (automated, via cron):
- H-2 (2 working days before deadline): email + dashboard alert to admin
- H-0 (deadline day):                   email + dashboard alert + escalation to super_admin
- Overdue (past deadline):               daily escalation email to super_admin

Ticket number format: PPID-{YYYYMM}-{4-digit-sequence}
Example: PPID-202506-0001
```

---

## 7. KEY PAGES & ROUTES

### Public Routes (`apps/web`)

```
/                          → Beranda
/profil                    → Profil PPID
/profil/struktur-organisasi
/profil/dasar-hukum
/profil/maklumat-pelayanan
/informasi-publik          → Daftar Informasi Publik
/informasi-publik/berkala
/informasi-publik/serta-merta
/informasi-publik/setiap-saat
/permohonan                → Form ajukan permohonan (multi-step)
/permohonan/tracking       → Cek status via nomor tiket
/permohonan/tracking/[nomorTiket]
/download                  → Download Center
/download/[kategori]
/statistik                 → Laporan & Statistik Publik
/pengumuman                → Daftar pengumuman
/pengumuman/[slug]
/faq                       → FAQ & Panduan
/kontak                    → Kontak & Lokasi
```

### Admin Routes (`apps/web/src/app/(admin)`)

```
/admin                     → Dashboard (statistik & ringkasan)
/admin/permohonan          → Tabel semua permohonan
/admin/permohonan/[id]     → Detail & kelola permohonan
/admin/laporan             → Generate laporan PDF/Excel
/admin/pengguna            → Manajemen user (super_admin only)
```

### CMS Routes (`apps/cms`)

```
/cms                       → Payload CMS admin panel
                             Manages: Pengumuman, FAQ, DokumenPublik,
                                      SiteSettings, Maklumat, Galeri
```

---

## 8. IMPLEMENTATION PHASES

Agent MUST follow this order. Do NOT jump phases.

### Phase 1 — Infrastructure & Foundation

**Complete these first, in order:**

- [x] `TASK-001` Initialize Turborepo monorepo with pnpm workspaces
- [x] `TASK-002` Setup Docker Compose (PostgreSQL, MinIO, Next.js, Payload CMS, Nginx)
- [x] `TASK-003` Configure `.env.example` with all required variables
- [x] `TASK-004` Setup Drizzle ORM with PostgreSQL, define all schemas
- [x] `TASK-005` Run initial migrations (config + runner script — `pnpm db:generate && pnpm db:migrate`)
- [x] `TASK-006` Setup Auth.js with credentials provider + role-based middleware
- [x] `TASK-007` Setup tRPC with base router structure
- [x] `TASK-008` Initialize Payload CMS with collections (Pengumuman, FAQ, DokumenPublik)
- [x] `TASK-009` Setup shared `packages/ui` with shadcn/ui base components
- [x] `TASK-010` Setup `packages/email` with React Email + base templates

### Phase 2 — Public Frontend (MVP)

- [ ] `TASK-011` Global layout: Navbar, Footer, responsive shell
- [ ] `TASK-012` Beranda page with statistics section
- [ ] `TASK-013` Profil PPID pages (static + CMS-driven)
- [ ] `TASK-014` Daftar Informasi Publik with search & filter
- [ ] `TASK-015` Form Permohonan multi-step (4 steps) with file upload
- [ ] `TASK-016` Permohonan submission tRPC mutation + email confirmation
- [ ] `TASK-017` Tracking permohonan by nomor tiket
- [ ] `TASK-018` Download Center with kategori filter
- [ ] `TASK-019` Statistik publik with Recharts charts
- [ ] `TASK-020` Pengumuman list & detail pages (from Payload CMS)
- [ ] `TASK-021` FAQ accordion page (from Payload CMS)
- [ ] `TASK-022` Kontak page with map embed

### Phase 3 — Admin Dashboard (MVP)

- [ ] `TASK-023` Admin layout with sidebar navigation
- [ ] `TASK-024` Dashboard overview: stats cards + permohonan trend chart
- [ ] `TASK-025` Permohonan table: filter, sort, pagination, search
- [ ] `TASK-026` Permohonan detail: view, update status, upload jawaban, catatan
- [ ] `TASK-027` SLA reminder cron job (vercel cron or node-cron)
- [ ] `TASK-028` Laporan generator: PDF (react-pdf) + Excel (exceljs)
- [ ] `TASK-029` User management CRUD (super_admin only)

### Phase 4 — Polish & Deploy

- [ ] `TASK-030` Error boundaries & loading skeletons for all pages
- [ ] `TASK-031` SEO: metadata, sitemap.xml, robots.txt, Open Graph
- [ ] `TASK-032` Accessibility audit (WCAG 2.1 AA)
- [ ] `TASK-033` Nginx config: SSL (Let's Encrypt), rate limiting, gzip
- [ ] `TASK-034` GitHub Actions CI/CD pipeline
- [ ] `TASK-035` Uptime Kuma monitoring setup

---

## 9. SECURITY REQUIREMENTS

Agent must apply these on ALL relevant code:

```typescript
// 1. Input validation — ALWAYS use Zod on tRPC inputs
// 2. Authentication check — ALWAYS on admin routes
// 3. Rate limiting — on permohonan submission (max 3/hour per IP)
// 4. File upload validation:
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

// 5. SQL injection — use Drizzle parameterized queries only (never raw SQL strings)
// 6. XSS — sanitize all user-generated content with `DOMPurify` before render
// 7. CSRF — handled by Auth.js + tRPC mutations (POST only)
// 8. Sensitive data — never log: email, NIK, file paths in production
```

---

## 10. DESIGN SYSTEM

### Colors (BAZNAS Brand)

```css
--color-primary: #259148; /* BAZNAS Green — primary actions, headings */
--color-primary-dark: #145c2e; /* Hover states, emphasis */
--color-primary-light: #e8f5ee; /* Backgrounds, badges */
--color-secondary: #1a5276; /* Links, info states */
--color-text: #1a1a1a; /* Body text */
--color-text-muted: #4a4a4a; /* Secondary text */
--color-border: #dddddd; /* Borders */
--color-surface: #f5f5f5; /* Card backgrounds */
--color-accent: #fdc727;
```

### Typography

```css
font-family: 'Plus Jakarta Sans', sans-serif; /* headings */
font-family: 'Inter', sans-serif; /* body */
/* Load from Google Fonts via next/font */
```

### Component Conventions

- All form inputs: use shadcn/ui `<Input>`, `<Select>`, `<Textarea>`
- All modals: use shadcn/ui `<Dialog>`
- All tables: use shadcn/ui `<Table>` with TanStack Table
- All charts: use Recharts
- All toast notifications: use shadcn/ui `<Sonner>`
- Icons: use `lucide-react` only
- Loading states: use shadcn/ui `<Skeleton>`

---

## 11. TESTING REQUIREMENTS

```
Every new feature must include:
├── Unit tests (Vitest) for:
│   ├── tRPC procedures (business logic)
│   ├── SLA calculation functions
│   ├── Ticket number generator
│   └── Email template rendering
└── Basic integration test for:
    └── Permohonan submission flow (submit → email sent → status trackable)

Test file location: co-located with source
  src/server/routers/permohonan.ts
  src/server/routers/permohonan.test.ts
```

---

## 12. AGENT WORKFLOW INSTRUCTIONS

When given a task, agent MUST follow this workflow:

```
1. READ task ID from Phase list in Section 8
2. CHECK dependencies — is the previous task complete?
3. PLAN — list files to create/modify before writing code
4. IMPLEMENT — follow conventions in Section 4
5. VERIFY — does it satisfy acceptance criteria?
6. UPDATE — mark task as [x] done in this AGENTS.md
```

### When unsure, follow this priority:

1. Check this AGENTS.md first
2. Check `docs/` folder for detailed specs
3. Follow the tech stack docs (Next.js, Payload, Drizzle)
4. Ask the user — do NOT assume

### Do NOT:

- Generate placeholder/lorem ipsum code — implement real logic
- Skip error handling
- Create files outside the defined structure without justification
- Mix Server and Client components without clear separation
- Commit secrets or `.env` files

---

_Last updated: Juni 2025 — v1.0_
_Reference: PRD PPID BAZNAS Kab. Cianjur v1.0_
