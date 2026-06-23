import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { generateNomorTiketPengaduan } from '@/lib/tiket'
import { db, pengaduan } from '@ppid/db'

const submitPengaduanSchema = z.object({
  nama:         z.string().min(3, 'Nama minimal 3 karakter').max(100),
  email:        z.string().email('Format email tidak valid'),
  nomorTelepon: z.string().max(15).optional(),
  kategori:     z.enum(['pelayanan', 'penyaluran_zis', 'keberatan', 'lainnya']),
  subjek:       z.string().min(5, 'Subjek minimal 5 karakter').max(200),
  isiPengaduan: z.string().min(10, 'Isi pengaduan minimal 10 karakter').max(5000),
  lampiran:     z.string().max(500).optional(),
})

export const pengaduanRouter = router({
  submit: publicProcedure
    .input(submitPengaduanSchema)
    .mutation(async ({ input }) => {
      const nomorTiket = await generateNomorTiketPengaduan()

      const createdRows = await db
        .insert(pengaduan)
        .values({ ...input, nomorTiket, status: 'pending' })
        .returning()

      const created = createdRows[0]
      if (!created) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal membuat pengaduan.',
        })
      }

      return { nomorTiket, id: created.id }
    }),
})
