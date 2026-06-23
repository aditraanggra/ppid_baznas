import { createCallerFactory, type Context } from './trpc'
import { appRouter } from './routers/_app'
import { db } from '@ppid/db'

const createCaller = createCallerFactory(appRouter)

/**
 * Server-side tRPC caller for use in Server Components (Next.js App Router).
 *
 * IMPORTANT: This bypasses HTTP auth, so it should only be used for PUBLIC
 * procedures that do NOT depend on `ctx.session`. For protected/admin
 * procedures, use the HTTP API via trpc React hooks instead.
 *
 * Context provided: db = Drizzle client (no session — public context).
 */
export async function serverCaller() {
  const ctx: Context = {
    db,
    session: null,
  }
  return createCaller(ctx)
}
