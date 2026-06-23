import Link from 'next/link'
import {
  Mail,
  MapPin,
  Phone,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Facebook,
} from 'lucide-react'
import { getSiteSettings } from '@/lib/payload'

export async function Footer() {
  const settings = await getSiteSettings()

  const socialLinks = {
    instagram:
      settings?.sosialMedia?.instagram || 'https://instagram.com/baznascianjur',
    facebook:
      settings?.sosialMedia?.facebook || 'https://facebook.com/baznascianjur',
    youtube:
      settings?.sosialMedia?.youtube || 'https://youtube.com/@baznascianjur',
    tiktok:
      settings?.sosialMedia?.tiktok || 'https://tiktok.com/@baznascianjur',
    x: settings?.sosialMedia?.x || 'https://x.com/baznascianjur',
    website:
      settings?.sosialMedia?.website || 'https://kabcianjur.baznas.go.id',
  }

  return (
    <footer className='border-t border-border bg-surface'>
      <div className='container mx-auto max-w-7xl px-4 py-12'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <div className='flex items-center gap-3 font-heading font-bold text-primary'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white'>
                <span className='text-lg'>P</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm'>PPID BAZNAS</span>
                <span className='text-xs font-normal text-muted-foreground'>
                  Kabupaten Cianjur
                </span>
              </div>
            </div>
            <p className='text-sm text-muted-foreground'>
              Pejabat Pengelola Informasi dan Dokumentasi BAZNAS Kabupaten
              Cianjur
            </p>
            <div className='flex items-center gap-3'>
              <Link
                href={socialLinks.x}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='X (Twitter)'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white'
              >
                <Twitter className='h-4 w-4' />
              </Link>
              <Link
                href={socialLinks.instagram}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white'
              >
                <Instagram className='h-4 w-4' />
              </Link>
              <Link
                href={socialLinks.youtube}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='YouTube'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white'
              >
                <Youtube className='h-4 w-4' />
              </Link>
              <Link
                href={socialLinks.tiktok}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='TikTok'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white'
              >
                <svg
                  className='h-4 w-4'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z' />
                </svg>
              </Link>
              <Link
                href={socialLinks.website}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Website'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white'
              >
                <Globe className='h-4 w-4' />
              </Link>
              <Link
                href={socialLinks.facebook}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white'
              >
                <Facebook className='h-4 w-4' />
              </Link>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-heading text-sm font-semibold text-foreground'>
              Tautan
            </h3>
            <nav className='flex flex-col gap-2'>
              <Link
                href='/profil'
                className='text-sm text-muted-foreground transition-colors hover:text-primary'
              >
                Profil PPID
              </Link>
              <Link
                href='/informasi-publik'
                className='text-sm text-muted-foreground transition-colors hover:text-primary'
              >
                Informasi publik
              </Link>
              <Link
                href='/permohonan'
                className='text-sm text-muted-foreground transition-colors hover:text-primary'
              >
                Ajukan permohonan
              </Link>
              <Link
                href='/download'
                className='text-sm text-muted-foreground transition-colors hover:text-primary'
              >
                Download center
              </Link>
            </nav>
          </div>

          <div className='space-y-4'>
            <h3 className='font-heading text-sm font-semibold text-foreground'>
              Informasi
            </h3>
            <nav className='flex flex-col gap-2'>
              <Link
                href='/statistik'
                className='text-sm text-muted-foreground transition-colors hover:text-primary'
              >
                Statistik
              </Link>
              <Link
                href='/pengumuman'
                className='text-sm text-muted-foreground transition-colors hover:text-primary'
              >
                Pengumuman
              </Link>
              <Link
                href='/faq'
                className='text-sm text-muted-foreground transition-colors hover:text-primary'
              >
                FAQ
              </Link>
            </nav>
          </div>

          <div className='space-y-4'>
            <h3 className='font-heading font-semibold text-foreground'>
              Kontak
            </h3>
            <div className='space-y-3 text-sm text-muted-foreground'>
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 flex-shrink-0 text-primary' />
                <span>Jl.Raya Bandung No.108B, Cianjur, Jawa Barat 43281</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 flex-shrink-0 text-primary' />
                <span>(0263) 264-847</span>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='h-4 w-4 flex-shrink-0 text-primary' />
                <span>baznaskab.cianjur@baznas.go.id</span>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground'>
          <p>
            &copy; {new Date().getFullYear()} PPID BAZNAS Kabupaten Cianjur. Hak
            cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  )
}
