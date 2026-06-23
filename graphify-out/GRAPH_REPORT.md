# Graph Report - ppid_baznas  (2026-06-23)

## Corpus Check
- 172 files · ~48,880 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 971 nodes · 1220 edges · 71 communities (60 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `78854c97`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 68|Community 68]]

## God Nodes (most connected - your core abstractions)
1. `Skeleton()` - 24 edges
2. `cn()` - 19 edges
3. `compilerOptions` - 17 edges
4. `getDokumenPublikList()` - 16 edges
5. `compilerOptions` - 15 edges
6. `AGENTS.md — PPID BAZNAS Kabupaten Cianjur` - 14 edges
7. `compilerOptions` - 13 edges
8. `compilerOptions` - 13 edges
9. `db` - 12 edges
10. `Button` - 11 edges

## Surprising Connections (you probably didn't know these)
- `sendReminderEmail()` --calls--> `sendEmailReminderSLA()`  [EXTRACTED]
  apps/web/src/app/api/cron/sla-reminder/route.ts → packages/email/src/index.ts
- `AdminSidebar()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/admin/AdminSidebar.tsx → packages/ui/src/lib/cn.ts
- `StatsCard()` --calls--> `cn()`  [EXTRACTED]
  apps/web/src/components/admin/StatsCard.tsx → packages/ui/src/lib/cn.ts
- `AdminNavItem` --references--> `UserRole`  [EXTRACTED]
  apps/web/src/components/admin/nav-config.ts → packages/db/src/schema/users.ts
- `Session` --references--> `UserRole`  [EXTRACTED]
  apps/web/src/lib/auth.ts → packages/db/src/schema/users.ts

## Import Cycles
- None detected.

## Communities (71 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): 10. DESIGN SYSTEM, 11. TESTING REQUIREMENTS, 12. AGENT WORKFLOW INSTRUCTIONS, 1. PROJECT OVERVIEW, 2. TECH STACK (NON-NEGOTIABLE), 3. MONOREPO STRUCTURE, 4. CODING CONVENTIONS, 5. DOMAIN MODEL (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (20): importMap, DokumenPublik, FAQ, Media, Pengumuman, Users, Maklumat, SiteSettings (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (37): getAppUrl(), sendEmailKonfirmasi(), SendEmailKonfirmasiInput, sendEmailReminderSLA(), SendEmailReminderSLAInput, getTransporter(), sendEmail(), SendEmailInput (+29 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (37): devDependencies, turbo, typescript, engines, node, pnpm, name, packageManager (+29 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (17): StatsCard(), StatsCardProps, Card, CardContent, CardDescription, CardHeader, CardTitle, Input (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (29): dependencies, cross-env, graphql, next, payload, @payloadcms/db-postgres, @payloadcms/next, @payloadcms/richtext-lexical (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (30): dependencies, bcryptjs, clsx, date-fns, date-holidays, dompurify, drizzle-orm, @hookform/resolvers (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (27): CollectionsWidget, Config, DokumenPublik, DokumenPublikSelect, Faq, FaqSelect, GeneratedTypes, MaklumatPelayanan (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (25): 1. Overview, 2. Colors: The Verdant Authority Palette, 3. Typography, 4. Elevation, 5. Components, 6. Do's and Don'ts, Badges / Status Chips, Buttons (+17 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (25): devDependencies, autoprefixer, eslint, eslint-config-next, postcss, @ppid/config, tailwindcss, @types/bcryptjs (+17 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (16): AdminHeader(), ROLE_LABELS, AdminSidebar(), metadata, ADMIN_NAV_ITEMS, AdminNavItem, filterNavByRole(), SessionProvider() (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (15): AppRouter, laporanRouter, penggunaRouter, permohonanRouter, rangeSchema, statistikRouter, createCaller, serverCaller() (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib (+13 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (14): caraMendapatkanEnum, KategoriInformasi, kategoriInformasiEnum, PermohonanInsert, StatusPermohonan, statusPermohonanEnum, RiwayatPermohonan, RiwayatPermohonanInsert (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (21): dependencies, class-variance-authority, clsx, lucide-react, @radix-ui/react-accordion, @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-select (+13 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, drizzle-orm, postgres, zod, devDependencies, drizzle-kit, tsx (+12 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (9): Badge(), BadgeProps, badgeVariants, ButtonProps, buttonVariants, CardFooter, InputProps, TextareaProps (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.11
Nodes (18): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, lib, module (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.14
Nodes (10): metadata, STATUS_COLORS, STATUS_LABELS, TrackingForm(), TrackingFormProps, formatDate(), Props, TimelineEntry (+2 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (13): BLOCK_TAGS, LexicalElementNode, LexicalNode, LexicalRootNode, LexicalTextNode, renderLexical(), getMaklumat(), getPengumumanBySlug() (+5 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (14): KategoriCount, metadata, StatistikPage(), StatusCount, TrendItem, KATEGORI_COLORS, KATEGORI_LABELS, KategoriItem (+6 more)

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (11): BerkalaPage(), metadata, DownloadKategoriPage(), KATEGORI_LABELS, PageProps, VALID_KATEGORI, getDokumenPublikList(), metadata (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+7 more)

### Community 24 - "Community 24"
Cohesion: 0.12
Nodes (15): dependencies, nodemailer, react, react-email, @react-email/components, resend, zod, devDependencies (+7 more)

### Community 25 - "Community 25"
Cohesion: 0.12
Nodes (15): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module, moduleResolution (+7 more)

### Community 26 - "Community 26"
Cohesion: 0.16
Nodes (11): Counter(), CounterProps, HeroSection(), HeroSectionProps, HomePageFAQ(), accentMap, cards, InformasiPublikCards() (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, incremental, jsx, lib, module, moduleResolution, noEmit (+6 more)

### Community 28 - "Community 28"
Cohesion: 0.14
Nodes (13): devDependencies, tailwindcss, tailwindcss-animate, typescript, exports, ./eslint, ./tailwind, ./typescript/base (+5 more)

### Community 29 - "Community 29"
Cohesion: 0.18
Nodes (10): AnimateValueOptions, BorderGlow(), BorderGlowProps, buildGlowVars(), buildGradientVars(), COLOR_MAP, GRADIENT_KEYS, GRADIENT_POSITIONS (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (10): sitemap(), EMPTY_LIST(), getPengumumanList(), MaklumatDoc, PayloadListResponse, PayloadMediaDoc, PengumumanDoc, SiteSettingsDoc (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.17
Nodes (10): metadata, ALLOWED_FILE_TYPES, CARA_OPTIONS, FormData, fullSchema, KATEGORI_OPTIONS, PermohonanForm(), step1Schema (+2 more)

### Community 32 - "Community 32"
Cohesion: 0.21
Nodes (10): DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle, EMPTY_FORM, ROLE_LABELS (+2 more)

### Community 33 - "Community 33"
Cohesion: 0.19
Nodes (8): Textarea, formatCara(), formatDate(), formatKategori(), PermohonanDetailPage(), STATUS_LABELS, STATUS_TRANSITIONS, StatusPermohonan

### Community 34 - "Community 34"
Cohesion: 0.23
Nodes (7): Footer(), Navbar(), navLinks, KontakPage(), metadata, getSiteSettings(), BerandaPage()

### Community 35 - "Community 35"
Cohesion: 0.24
Nodes (10): addWorkingDays(), calculateDeadline(), calculatePerpanjangan(), hd, isWorkingDay(), SLAStatus, adminRouter, listInputSchema (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.17
Nodes (11): compilerOptions, baseUrl, jsx, lib, module, moduleResolution, paths, exclude (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.31
Nodes (8): AccordionContent, AccordionItem, AccordionTrigger, KATEGORI_LABELS, Props, KATEGORI_LABELS, Props, FAQDoc

### Community 38 - "Community 38"
Cohesion: 0.27
Nodes (8): generateNomorTiket(), generateNomorTiketPengaduan(), pengaduanRouter, submitPengaduanSchema, cekStatusSchema, submitPermohonanSchema, Permohonan, db

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (7): DownloadPageClient(), formatFileSize(), KATEGORI_LABELS, Props, DownloadPage(), metadata, PengaduanForm()

### Community 40 - "Community 40"
Cohesion: 0.20
Nodes (6): PixelBlastProps, PixelBlastVariant, ReinitConfig, SHAPE_MAP, TouchPoint, TouchTexture

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (8): Accessibility & Inclusion, Anti-references, Brand Personality, Design Principles, Product, Product Purpose, Register, Users

### Community 43 - "Community 43"
Cohesion: 0.22
Nodes (8): compilerOptions, baseUrl, ignoreDeprecations, paths, exclude, extends, include, @/*

### Community 44 - "Community 44"
Cohesion: 0.29
Nodes (4): inter, metadata, plusJakartaSans, TRPCProvider()

### Community 45 - "Community 45"
Cohesion: 0.32
Nodes (6): InformasiPublikClient(), KATEGORI_LABELS, Props, InformasiPublikPage(), metadata, DokumenPublikDoc

### Community 46 - "Community 46"
Cohesion: 0.25
Nodes (7): Deployment, Dokumentasi, Quick Start (Development), Struktur Project, Task Progress, Tech Stack, Website PPID BAZNAS Kabupaten Cianjur

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (6): KategoriPengaduan, kategoriPengaduanEnum, Pengaduan, PengaduanInsert, StatusPengaduan, statusPengaduanEnum

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (3): DasarHukum, metadata, peraturan

### Community 49 - "Community 49"
Cohesion: 0.50
Nodes (4): FAQClient(), FAQPage(), metadata, getFAQList()

### Community 50 - "Community 50"
Cohesion: 0.60
Nodes (4): getSLAStatus(), ActiveRow, GET(), sendReminderEmail()

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (3): metadata, OfficialCard, pejabat

### Community 52 - "Community 52"
Cohesion: 0.50
Nodes (3): __dirname, __filename, nextConfig

## Knowledge Gaps
- **532 isolated node(s):** `@opencode-ai/plugin`, `__filename`, `__dirname`, `nextConfig`, `name` (+527 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 7` to `Community 10`, `Community 4`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `@trpc/client` connect `Community 4` to `Community 7`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `Skeleton()` connect `Community 5` to `Community 32`, `Community 17`, `Community 4`, `Community 33`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **What connects `@opencode-ai/plugin`, `__filename`, `__dirname` to the rest of the system?**
  _532 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06341463414634146 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06097560975609756 - nodes in this community are weakly interconnected._