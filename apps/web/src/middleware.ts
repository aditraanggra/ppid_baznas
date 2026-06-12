import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Edge middleware for role-based route protection.
 *
 * Rules:
 *   - /admin/login          → always allowed (entry point)
 *   - /admin/pengguna/*     → super_admin only
 *   - /admin/*              → super_admin OR admin_ppid OR operator (any logged-in admin)
 *   - all other routes      → public
 *
 * Unauthenticated users hitting /admin/* are redirected to /admin/login
 * with a `?callbackUrl=` so they return to the original page after login.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl
  const session      = req.auth

  // Public routes: pass through immediately
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // Login page is always reachable
  if (pathname === '/admin/login') return NextResponse.next()

  // Require auth on every other /admin route
  if (!session?.user) {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Super-admin-only sub-tree
  if (pathname.startsWith('/admin/pengguna') && session.user.role !== 'super_admin') {
    return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
  }

  return NextResponse.next()
})

/**
 * Matcher: run middleware on /admin/* only, skip Next internals and static assets.
 */
export const config = {
  matcher: ['/admin/:path*'],
}
