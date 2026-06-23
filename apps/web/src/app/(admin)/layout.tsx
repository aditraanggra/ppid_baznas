import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { SessionProvider } from '@/components/admin/SessionProvider'

export const metadata: Metadata = {
  title: {
    default: 'Panel Administrasi',
    template: '%s | Admin PPID BAZNAS',
  },
}

/**
 * Admin layout: sidebar + header shell.
 * Session context is provided so client components can call useSession().
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar />
        <div className="flex flex-1 flex-col lg:ml-64">
          <AdminHeader />
          <a
            href="#admin-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white"
          >
            Langsung ke konten admin
          </a>
          <main id="admin-content" className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
