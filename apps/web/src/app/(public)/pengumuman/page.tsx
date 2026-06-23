import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getPengumumanList } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Pengumuman',
  description: 'Pengumuman resmi PPID BAZNAS Kabupaten Cianjur.',
}

export default async function PengumumanPage() {
  const { docs } = await getPengumumanList({ limit: 20 })

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">Pengumuman</h1>
        <p className="text-muted-foreground">
          Pengumuman resmi dari PPID BAZNAS Kabupaten Cianjur
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Belum ada pengumuman.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {docs.map((item) => (
            <Link
              key={item.id}
              href={`/pengumuman/${item.slug}`}
              className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary-light text-primary">
                  <span className="text-xs font-medium">
                    {new Date(item.tanggalTerbit).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold">
                    {new Date(item.tanggalTerbit).getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                    {item.judul}
                  </h2>
                  {item.ringkasan && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {item.ringkasan}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(item.tanggalTerbit).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                      Baca selengkapnya
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
