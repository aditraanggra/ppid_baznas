import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'
import { users } from '../schema/users'
import { eq } from 'drizzle-orm'

/**
 * Seed the database with a default super_admin user.
 * Credentials are read from env so they are never hardcoded:
 *   - SEED_ADMIN_EMAIL    (default: admin@baznas-cianjur.or.id)
 *   - SEED_ADMIN_PASSWORD (required — abort if missing)
 *   - SEED_ADMIN_NAME     (default: Super Admin PPID)
 *
 * Safe to re-run: existing email is left untouched.
 */
async function main(): Promise<void> {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('[seed] DATABASE_URL is not set. Aborting.')
    process.exit(1)
  }

  const password = process.env.SEED_ADMIN_PASSWORD
  if (!password || password.length < 12) {
    console.error('[seed] SEED_ADMIN_PASSWORD is missing or shorter than 12 chars. Aborting.')
    process.exit(1)
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@baznas-cianjur.or.id'
  const name  = process.env.SEED_ADMIN_NAME  ?? 'Super Admin PPID'

  const client = postgres(url, { max: 1 })
  const db     = drizzle(client)

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing.length > 0) {
    console.log(`[seed] user "${email}" already exists — skipping.`)
    await client.end()
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  await db.insert(users).values({
    name,
    email,
    password: hashed,
    role:     'super_admin',
    isActive: true,
  })

  console.log(`[seed] created super_admin user "${email}".`)
  await client.end()
}

main().catch((err) => {
  console.error('[seed] failed:', err)
  process.exit(1)
})
