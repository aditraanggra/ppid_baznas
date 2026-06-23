'use client'

import { useState } from 'react'
import { Search, FileText, Download, Calendar, FolderOpen } from 'lucide-react'
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

interface Props {
  berkala: DokumenPublikDoc[]
  sertaMerta: DokumenPublikDoc[]
  setiapSaat: DokumenPublikDoc[]
}

/**
 * Client component for searching and filtering the Informasi Publik list.
 * Receives pre-fetched data from the server component.
 */
export function InformasiPublikClient({ berkala, sertaMerta, setiapSaat }: Props) {
  const [search, setSearch] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState<string>('semua')
  const [activeTab, setActiveTab] = useState<'berkala' | 'serta_merta' | 'setiap_saat'>('berkala')

  const allDocs = [
    ...berkala.map((d) => ({ ...d, _kategori: 'berkala' as const })),
    ...sertaMerta.map((d) => ({ ...d, _kategori: 'serta_merta' as const })),
    ...setiapSaat.map((d) => ({ ...d, _kategori: 'setiap_saat' as const })),
  ]

  const filtered = allDocs.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.judul.toLowerCase().includes(search.toLowerCase()) ||
      (doc.deskripsi ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesKategori =
      kategoriFilter === 'semua' || doc.kategori === kategoriFilter
    const matchesTab = doc._kategori === activeTab
    return matchesSearch && matchesKategori && matchesTab
  })

  const tabs = [
    { key: 'berkala' as const, label: 'Berkala', count: berkala.length },
    { key: 'serta_merta' as const, label: 'Serta Merta', count: sertaMerta.length },
    { key: 'setiap_saat' as const, label: 'Setiap Saat', count: setiapSaat.length },
  ]

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            aria-label="Cari dokumen"
          />
        </div>
        <div className="relative">
          <FolderOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="appearance-none rounded-md border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer"
            aria-label="Filter kategori"
          >
            <option value="semua">Semua Kategori</option>
            {Object.entries(KATEGORI_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-surface p-1" role="tablist" aria-label="Kategori informasi publik">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`panel-${tab.key}`}
          >
            {tab.label}
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-border text-muted-foreground'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div id={`panel-${activeTab}`} className="rounded-lg border border-border bg-card p-16 text-center" role="tabpanel">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
            Tidak ada dokumen ditemukan
          </h3>
          <p className="text-sm text-muted-foreground">
            {search || kategoriFilter !== 'semua'
              ? 'Coba ubah kata kunci pencarian atau filter kategori'
              : 'Belum ada dokumen dalam kategori ini'}
          </p>
        </div>
      ) : (
        <div id={`panel-${activeTab}`} className="grid gap-4 md:grid-cols-2" role="tabpanel">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-primary hover:shadow-md"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="mb-1.5 font-semibold text-foreground line-clamp-2">{doc.judul}</h4>
                {doc.deskripsi && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{doc.deskripsi}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    {KATEGORI_LABELS[doc.kategori]}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {doc.tahun}
                  </span>
                  {doc.filesize && (
                    <span className="text-muted-foreground/70">
                      {formatFileSize(doc.filesize)}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:scale-105"
                aria-label={`Unduh ${doc.judul}`}
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
