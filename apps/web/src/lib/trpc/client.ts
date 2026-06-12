'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/routers/_app'

/**
 * Strongly-typed tRPC React hooks.
 * Usage: `const { data } = trpc.statistik.ringkasan.useQuery({})`
 */
export const trpc = createTRPCReact<AppRouter>()
