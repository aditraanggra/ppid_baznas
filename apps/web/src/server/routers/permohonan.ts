import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { eq, asc } from 'drizzle-orm'
import { generateNomorTiket } from '@/lib/tiket'
import { sendEmailKonfirmasi } from '@ppid/email'
import { db, permohonan, riwayatPermohonan } from '@ppid/db'

/** Input schema for submitting a new permohonan */
export const submitPermohonanSchema = z.object({
  namaPemohon:       z.string().min(3, 'Nama minimal 3 karakter').max(100),
  email:             z.string().email('Format email tidak valid'),
  nomorIdentitas:    z.string().length(16, 'NIK harus 16 digit').regex(/^\d+$/, 'NIK hanya boleh angka'),
  alamat:            z.string().min(10, 'Alamat terlalu singkat').max(500),
  nomorTelepon:      z.string().max(15).optional(),
  tujuanPermohonan:  z.string().min(10).max(1000),
  rincianInformasi:  z.string().min(10).max(2000),
  kategoriInformasi: z.enum(['berkala', 'serta_merta', 'setiap_saat']),
  caraMendapatkan:   z.enum(['email', 'langsung', 'pos']).default('email'),
  /** MinIO object key — uploaded separately via /api/upload */
  lampiranIdentitas: z.string().max(500).optional(),
})

const cekStatusSchema = z.object({
  nomorTiket: z.string().regex(/^PPID-\d{6}-\d{4}$/, 'Format nomor tiket tidak valid'),
  email:      z.string().email(),
})

export const permohonanRouter = router({
  /**
   * Submit a new information request.
   * Public endpoint — no auth required.
   * Rate limited at the Nginx layer: 3 requests/hour per IP.
   */
  submit: publicProcedure
    .input(submitPermohonanSchema)
    .mutation(async ({ input }) => {
      const nomorTiket = await generateNomorTiket()

      const createdRows = await db
        .insert(permohonan)
        .values({ ...input, nomorTiket, status: 'pending' })
        .returning()

      const created = createdRows[0]
      if (!created) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Gagal membuat permohonan.' })
      }

      // Initial audit-log entry — null -> pending
      await db.insert(riwayatPermohonan).values({
        permohonanId: created.id,
        statusDari:   null,
        statusKe:     'pending',
        catatan:      'Permohonan dibuat oleh pemohon.',
        userId:       null,
      })

      // Fire-and-forget confirmation email
      sendEmailKonfirmasi({
        to:          input.email,
        namaPemohon: input.namaPemohon,
        nomorTiket,
      }).catch((err) => console.error('[email] konfirmasi gagal:', err))

      return { nomorTiket, id: created.id }
    }),

  /**
   * Public tracking endpoint.
   * Requires nomor tiket + email match (lightweight access control without auth).
   * Returns: status, key dates, and the timeline (riwayat).
   */
  cekStatus: publicProcedure
    .input(cekStatusSchema)
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id:                  permohonan.id,
          nomorTiket:          permohonan.nomorTiket,
          namaPemohon:         permohonan.namaPemohon,
          status:              permohonan.status,
          kategoriInformasi:   permohonan.kategoriInformasi,
          rincianInformasi:    permohonan.rincianInformasi,
          tanggalDiterima:     permohonan.tanggalDiterima,
          tanggalDeadline:     permohonan.tanggalDeadline,
          tanggalPerpanjangan: permohonan.tanggalPerpanjangan,
          tanggalSelesai:      permohonan.tanggalSelesai,
          createdAt:           permohonan.createdAt,
          // Email is used as a soft-auth check — do not return it.
          emailHash:           permohonan.email,
        })
        .from(permohonan)
        .where(eq(permohonan.nomorTiket, input.nomorTiket))
        .limit(1)

      const row = rows[0]

      // Use generic message so we do not leak whether the ticket exists.
      if (!row || row.emailHash.toLowerCase() !== input.email.toLowerCase()) {
        throw new TRPCError({
          code:    'NOT_FOUND',
          message: 'Permohonan tidak ditemukan. Periksa kembali nomor tiket dan email Anda.',
        })
      }

      const timeline = await db
        .select({
          statusDari: riwayatPermohonan.statusDari,
          statusKe:   riwayatPermohonan.statusKe,
          catatan:    riwayatPermohonan.catatan,
          createdAt:  riwayatPermohonan.createdAt,
        })
        .from(riwayatPermohonan)
        .where(eq(riwayatPermohonan.permohonanId, row.id))
        .orderBy(asc(riwayatPermohonan.createdAt))

      // Strip the internal email field before returning to the client
      const { emailHash: _drop, ...publicRow } = row
      return { ...publicRow, timeline }
    }),
})
