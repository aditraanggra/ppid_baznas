import { router, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db, permohonan, riwayatPermohonan, type StatusPermohonan } from '@ppid/db'
import { calculateDeadline, calculatePerpanjangan } from '@/lib/sla'

const statusEnum = z.enum([
  'pending',
  'diterima',
  'klarifikasi',
  'diproses',
  'selesai',
  'ditolak',
  'perpanjangan',
  'keberatan',
])

const listInputSchema = z.object({
  page:     z.number().int().min(1).default(1),
  pageSize: z.number().int().min(5).max(100).default(20),
  status:   statusEnum.optional(),
  search:   z.string().trim().max(100).optional(),
})

const updateStatusSchema = z.object({
  id:          z.string().uuid(),
  toStatus:    statusEnum,
  catatan:     z.string().max(1000).optional(),
  alasanTolak: z.string().max(1000).optional(),
})

/**
 * Admin-only operations on permohonan.
 * All procedures require role: admin_ppid OR super_admin.
 *
 * NOTE: full per-detail and laporan procedures will be added in Phase 3
 * (TASK-025, TASK-026, TASK-028). This file currently covers list + status
 * transitions which are the minimum needed to make the dashboard usable.
 */
export const adminRouter = router({
  /**
   * Paginated, filterable list of permohonan.
   * Search matches nomorTiket OR namaPemohon (case-insensitive).
   */
  listPermohonan: adminProcedure
    .input(listInputSchema)
    .query(async ({ input }) => {
      const { page, pageSize, status, search } = input

      const where = and(
        status ? eq(permohonan.status, status) : undefined,
        search
          ? or(
              ilike(permohonan.nomorTiket,  `%${search}%`),
              ilike(permohonan.namaPemohon, `%${search}%`),
            )
          : undefined,
      )

      const [{ total }] = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(permohonan)
        .where(where)

      const rows = await db
        .select()
        .from(permohonan)
        .where(where)
        .orderBy(desc(permohonan.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      return {
        rows,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
        },
      }
    }),

  /**
   * Detail view: a single permohonan + full timeline.
   */
  getPermohonan: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [row] = await db
        .select()
        .from(permohonan)
        .where(eq(permohonan.id, input.id))
        .limit(1)

      if (!row) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Permohonan tidak ditemukan.' })
      }

      const timeline = await db
        .select()
        .from(riwayatPermohonan)
        .where(eq(riwayatPermohonan.permohonanId, row.id))
        .orderBy(desc(riwayatPermohonan.createdAt))

      return { ...row, timeline }
    }),

  /**
   * Transition a permohonan to a new status and write an audit-log row.
   * Side effects (SLA dates):
   *   - pending  -> diterima      : sets tanggalDiterima = now, tanggalDeadline = +10 working days
   *   - *        -> perpanjangan  : extends tanggalDeadline by +7 working days, sets tanggalPerpanjangan = now
   *   - *        -> selesai/ditolak: sets tanggalSelesai = now
   */
  updateStatus: adminProcedure
    .input(updateStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const [current] = await db
        .select()
        .from(permohonan)
        .where(eq(permohonan.id, input.id))
        .limit(1)

      if (!current) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Permohonan tidak ditemukan.' })
      }

      const now = new Date()
      const patch: Partial<typeof permohonan.$inferInsert> = {
        status:       input.toStatus as StatusPermohonan,
        catatanAdmin: input.catatan ?? current.catatanAdmin,
        updatedAt:    now,
        adminId:      ctx.session.user.id,
      }

      if (current.status === 'pending' && input.toStatus === 'diterima') {
        patch.tanggalDiterima = now
        patch.tanggalDeadline = calculateDeadline(now)
      }

      if (input.toStatus === 'perpanjangan' && current.tanggalDeadline) {
        patch.tanggalPerpanjangan = now
        patch.tanggalDeadline     = calculatePerpanjangan(current.tanggalDeadline)
      }

      if (input.toStatus === 'selesai' || input.toStatus === 'ditolak') {
        patch.tanggalSelesai = now
      }

      const [updated] = await db
        .update(permohonan)
        .set(patch)
        .where(eq(permohonan.id, input.id))
        .returning()

      await db.insert(riwayatPermohonan).values({
        permohonanId: updated.id,
        statusDari:   current.status,
        statusKe:     input.toStatus as StatusPermohonan,
        catatan:      input.catatan ?? input.alasanTolak ?? null,
        userId:       ctx.session.user.id,
      })

      return updated
    }),
})
