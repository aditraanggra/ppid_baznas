import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Download, FileText, Calendar } from 'lucide-react'
import { getDokumenPublikList } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Informasi Berkala',
  description: 'Daftar informasi berkala BAZNAS Kabupaten Cianjur.',
}

export default async function BerkalaPage() {
  const data = await getDokumenPublikList({
    kategoriInformasi: 'berkala',
    limit: 100,
  })

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className='container mx-auto max-w-7xl px-4 py-12'>
      <nav className='mb-6 flex items-center gap-2 text-sm'>
        <Link href='/informasi-publik' className='text-muted-foreground transition-colors hover:text-primary'>
          Informasi Publik
        </Link>
        <span className='text-muted-foreground/50'>/</span>
        <span className='font-medium text-foreground'>Berkala</span>
      </nav>

      <div className='mb-8 flex items-center gap-5'>
        <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary'>
          <Clock className='h-8 w-8' />
        </div>
        <div>
          <h1 className='font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl'>
            Informasi Berkala
          </h1>
          <p className='mt-1 text-muted-foreground'>
            Informasi yang wajib diumumkan secara berkala oleh BAZNAS
          </p>
        </div>
      </div>

      <section className='mb-8 rounded-lg border border-border bg-card p-6'>
        <h2 className='mb-3 font-heading text-lg font-semibold text-foreground'>
          Apa itu Informasi Berkala?
        </h2>
        <p className='text-muted-foreground leading-relaxed'>
          Informasi Berkala adalah informasi yang wajib tersedia dan diumumkan
          secara berkala kepada publik. BAZNAS Kabupaten Cianjur mengungkapkan
          informasi ini secara rutin sesuai dengan ketentuan Undang-Undang No.
          14 Tahun 2008 tentang Keterbukaan Informasi Publik.
        </p>
      </section>

      {data.docs.length === 0 ? (
        <div className='rounded-lg border border-border bg-card p-16 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface'>
            <FileText className='h-8 w-8 text-muted-foreground' />
          </div>
          <h3 className='mb-2 font-heading text-lg font-semibold text-foreground'>
            Belum ada dokumen
          </h3>
          <p className='text-sm text-muted-foreground'>
            Belum ada dokumen informasi berkala yang tersedia.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2'>
          {data.docs.map((doc) => (
            <div
              key={doc.id}
              className='group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-primary hover:shadow-md'
            >
              <div className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105'>
                <FileText className='h-5 w-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='mb-1.5 font-semibold text-foreground line-clamp-2'>
                  {doc.judul}
                </h4>
                {doc.deskripsi && (
                  <p className='mb-3 text-sm text-muted-foreground line-clamp-2'>
                    {doc.deskripsi}
                  </p>
                )}
                <div className='flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
                  <span className='inline-flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    {doc.tahun}
                  </span>
                  {doc.filesize && (
                    <span className='text-muted-foreground/70'>
                      {formatFileSize(doc.filesize)}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={doc.url}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Unduh ${doc.judul}`}
                className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:scale-105'
              >
                <Download className='h-4 w-4' />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
