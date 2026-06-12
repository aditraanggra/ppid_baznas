import { initTRPC, TRPCError } from '@trpc/server'
import { auth } from '@/lib/auth'
import { db } from '@ppid/db'
import superjson from 'superjson'
import { ZodError } from 'zod'

/** tRPC context — available in every procedure */
export async function createTRPCContext() {
  const session = await auth()
  return { db, session }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const router      = t.router
export const publicProcedure = t.procedure

/** Protected: must be logged in */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' })
  }
  return next({ ctx: { ...ctx, session: ctx.session } })
})

/** Admin only: role must be admin_ppid or super_admin */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.session.user.role
  if (role !== 'admin_ppid' && role !== 'super_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Akses ditolak.' })
  }
  return next({ ctx })
})

/** Super admin only */
export const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'super_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Akses ditolak.' })
  }
  return next({ ctx })
})
