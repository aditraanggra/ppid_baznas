import type { Metadata } from 'next'
import { serverCaller } from '@/server/caller'
import { StatistikClient } from './statistik-client'

export const metadata: Metadata = {
  title: 'Statistik',
  description: 'Laporan dan statistik pengelolaan informasi publik BAZNAS Kabupaten Cianjur.',
}

interface StatusCount {
  status: string
  total: number
}

interface TrendItem {
  month: string
  total: number
}

interface KategoriCount {
  kategori: string
  total: number
}

export default async function StatistikPage() {
  const caller = await serverCaller()
  const rawRingkasan = await caller.statistik.ringkasan({})
  const rawTren = await caller.statistik.trenBulanan()
  const rawKategori = await caller.statistik.perKategori()

  const ringkasan = rawRingkasan as unknown as { total: number; byStatus: StatusCount[] }
  const tren = rawTren as unknown as TrendItem[]
  const perKategori = rawKategori as unknown as KategoriCount[]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
          Laporan & Statistik
        </h1>
        <p className="text-muted-foreground">
          Data dan statistik permohonan informasi publik BAZNAS Kabupaten Cianjur
        </p>
      </div>
      <StatistikClient
        ringkasan={ringkasan}
        trenBulanan={tren}
        perKategori={perKategori}
      />
    </div>
  )
}
