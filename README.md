# Website PPID BAZNAS Kabupaten Cianjur

> Portal Pejabat Pengelola Informasi dan Dokumentasi BAZNAS Kab. Cianjur

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **CMS**: Payload CMS 3 (self-hosted)
- **Database**: PostgreSQL 16 + Drizzle ORM
- **Storage**: MinIO (S3-compatible)
- **Auth**: Auth.js (NextAuth v5)
- **Email**: Nodemailer / Resend
- **Infra**: Docker + Nginx + VPS BAZNAS

## Dokumentasi
- 📋 **PRD**: `docs/PRD_PPID_BAZNAS_Kab_Cianjur_v1.0.docx`
- 🤖 **AI Agent Instructions**: `AGENTS.md` ← **Baca ini dulu sebelum coding**
- 🗄️ **Database Schema**: `docs/database-schema.md`
- 🌐 **API Spec**: `docs/api-spec.md`

## Quick Start (Development)

```bash
# 1. Clone & install
git clone https://github.com/baznas-cianjur/ppid-baznas-cianjur.git
cd ppid-baznas-cianjur
pnpm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local dengan nilai yang sesuai

# 3. Start infrastructure (PostgreSQL + MinIO)
docker compose up -d

# 4. Run database migrations
pnpm db:migrate

# 5. Start all apps
pnpm dev
# web → http://localhost:3000
# cms → http://localhost:3001
```

## Struktur Project
Lihat `AGENTS.md` Section 3 untuk struktur folder lengkap.

## Deployment
```bash
# Production deployment ke VPS BAZNAS
./infra/scripts/deploy.sh
```

## Task Progress
Lihat `AGENTS.md` Section 8 untuk daftar task dan progress implementasi.

---
*BAZNAS Kabupaten Cianjur — Badan Amil Zakat Nasional*
