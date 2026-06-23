import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Download, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getDokumenPublikList } from '@/lib/payload'

const KATEGORI_LABELS: Record<string, string> = {
  laporan_keuangan: 'Laporan Keuangan',
  laporan_tahunan: 'Laporan Tahunan',
  penyaluran_zis: 'Penyaluran ZIS',
  profil: 'Profil & Maklumat',
  regulasi: 'Regulasi & Dasar Hukum',
  sop: 'SOP & Standar Layanan',
  lainnya: 'Lainnya',
}

const VALID_KATEGORI = Object.keys(KATEGORI_LABELS)

interface PageProps {
  params: { kategori: string }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const label = KATEGORI_LABELS[params.kategori] ?? 'Dokumen'
  return {
    title: `${label} - Download`,
    description: `Unduh dokumen ${label} BAZNAS Kabupaten Cianjur.`,
  }
}

export default async function DownloadKategoriPage({ params }: PageProps) {
  if (!VALID_KATEGORI.includes(params.kategori)) {
    notFound()
  }

  const data = await getDokumenPublikList({
    kategori: params.kategori as 'laporan_keuangan',
    limit: 100,
  })

  const label = KATEGORI_LABELS[params.kategori] ?? ''

  return (
    <div className='container mx-auto max-w-7xl px-4 py-12'>
      <Link
        href='/download'
        className='mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary'
      >
        <ArrowLeft className='h-4 w-4' />
        Kembali ke Download Center
      </Link>

      <div className='mb-8'>
        <h1 className='mb-2 font-heading text-4xl font-bold text-foreground'>
          {label}
        </h1>
        <p className='text-muted-foreground'>
          Dokumen kategori {label.toLowerCase()} BAZNAS Kabupaten Cianjur
        </p>
      </div>

      {data.docs.length === 0 ? (
        <div className='rounded-lg border border-border bg-card p-12 text-center'>
          <FileText className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
          <p className='text-muted-foreground'>
            Belum ada dokumen pada kategori ini.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {data.docs.map((doc) => (
            <div
              key={doc.id}
              className='flex flex-col rounded-lg border border-border bg-card p-5'
            >
              <div className='mb-3 flex items-start gap-3'>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                  <FileText className='h-5 w-5' />
                </div>
                <span className='text-xs text-muted-foreground'>
                  {doc.tahun}
                </span>
              </div>
              <h3 className='mb-2 flex-1 font-semibold text-foreground'>
                {doc.judul}
              </h3>
              {doc.deskripsi && (
                <p className='mb-4 text-sm text-muted-foreground line-clamp-2'>
                  {doc.deskripsi}
                </p>
              )}
              <a
                href={doc.url}
                target='_blank'
                rel='noopener noreferrer'
                download
                aria-label={`Unduh ${doc.judul}`}
                className='mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark'
              >
                <Download className='h-4 w-4' />
                Unduh
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
