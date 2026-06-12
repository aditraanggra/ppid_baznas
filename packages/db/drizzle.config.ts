import type { Config } from 'drizzle-kit'

/**
 * Drizzle Kit config used by:
 *   - `pnpm db:generate` → generate SQL migration files from schema diff
 *   - `pnpm db:migrate`  → apply pending migrations to the database
 *   - `pnpm db:studio`   → open Drizzle Studio (web UI)
 *
 * DATABASE_URL is read from the root .env.local at runtime.
 */
export default {
  schema:  './src/schema/*.ts',
  out:     './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict:  true,
  verbose: true,
} satisfies Config
