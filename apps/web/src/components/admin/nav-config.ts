import {
  LayoutDashboard,
  FileText,
  FileBarChart,
  Users,
  MessageSquareWarning,
  type LucideIcon,
} from 'lucide-react'

import type { UserRole } from '@ppid/db'

export interface AdminNavItem {
  href: string
  label: string
  icon: LucideIcon
  roles?: ReadonlyArray<UserRole>
}

/**
 * Primary admin navigation items.
 * If `roles` is omitted, the item is visible to every admin role.
 */
export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/permohonan', label: 'Permohonan', icon: FileText        },
  { href: '/admin/pengaduan',  label: 'Pengaduan',  icon: MessageSquareWarning },
  { href: '/admin/laporan',    label: 'Laporan',    icon: FileBarChart    },
  { href: '/admin/pengguna',   label: 'Pengguna',   icon: Users, roles: ['super_admin'] },
]

/**
 * Filter nav items based on the current user's role.
 */
export function filterNavByRole(role: UserRole): ReadonlyArray<AdminNavItem> {
  return ADMIN_NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role))
}
