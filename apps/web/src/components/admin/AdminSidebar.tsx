'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, Menu, X } from 'lucide-react'
import { cn } from '@ppid/ui'
import { Button } from '@ppid/ui'
import { useState } from 'react'
import { filterNavByRole } from './nav-config'

/**
 * Collapsible sidebar for the admin panel.
 * Shows navigation items filtered by the current user's role.
 * Collapses on mobile via a toggle button.
 */
export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role ?? 'operator'
  const navItems = filterNavByRole(role)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-[50] inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-border bg-background p-2 text-foreground shadow-sm lg:hidden"
        aria-label="Buka menu navigasi"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[40] bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[50] w-64 border-r border-border bg-background transition-transform duration-200',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-heading font-bold text-primary"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <span className="text-sm font-bold">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs leading-tight">PPID BAZNAS</span>
                <span className="text-[10px] font-normal text-muted-foreground">Admin Panel</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
              aria-label="Tutup menu navigasi"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-light text-primary-dark'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-3">
            <div className="mb-2 px-3">
              <p className="truncate text-sm font-medium text-foreground">
                {session?.user?.name ?? 'Admin'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session?.user?.email ?? ''}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
