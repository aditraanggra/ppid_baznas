import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import { getPengumumanBySlug } from '@/lib/payload'
import { renderLexical } from '@/lib/lexical'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getPengumumanBySlug(params.slug)
  if (!item) return { title: 'Pengumuman Tidak Ditemukan' }
  return {
    title: item.judul,
    description: item.ringkasan ?? item.judul,
  }
}

export default async function PengumumanDetailPage({ params }: PageProps) {
  const item = await getPengumumanBySlug(params.slug)
  if (!item) notFound()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/pengumuman"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Pengumuman
      </Link>

      <article>
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={item.tanggalTerbit}>
              {new Date(item.tanggalTerbit).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground">
            {item.judul}
          </h1>
          {item.ringkasan && (
            <p className="text-lg text-muted-foreground">{item.ringkasan}</p>
          )}
        </header>

        {item.gambarSampul?.url && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={item.gambarSampul.url}
              alt={item.gambarSampul.alt ?? item.judul}
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="prose max-w-none text-foreground">
          {item.konten
            ? renderLexical(item.konten)
            : <p className="text-muted-foreground">Konten tidak tersedia.</p>
          }
        </div>
      </article>
    </div>
  )
}
