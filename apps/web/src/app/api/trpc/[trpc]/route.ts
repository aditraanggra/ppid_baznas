import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/trpc'

/**
 * Single entry point for all tRPC procedures.
 * Mounted at /api/trpc/* — handles both queries (GET) and mutations (POST).
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint:      '/api/trpc',
    req,
    router:        appRouter,
    createContext: createTRPCContext,
    onError({ error, path }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error(`[tRPC] ${path ?? '<no-path>'}:`, error)
      }
    },
  })

export { handler as GET, handler as POST }
