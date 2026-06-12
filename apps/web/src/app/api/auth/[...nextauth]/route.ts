import { handlers } from '@/lib/auth'

/**
 * NextAuth v5 route handler.
 * Mounted at /api/auth/* — handles sign-in, sign-out, session, callbacks, etc.
 */
export const { GET, POST } = handlers
