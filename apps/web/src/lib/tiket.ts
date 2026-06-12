import { db, permohonan } from '@ppid/db'
import { like, count } from 'drizzle-orm'
import { format } from 'date-fns'

/**
 * Generate a unique nomor tiket in format: PPID-YYYYMM-XXXX
 * Example: PPID-202506-0001
 *
 * The sequence resets each month.
 */
export async function generateNomorTiket(): Promise<string> {
  const yearMonth = format(new Date(), 'yyyyMM')
  const prefix    = `PPID-${yearMonth}-`

  const [result] = await db
    .select({ total: count() })
    .from(permohonan)
    .where(like(permohonan.nomorTiket, `${prefix}%`))

  const sequence = (result?.total ?? 0) + 1
  return `${prefix}${String(sequence).padStart(4, '0')}`
}
