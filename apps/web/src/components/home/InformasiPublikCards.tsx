'use client'

import Link from 'next/link'
import { Clock, Zap, Archive, ArrowRight } from 'lucide-react'

const cards = [
  {
    href: '/informasi-publik/berkala',
    accent: 'primary' as const,
    Icon: Clock,
    title: 'Informasi Berkala',
    desc: 'Informasi yang diumumkan secara rutin oleh BAZNAS',
    stat: 'diumumkan setiap tahun',
  },
  {
    href: '/informasi-publik/serta-merta',
    accent: 'warning' as const,
    Icon: Zap,
    title: 'Informasi Serta Merta',
    desc: 'Informasi yang harus diumumkan dalam waktu 24 jam',
    stat: 'diumumkan segera',
  },
  {
    href: '/informasi-publik/setiap-saat',
    accent: 'info' as const,
    Icon: Archive,
    title: 'Informasi Setiap Saat',
    desc: 'Informasi yang tersedia dan dapat diakses kapan saja',
    stat: 'tersedia setiap saat',
  },
] as const

const accentMap = {
  primary: {
    border: 'hover:border-primary',
    iconWrap:
      'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white',
    count: 'text-primary',
    bar: 'bg-primary/20',
  },
  warning: {
    border: 'hover:border-warning',
    iconWrap:
      'bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white',
    count: 'text-warning',
    bar: 'bg-warning/20',
  },
  info: {
    border: 'hover:border-info',
    iconWrap: 'bg-info/10 text-info group-hover:bg-info group-hover:text-white',
    count: 'text-info',
    bar: 'bg-info/20',
  },
}

interface InformasiPublikCardsProps {
  berkalaCount: number
  sertaMertaCount: number
  setiapSaatCount: number
}

export function InformasiPublikCards({
  berkalaCount,
  sertaMertaCount,
  setiapSaatCount,
}: InformasiPublikCardsProps) {
  const counts = [berkalaCount, sertaMertaCount, setiapSaatCount]
  const maxCount = Math.max(...counts, 1)

  return (
    <div className='grid gap-5 md:grid-cols-3'>
      {cards.map((card, i) => {
        const count = counts[i] ?? 0
        const styles = accentMap[card.accent]
        const progress = (count / maxCount) * 100

        return (
          <Link
            key={card.href}
            href={card.href}
            className={`group relative rounded-lg border border-border bg-card p-7 transition-all duration-200 ${styles.border} hover:shadow-sm`}
          >
            <div className='flex items-start justify-between'>
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${styles.iconWrap}`}
              >
                <card.Icon className='h-6 w-6' />
              </div>
              <ArrowRight className='mt-2 h-4 w-4 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-muted-foreground' />
            </div>

            <h3 className='mb-2 text-balance font-heading text-lg font-semibold text-foreground'>
              {card.title}
            </h3>
            <p className='mb-5 text-sm leading-relaxed text-muted-foreground'>
              {card.desc}
            </p>

            <div className='flex items-center gap-3'>
              <div className='flex-1'>
                <div className='mb-1 flex items-baseline gap-1.5'>
                  <span
                    className={`text-2xl font-bold tabular-nums ${styles.count}`}
                  >
                    {count}
                  </span>
                  <span className='text-xs text-muted-foreground'>dokumen</span>
                </div>
                <span className='text-xs text-muted-foreground/60'>
                  {card.stat}
                </span>
              </div>
            </div>

            <div className='mt-4 h-1 w-full overflow-hidden rounded-full bg-surface'>
              <div
                className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
