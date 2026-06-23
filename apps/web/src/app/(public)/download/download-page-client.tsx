'use client'

import { useState } from 'react'
import { Download, FileText, Search, FileSpreadsheet, File } from 'lucide-react'
import type { DokumenPublikDoc } from '@/lib/payload'

const KATEGORI_LABELS: Record<DokumenPublikDoc['kategori'], string> = {
  laporan_keuangan: 'Laporan Keuangan',
  laporan_tahunan: 'Laporan Tahunan',
  penyaluran_zis: 'Penyaluran ZIS',
  profil: 'Profil & Maklumat',
  regulasi: 'Regulasi & Dasar Hukum',
  sop: 'SOP & Standar Layanan',
  lainnya: 'Lainnya',
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.includes('pdf')) return <FileText className="h-5 w-5" />
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
    return <FileSpreadsheet className="h-5 w-5" />
  return <File className="h-5 w-5" />
}

function formatFileSize(bytes: number): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface Props {
  initialDocs: DokumenPublikDoc[]
}

export function DownloadPageClient({ initialDocs }: Props) {
  const [search, setSearch] = useState('')
  const [selectedKategori, setSelectedKategori] = useState<string>('semua')

  const filtered = initialDocs.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.judul.toLowerCase().includes(search.toLowerCase()) ||
      (doc.deskripsi ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesKategori =
      selectedKategori === 'semua' || doc.kategori === selectedKategori
    return matchesSearch && matchesKategori
  })

  const kategoris = Array.from(new Set(initialDocs.map((d) => d.kategori)))

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedKategori('semua')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedKategori === 'semua'
                ? 'bg-primary text-white'
                : 'border border-border text-foreground hover:border-primary'
            }`}
            aria-pressed={selectedKategori === 'semua'}
          >
            Semua
          </button>
          {kategoris.map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKategori(k)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedKategori === k
                  ? 'bg-primary text-white'
                  : 'border border-border text-foreground hover:border-primary'
              }`}
              aria-pressed={selectedKategori === k}
            >
              {KATEGORI_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Tidak ada dokumen ditemukan.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <FileIcon mimeType={doc.mimeType} />
                </div>
                <div>
                  <span className="inline-block rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                    {KATEGORI_LABELS[doc.kategori]}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">{doc.tahun}</span>
                </div>
              </div>
              <h3 className="mb-2 flex-1 font-semibold text-foreground">
                {doc.judul}
              </h3>
              {doc.deskripsi && (
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {doc.deskripsi}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between">
                {doc.filesize ? (
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(doc.filesize)}
                  </span>
                ) : (
                  <span />
                )}
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  <Download className="h-4 w-4" />
                  Unduh
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
