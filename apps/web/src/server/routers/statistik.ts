import { router, publicProcedure } from '../trpc'
import { z } from 'zod'
import { and, gte, lte, sql } from 'drizzle-orm'
import { db, permohonan } from '@ppid/db'

const rangeSchema = z.object({
  from: z.coerce.date().optional(),
  to:   z.coerce.date().optional(),
})

/**
 * Public statistics for the /statistik page and the admin dashboard.
 * No auth required — only aggregate counts are exposed (no PII).
 */
export const statistikRouter = router({
  /**
   * High-level totals: by status (for the dashboard pie/bar chart)
   * and a single "total" count for the headline KPI.
   */
  ringkasan: publicProcedure
    .input(rangeSchema)
    .query(async ({ input }) => {
      const where = and(
        input.from ? gte(permohonan.createdAt, input.from) : undefined,
        input.to   ? lte(permohonan.createdAt, input.to)   : undefined,
      )

      const byStatus = await db
        .select({
          status: permohonan.status,
          total:  sql<number>`count(*)::int`,
        })
        .from(permohonan)
        .where(where)
        .groupBy(permohonan.status)

      const total = byStatus.reduce((acc, r) => acc + r.total, 0)
      return { total, byStatus }
    }),

  /**
   * Monthly trend for the last 12 months.
   * Returns an array of { month: 'YYYY-MM', total: number } in chronological order.
   */
  trenBulanan: publicProcedure
    .query(async () => {
      const rows = await db.execute<{ month: string; total: number }>(sql`
        SELECT
          to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
          count(*)::int                                       AS total
        FROM permohonan
        WHERE created_at >= (now() - interval '12 months')
        GROUP BY 1
        ORDER BY 1 ASC
      `)
      return rows as unknown as Array<{ month: string; total: number }>
    }),

  /**
   * Breakdown by kategori informasi (berkala / serta_merta / setiap_saat).
   */
  perKategori: publicProcedure
    .query(async () => {
      const rows = await db
        .select({
          kategori: permohonan.kategoriInformasi,
          total:    sql<number>`count(*)::int`,
        })
        .from(permohonan)
        .groupBy(permohonan.kategoriInformasi)
      return rows
    }),
})
