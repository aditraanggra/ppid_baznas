'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { cn } from '@ppid/ui'

const navLinks = [
  { href: '/profil', label: 'Profil' },
  { href: '/permohonan', label: 'Permohonan' },
  { href: '/download', label: 'Download' },
  { href: '/statistik', label: 'Statistik' },
  { href: '/pengumuman', label: 'Pengumuman' },
  { href: '/faq', label: 'FAQ' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-[20] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 font-heading font-bold text-primary">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="text-lg">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">PPID BAZNAS</span>
            <span className="text-xs font-normal text-muted-foreground">Kabupaten Cianjur</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/admin"
          className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark lg:flex"
        >
          <LayoutDashboard className="h-4 w-4" />
          Portal Admin
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <LayoutDashboard className="h-4 w-4" />
              Portal Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
