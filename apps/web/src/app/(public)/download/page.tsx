import type { Metadata } from 'next'
import { getDokumenPublikList } from '@/lib/payload'
import { DownloadPageClient } from './download-page-client'

export const metadata: Metadata = {
  title: 'Download Center',
  description: 'Unduh dokumen dan laporan resmi BAZNAS Kabupaten Cianjur.',
}

export default async function DownloadPage() {
  const data = await getDokumenPublikList({ limit: 100 })

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
          Download Center
        </h1>
        <p className="text-muted-foreground">
          Unduh dokumen dan laporan resmi BAZNAS Kabupaten Cianjur
        </p>
      </div>
      <DownloadPageClient initialDocs={data.docs} />
    </div>
  )
}
