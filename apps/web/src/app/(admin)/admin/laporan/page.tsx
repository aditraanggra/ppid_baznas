'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { FileBarChart, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@ppid/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@ppid/ui'
import { Badge } from '@ppid/ui'
import { Skeleton } from '@ppid/ui'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

/**
 * Admin laporan page.
 * Generates reports in PDF and Excel formats for a selected date range.
 */
export default function LaporanPage() {
  const [from, setFrom] = useState(
    format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), 'yyyy-MM-dd'),
  )
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading, refetch } = trpc.laporan.ringkasan.useQuery(
    { from: new Date(from), to: new Date(to) },
  )

  const { data: detailRows } = trpc.laporan.detail.useQuery(
    {
      from:   new Date(from),
      to:     new Date(to),
      status: (statusFilter || undefined) as 'pending' | 'diterima' | 'klarifikasi' | 'diproses' | 'selesai' | 'ditolak' | 'perpanjangan' | 'keberatan' | undefined,
    },
  )

  const statusData = ((data?.byStatus ?? []) as Array<{ status: string; total: number }>).map((s) => ({
    name: formatStatusLabel(s.status),
    total: Number(s.total),
  }))

  const kategoriData = ((data?.byKategori ?? []) as Array<{ kategori: string; total: number }>).map((k) => ({
    name: formatKategori(k.kategori),
    total: Number(k.total),
  }))

  /**
   * Export detail rows as CSV (Excel-compatible).
   */
  function exportCSV() {
    if (!detailRows?.length) return

    const headers = [
      'No. Tiket', 'Nama Pemohon', 'Email', 'Kategori',
      'Rincian', 'Status', 'Tanggal Masuk', 'Tanggal Diterima',
      'Tenggat Waktu', 'Tanggal Selesai',
    ]

    const rows = (detailRows as Array<Record<string, unknown>>).map((r) => [
      String(r.nomorTiket ?? ''),
      String(r.namaPemohon ?? ''),
      String(r.email ?? ''),
      formatKategori(String(r.kategoriInformasi ?? '')),
      `"${(String(r.rincianInformasi ?? '')).replace(/"/g, '""')}"`,
      formatStatusLabel(String(r.status ?? '')),
      formatDate(r.createdAt as Date | string),
      r.tanggalDiterima ? formatDate(r.tanggalDiterima as Date | string) : '',
      r.tanggalDeadline ? formatDate(r.tanggalDeadline as Date | string) : '',
      r.tanggalSelesai ? formatDate(r.tanggalSelesai as Date | string) : '',
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-permohonan-${from}-${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Print the summary as a simple HTML page (browser print → PDF).
   */
  function exportPDF() {
    if (!data) return

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Laporan Permohonan PPID BAZNAS Cianjur</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #111827; }
          h1 { color: #259148; font-size: 20px; }
          h2 { color: #1a5276; font-size: 16px; margin-top: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background: #f5f5f5; font-weight: 600; }
          .meta { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
          .kpi { display: flex; gap: 16px; margin: 16px 0; }
          .kpi-card { flex: 1; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; text-align: center; }
          .kpi-value { font-size: 24px; font-weight: bold; color: #259148; }
          .kpi-label { font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>Laporan Permohonan Informasi Publik</h1>
        <h1>PPID BAZNAS Kabupaten Cianjur</h1>
        <p class="meta">Periode: ${formatDate(new Date(from))} — ${formatDate(new Date(to))}</p>
        <p class="meta">Dibuat: ${format(new Date(), 'dd MMMM yyyy, HH:mm')} WIB</p>

        <div class="kpi">
          <div class="kpi-card">
            <div class="kpi-value">${data.total}</div>
            <div class="kpi-label">Total Permohonan</div>
          </div>
        </div>

        <h2>Distribusi Status</h2>
        <table>
          <thead><tr><th>Status</th><th>Jumlah</th></tr></thead>
          <tbody>
            ${(data.byStatus as Array<{ status: string; total: number }>).map((s) => `<tr><td>${formatStatusLabel(s.status)}</td><td>${s.total}</td></tr>`).join('')}
          </tbody>
        </table>

        <h2>Distribusi Kategori</h2>
        <table>
          <thead><tr><th>Kategori</th><th>Jumlah</th></tr></thead>
          <tbody>
            ${(data.byKategori as Array<{ kategori: string; total: number }>).map((k) => `<tr><td>${formatKategori(k.kategori)}</td><td>${k.total}</td></tr>`).join('')}
          </tbody>
        </table>

        <script>window.onload = () => window.print()</script>
      </body>
      </html>
    `

    const w = window.open('', '_blank')
    if (w) {
      w.document.write(html)
      w.document.close()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Generate laporan permohonan informasi publik dalam format PDF atau Excel.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Periode Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Dari Tanggal</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Sampai Tanggal</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <Button onClick={() => void refetch()} disabled={isLoading}>
              <FileBarChart className="h-4 w-4" />
              {isLoading ? 'Memuat...' : 'Generate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribusi Status</CardTitle>
              </CardHeader>
              <CardContent>
                {!statusData.length ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada data.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="total" fill="#259148" radius={[4, 4, 0, 0]} name="Jumlah" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribusi Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                {!kategoriData.length ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada data.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={kategoriData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="total" fill="#1a5276" radius={[4, 4, 0, 0]} name="Jumlah" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Ekspor Laporan</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportPDF}>
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel (CSV)
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total permohonan pada periode ini: <strong>{Number(data?.total ?? 0)}</strong>
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function formatStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending:      'Menunggu',
    diterima:     'Diterima',
    klarifikasi:  'Klarifikasi',
    diproses:     'Diproses',
    selesai:      'Selesai',
    ditolak:      'Ditolak',
    perpanjangan: 'Perpanjangan',
    keberatan:    'Keberatan',
  }
  return labels[status] ?? status
}

function formatKategori(k: string): string {
  const m: Record<string, string> = {
    berkala: 'Berkala', serta_merta: 'Serta Merta', setiap_saat: 'Setiap Saat',
  }
  return m[k] ?? k
}

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}
