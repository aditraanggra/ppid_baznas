import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'
import { users } from '../schema/users'
import { permohonan } from '../schema/permohonan'
import { riwayatPermohonan } from '../schema/riwayat'
import { eq, isNull } from 'drizzle-orm'

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('[manage-users] DATABASE_URL is not set. Aborting.')
    process.exit(1)
  }

  const client = postgres(url, { max: 1 })
  const db = drizzle(client)

  const oldEmail = 'adigra88@gmail.com'

  const existing = await db.select().from(users).where(eq(users.email, oldEmail)).limit(1)
  if (existing.length > 0) {
    const oldUserId = existing[0].id

    await db.update(permohonan).set({ adminId: null }).where(eq(permohonan.adminId, oldUserId))
    console.log(`[manage-users] nullified adminId in permohonan for user "${oldEmail}".`)

    await db.update(riwayatPermohonan).set({ userId: null }).where(eq(riwayatPermohonan.userId, oldUserId))
    console.log(`[manage-users] nullified userId in riwayat_permohonan for user "${oldEmail}".`)

    await db.delete(users).where(eq(users.email, oldEmail))
    console.log(`[manage-users] deleted user "${oldEmail}".`)
  } else {
    console.log(`[manage-users] user "${oldEmail}" not found — skipping delete.`)
  }

  const newEmail = 'ppid@baznaskabcianjur.com'
  const newName = 'Admin PPID'
  const newPassword = 'Baznas@8421745'

  const newExisting = await db.select().from(users).where(eq(users.email, newEmail)).limit(1)
  if (newExisting.length > 0) {
    console.log(`[manage-users] user "${newEmail}" already exists — skipping create.`)
    await client.end()
    return
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await db.insert(users).values({
    name: newName,
    email: newEmail,
    password: hashed,
    role: 'super_admin',
    isActive: true,
  })

  console.log(`[manage-users] created super_admin user "${newEmail}" (${newName}).`)
  await client.end()
}

main().catch((err) => {
  console.error('[manage-users] failed:', err)
  process.exit(1)
})
