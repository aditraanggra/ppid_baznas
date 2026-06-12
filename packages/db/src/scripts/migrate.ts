import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

/**
 * Apply all pending migrations from ./src/migrations to the database.
 * DATABASE_URL is loaded by `--env-file=../../.env.local` flag (Node 20+).
 */
async function main(): Promise<void> {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('[migrate] DATABASE_URL is not set. Aborting.')
    process.exit(1)
  }

  const client = postgres(url, { max: 1 })
  const db     = drizzle(client)

  console.log('[migrate] running migrations from ./src/migrations …')
  await migrate(db, { migrationsFolder: './src/migrations' })
  console.log('[migrate] done.')

  await client.end()
}

main().catch((err) => {
  console.error('[migrate] failed:', err)
  process.exit(1)
})
