import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db, users, type UserRole } from '@ppid/db'

/**
 * Module augmentation so `session.user.role` and `session.user.id`
 * are strictly typed across the codebase.
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id:   string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id:   string
    role: UserRole
  }
}

/** Zod schema for the login form input. User-facing messages in Bahasa Indonesia. */
const credentialsSchema = z.object({
  email:    z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

/**
 * NextAuth v5 configuration.
 *
 * Auth strategy: JWT (stateless) — admin dashboard is small and we want zero
 * round-trips to the DB on every request. The DB is only hit at sign-in time.
 *
 * Exports:
 *   - `auth`     → call inside Server Components / middleware to get the session
 *   - `signIn`   → server action for login
 *   - `signOut`  → server action for logout
 *   - `handlers` → mount in app/api/auth/[...nextauth]/route.ts
 */
export const { auth, signIn, signOut, handlers } = NextAuth({
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 /* 8h */ },
  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (!user || !user.isActive) return null

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null

        // Return only what the JWT needs — never expose password hash
        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id as string
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.id
        session.user.role = token.role
      }
      return session
    },
    authorized({ auth: authData, request }) {
      const { pathname } = request.nextUrl
      // Public routes are always allowed; middleware does fine-grained checks.
      if (!pathname.startsWith('/admin')) return true
      if (pathname === '/admin/login')    return true
      return !!authData?.user
    },
  },
  trustHost: true,
})
