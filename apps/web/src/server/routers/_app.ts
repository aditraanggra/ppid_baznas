import { router } from '../trpc'
import { permohonanRouter } from './permohonan'
import { adminRouter } from './admin'
import { statistikRouter } from './statistik'

export const appRouter = router({
  permohonan: permohonanRouter,
  admin:      adminRouter,
  statistik:  statistikRouter,
})

export type AppRouter = typeof appRouter
