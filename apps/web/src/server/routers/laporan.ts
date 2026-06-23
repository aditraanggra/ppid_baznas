import { router, adminProcedure } from '../trpc'
import { z } from 'zod'
import { and, desc, gte, lte, eq, sql } from 'drizzle-orm'
import { db, permohonan } from '@ppid/db'

/**
 * Reporting endpoints for the admin laporan page.
 */
export const laporanRouter = router({
  /**
   * Aggregated counts by status within a date range.
   * Used to generate PDF/Excel reports.
   */
  ringkasan: adminProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to:   z.coerce.date(),
      }),
    )
    .query(async ({ input }) => {
      const where = and(
        gte(permohonan.createdAt, input.from),
        lte(permohonan.createdAt, input.to),
      )

      const byStatus = await db
        .select({
          status: permohonan.status,
          total:  sql<number>`count(*)::int`,
        })
        .from(permohonan)
        .where(where)
        .groupBy(permohonan.status)

      const byKategori = await db
        .select({
          kategori: permohonan.kategoriInformasi,
          total:    sql<number>`count(*)::int`,
        })
        .from(permohonan)
        .where(where)
        .groupBy(permohonan.kategoriInformasi)

      const totalRow = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(permohonan)
        .where(where)

      return {
        total:      totalRow[0]?.total ?? 0,
        byStatus,
        byKategori,
        periodeFrom: input.from,
        periodeTo:   input.to,
      }
    }),

  /**
   * Raw rows of permohonan in date range — used by the Excel exporter.
   */
  detail: adminProcedure
    .input(
      z.object({
        from:   z.coerce.date(),
        to:     z.coerce.date(),
        status: z.enum([
          'pending', 'diterima', 'klarifikasi', 'diproses',
          'selesai', 'ditolak', 'perpanjangan', 'keberatan',
        ]).optional(),
      }),
    )
    .query(async ({ input }) => {
      const where = and(
        gte(permohonan.createdAt, input.from),
        lte(permohonan.createdAt, input.to),
        input.status ? eq(permohonan.status, input.status) : undefined,
      )

      const rows = await db
        .select({
          nomorTiket:        permohonan.nomorTiket,
          namaPemohon:       permohonan.namaPemohon,
          email:             permohonan.email,
          kategoriInformasi: permohonan.kategoriInformasi,
          rincianInformasi:  permohonan.rincianInformasi,
          status:            permohonan.status,
          createdAt:         permohonan.createdAt,
          tanggalDiterima:   permohonan.tanggalDiterima,
          tanggalDeadline:   permohonan.tanggalDeadline,
          tanggalSelesai:    permohonan.tanggalSelesai,
        })
        .from(permohonan)
        .where(where)
        .orderBy(desc(permohonan.createdAt))

      return rows
    }),
})
