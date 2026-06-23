import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Clock, Zap, Archive } from 'lucide-react'
import { getDokumenPublikList } from '@/lib/payload'
import { InformasiPublikClient } from './informasi-publik-client'

export const metadata: Metadata = {
  title: 'Daftar Informasi Publik',
  description:
    'Daftar informasi publik BAZNAS Kabupaten Cianjur sesuai UU KIP No.14/2008.',
}

export default async function InformasiPublikPage() {
  const [berkala, sertaMerta, setiapSaat] = await Promise.all([
    getDokumenPublikList({ kategoriInformasi: 'berkala', limit: 50 }),
    getDokumenPublikList({ kategoriInformasi: 'serta_merta', limit: 50 }),
    getDokumenPublikList({ kategoriInformasi: 'setiap_saat', limit: 50 }),
  ])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-3 text-balance font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Daftar Informasi Publik
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
          Informasi publik BAZNAS Kabupaten Cianjur yang dapat diakses sesuai UU KIP No.14/2008
        </p>
      </div>

      <section className="mb-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/informasi-publik/berkala"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-primary hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
              Informasi Berkala
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Informasi yang diumumkan secara rutin oleh BAZNAS
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">{berkala.totalDocs} dokumen</span>
              <span className="text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Lihat semua →
              </span>
            </div>
          </Link>

          <Link
            href="/informasi-publik/serta-merta"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-warning hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 text-warning transition-transform duration-200 group-hover:scale-110">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
              Informasi Serta Merta
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Informasi yang harus diumumkan dalam waktu 24 jam
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-warning">{sertaMerta.totalDocs} dokumen</span>
              <span className="text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Lihat semua →
              </span>
            </div>
          </Link>

          <Link
            href="/informasi-publik/setiap-saat"
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-info hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-info/10 text-info transition-transform duration-200 group-hover:scale-110">
              <Archive className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
              Informasi Setiap Saat
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Informasi yang tersedia dan dapat diakses kapan saja
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-info">{setiapSaat.totalDocs} dokumen</span>
              <span className="text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Lihat semua →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <InformasiPublikClient
        berkala={berkala.docs}
        sertaMerta={sertaMerta.docs}
        setiapSaat={setiapSaat.docs}
      />
    </div>
  )
}
