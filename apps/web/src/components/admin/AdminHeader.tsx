'use client'

import { useSession } from 'next-auth/react'
import { Shield } from 'lucide-react'
import { Badge } from '@ppid/ui'

/**
 * Maps role enum values to human-readable labels in Bahasa Indonesia.
 */
const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin_ppid:  'Admin PPID',
  operator:    'Operator',
}

/**
 * Top bar for the admin panel.
 * Displays the current user's name, role badge, and email.
 */
export function AdminHeader() {
  const { data: session } = useSession()
  const user = session?.user
  const roleLabel = user?.role ? ROLE_LABELS[user.role] ?? user.role : ''

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3 lg:ml-0 ml-10">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold font-heading text-foreground">
          Panel Administrasi
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <Badge variant="outline">{roleLabel}</Badge>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
