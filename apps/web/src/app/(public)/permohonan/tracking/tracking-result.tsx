'use client'

import { format } from 'date-fns'
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface TimelineEntry {
  statusDari: string | null
  statusKe: string
  catatan: string | null
  createdAt: Date
}

interface TrackingData {
  nomorTiket: string
  namaPemohon: string
  status: string
  kategoriInformasi: string
  rincianInformasi: string
  tanggalDiterima: Date | null
  tanggalDeadline: Date | null
  tanggalPerpanjangan: Date | null
  tanggalSelesai: Date | null
  createdAt: Date
  timeline: TimelineEntry[]
}

interface Props {
  data: TrackingData
  statusLabels: Record<string, string>
  statusColors: Record<string, string>
}

function formatDate(d: Date | null): string {
  if (!d) return '—'
  return format(new Date(d), 'dd MMM yyyy, HH:mm', { locale: undefined })
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'selesai':
      return <CheckCircle className="h-5 w-5 text-success" />
    case 'ditolak':
      return <XCircle className="h-5 w-5 text-destructive" />
    case 'pending':
      return <Clock className="h-5 w-5 text-warning" />
    default:
      return <AlertCircle className="h-5 w-5 text-info" />
  }
}

export function TrackingResult({ data, statusLabels, statusColors }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Nomor Tiket</p>
            <p className="font-mono text-lg font-bold text-foreground">{data.nomorTiket}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${statusColors[data.status] ?? 'bg-gray-100 text-gray-700'}`}
          >
            <StatusIcon status={data.status} />
            {statusLabels[data.status] ?? data.status}
          </span>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Nama Pemohon: </span>
            <span className="font-medium text-foreground">{data.namaPemohon}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Kategori: </span>
            <span className="font-medium text-foreground capitalize">
              {data.kategoriInformasi.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Diajukan: </span>
            <span className="font-medium text-foreground">{formatDate(data.createdAt)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Deadline: </span>
            <span className="font-medium text-foreground">{formatDate(data.tanggalDeadline)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-surface p-4">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Rincian Informasi</p>
          <p className="text-sm text-foreground">{data.rincianInformasi}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
          Riwayat Permohonan
        </h3>
        <div className="space-y-4">
          {data.timeline.map((entry, idx) => (
            <div key={`${entry.statusKe}-${String(entry.createdAt)}-${idx}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light">
                  <StatusIcon status={entry.statusKe} />
                </div>
                {idx < data.timeline.length - 1 && (
                  <div className="h-full w-px bg-border" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-foreground">
                  {statusLabels[entry.statusKe] ?? entry.statusKe}
                </p>
                {entry.catatan && (
                  <p className="mt-1 text-sm text-muted-foreground">{entry.catatan}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(entry.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
