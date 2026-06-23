import { router } from '../trpc'
import { permohonanRouter } from './permohonan'
import { pengaduanRouter } from './pengaduan'
import { adminRouter } from './admin'
import { statistikRouter } from './statistik'
import { penggunaRouter } from './pengguna'
import { laporanRouter } from './laporan'

export const appRouter = router({
  permohonan: permohonanRouter,
  pengaduan:  pengaduanRouter,
  admin:      adminRouter,
  statistik:  statistikRouter,
  pengguna:   penggunaRouter,
  laporan:    laporanRouter,
})

export type AppRouter = typeof appRouter
