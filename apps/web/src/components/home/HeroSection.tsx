'use client'

import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { Counter } from './Counter'

interface HeroSectionProps {
  totalPermohonan: number
  totalSelesai: number
  persentase: number
}

export function HeroSection({
  totalPermohonan,
  totalSelesai,
  persentase,
}: HeroSectionProps) {
  return (
    <section className='relative overflow-hidden bg-background'>
      <div className='absolute inset-0 bg-gradient-to-b from-primary-light/40 via-primary-light/10 to-transparent' />

      <div className='container relative mx-auto max-w-7xl px-4 pb-16 pt-20 md:pb-24 md:pt-28'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='animate-fade-in-up mb-5 text-sm font-medium tracking-wide text-primary'>
            Portal Layanan Informasi Publik BAZNAS Kabupaten Cianjur
          </p>

          <h1 className='animate-fade-in-up-delay-1 mb-6 text-balance font-heading text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-foreground md:text-5xl lg:text-6xl'>
            Informasi Publik yang Transparan dan Akuntabel
          </h1>

          <p className='animate-fade-in-up-delay-2 mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Ajukan permohonan informasi, akses dokumen publik, dan pantau
            status permohonan Anda. Kami berkomitmen menghadirkan layanan
            yang mudah diakses oleh seluruh lapisan masyarakat.
          </p>

          <div className='animate-fade-in-up-delay-3 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4'>
            <Link
              href='/permohonan'
              className='group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98] sm:w-auto'
            >
              Ajukan Permohonan
              <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
            <Link
              href='/permohonan/tracking'
              className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-8 text-base font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary-light/50 sm:w-auto'
            >
              <Search className='h-4 w-4 text-muted-foreground' />
              Lacak Permohonan
            </Link>
          </div>
        </div>

        <div className='animate-fade-in-up-delay-3 mx-auto mt-16 max-w-2xl'>
          <div className='grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-background shadow-sm'>
            <Counter value={totalPermohonan} label='Permohonan Masuk' />
            <Counter value={totalSelesai} label='Permohonan Selesai' />
            <Counter value={persentase} label='Tingkat Penyelesaian' suffix='%' />
          </div>
        </div>
      </div>
    </section>
  )
}
