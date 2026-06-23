'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Clock, CheckCircle, XCircle, RefreshCw, AlertTriangle, Upload } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@ppid/ui'
import { Badge } from '@ppid/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@ppid/ui'
import { Skeleton } from '@ppid/ui'
import { Textarea } from '@ppid/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ppid/ui'
import { getSLAStatus } from '@/lib/sla'
import Link from 'next/link'

type StatusPermohonan = 'pending' | 'diterima' | 'klarifikasi' | 'diproses' | 'selesai' | 'ditolak' | 'perpanjangan' | 'keberatan'

const STATUS_TRANSITIONS: Record<StatusPermohonan, StatusPermohonan[]> = {
  pending:      ['diterima', 'ditolak'],
  diterima:     ['klarifikasi', 'diproses', 'ditolak'],
  klarifikasi:  ['diproses', 'ditolak'],
  diproses:     ['selesai', 'ditolak', 'perpanjangan'],
  selesai:      [],
  ditolak:      ['keberatan'],
  perpanjangan: ['selesai', 'ditolak'],
  keberatan:    ['diproses'],
}

const STATUS_LABELS: Record<string, string> = {
  pending:      'Menunggu',
  diterima:     'Diterima',
  klarifikasi:  'Klarifikasi',
  diproses:     'Diproses',
  selesai:      'Selesai',
  ditolak:      'Ditolak',
  perpanjangan: 'Perpanjangan',
  keberatan:    'Keberatan',
}

/**
 * Admin permohonan detail page.
 * Shows full details, status timeline, SLA indicator, and status update form.
 */
export default function PermohonanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [updateStatus, setUpdateStatus] = useState<StatusPermohonan | null>(null)
  const [catatan, setCatatan] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading, refetch } = trpc.admin.getPermohonan.useQuery({ id })

  const updateMutation = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      setDialogOpen(false)
      setCatatan('')
      setUpdateStatus(null)
      void refetch()
    },
  })

  const handleStatusUpdate = () => {
    if (!updateStatus) return
    updateMutation.mutate({ id, toStatus: updateStatus, catatan: catatan || undefined })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
        <p>Permohonan tidak ditemukan.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link href="/admin/permohonan">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
      </div>
    )
  }

  const currentStatus = data.status as StatusPermohonan
  const availableTransitions = STATUS_TRANSITIONS[currentStatus] ?? []
  const slaStatus = data.tanggalDeadline ? getSLAStatus(new Date(data.tanggalDeadline)) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/permohonan">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold font-heading text-foreground">
            {data.nomorTiket}
          </h1>
          <p className="text-sm text-muted-foreground">
            Diajukan pada {formatDate(data.createdAt)}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={data.status} />
          <Button variant="ghost" size="icon" onClick={() => void refetch()} title="Segarkan">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Pemohon</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <InfoRow label="Nama Pemohon" value={data.namaPemohon} />
              <InfoRow label="Email" value={data.email} />
              <InfoRow label="NIK" value={`${data.nomorIdentitas.slice(0, 4)}****${data.nomorIdentitas.slice(-4)}`} />
              <InfoRow label="Nomor Telepon" value={data.nomorTelepon ?? '-'} />
              <InfoRow label="Alamat" value={data.alamat} className="sm:col-span-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detail Permohonan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <InfoRow label="Kategori Informasi" value={formatKategori(data.kategoriInformasi)} />
              <InfoRow label="Cara Mendapatkan" value={formatCara(data.caraMendapatkan)} />
              <InfoRow label="Tujuan Permohonan" value={data.tujuanPermohonan} className="sm:col-span-2" />
              <InfoRow label="Rincian Informasi" value={data.rincianInformasi} className="sm:col-span-2" />
              {data.lampiranIdentitas && (
                <div>
                  <p className="text-xs text-muted-foreground">Lampiran Identitas</p>
                  <a
                    href={`/api/files/${data.lampiranIdentitas}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary underline"
                  >
                    Unduh lampiran
                  </a>
                </div>
              )}
              {data.catatanAdmin && (
                <InfoRow label="Catatan Admin" value={data.catatanAdmin} className="sm:col-span-2" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              {data.timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada riwayat perubahan status.</p>
              ) : (
                <ol className="relative border-l border-border pl-4">
                  {data.timeline.map((entry, idx) => (
                    <li key={idx} className="mb-4 last:mb-0">
                      <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                        <p className="text-sm font-medium">
                          {entry.statusDari
                            ? `${STATUS_LABELS[entry.statusDari] ?? entry.statusDari} → `
                            : ''}
                          <span className="text-primary">{STATUS_LABELS[entry.statusKe] ?? entry.statusKe}</span>
                        </p>
                        {entry.catatan && (
                          <p className="text-xs text-muted-foreground">{entry.catatan}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SLA & Tenggat Waktu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow
                label="Tanggal Diterima"
                value={data.tanggalDiterima ? formatDate(data.tanggalDiterima) : 'Belum divalidasi'}
              />
              <InfoRow
                label="Tenggat Waktu"
                value={data.tanggalDeadline ? formatDate(data.tanggalDeadline) : '-'}
              />
              {slaStatus && (
                <SLABadge status={slaStatus} deadline={data.tanggalDeadline!} />
              )}
              {data.tanggalPerpanjangan && (
                <InfoRow
                  label="Tanggal Perpanjangan"
                  value={formatDate(data.tanggalPerpanjangan)}
                />
              )}
              {data.tanggalSelesai && (
                <InfoRow
                  label="Tanggal Selesai"
                  value={formatDate(data.tanggalSelesai)}
                />
              )}
            </CardContent>
          </Card>

          {availableTransitions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Perbarui Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableTransitions.map((nextStatus) => (
                  <Dialog
                    key={nextStatus}
                    open={dialogOpen && updateStatus === nextStatus}
                    onOpenChange={(open) => {
                      setDialogOpen(open)
                      if (!open) {
                        setUpdateStatus(null)
                        setCatatan('')
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant={nextStatus === 'ditolak' || nextStatus === 'keberatan' ? 'destructive' : 'default'}
                        className="w-full"
                        onClick={() => {
                          setUpdateStatus(nextStatus)
                          setDialogOpen(true)
                        }}
                      >
                        {getActionLabel(nextStatus)}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {getActionLabel(nextStatus)}?
                        </DialogTitle>
                        <DialogDescription>
                          Status permohonan akan diubah menjadi{' '}
                          <strong>{STATUS_LABELS[nextStatus]}</strong>.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Catatan Admin {nextStatus === 'ditolak' ? '(wajib)' : '(opsional)'}
                        </label>
                        <Textarea
                          placeholder={
                            nextStatus === 'ditolak'
                              ? 'Tuliskan alasan penolakan dan dasar hukumnya...'
                              : 'Tambahkan catatan jika diperlukan...'
                          }
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDialogOpen(false)}
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handleStatusUpdate}
                          disabled={
                            updateMutation.isPending ||
                            (nextStatus === 'ditolak' && catatan.trim().length < 10)
                          }
                          variant={nextStatus === 'ditolak' ? 'destructive' : 'default'}
                        >
                          {updateMutation.isPending ? 'Menyimpan...' : 'Konfirmasi'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}

                {updateMutation.isError && (
                  <p className="text-xs text-red-600">
                    Terjadi kesalahan. Silakan coba lagi.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' }> = {
    pending:      { label: 'Menunggu',      variant: 'warning'     },
    diterima:     { label: 'Diterima',      variant: 'secondary'   },
    klarifikasi:  { label: 'Klarifikasi',   variant: 'secondary'   },
    diproses:     { label: 'Diproses',      variant: 'secondary'   },
    selesai:      { label: 'Selesai',       variant: 'success'     },
    ditolak:      { label: 'Ditolak',       variant: 'destructive' },
    perpanjangan: { label: 'Perpanjangan',  variant: 'warning'     },
    keberatan:    { label: 'Keberatan',     variant: 'destructive' },
  }
  const { label, variant } = cfg[status] ?? { label: status, variant: 'outline' }
  return <Badge variant={variant}>{label}</Badge>
}

function SLABadge({ status, deadline }: { status: string; deadline: Date | string }) {
  const dueDate = new Date(deadline)
  const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / 86_400_000)

  const configs: Record<string, { label: string; color: string }> = {
    aman:       { label: `${daysLeft} hari tersisa`, color: 'text-emerald-600' },
    mendekati:  { label: `Mendekat! ${daysLeft} hari lagi`, color: 'text-amber-600' },
    hari_ini:   { label: 'Jatuh tempo HARI INI', color: 'text-red-600' },
    lewat:      { label: `Lewat ${Math.abs(daysLeft)} hari`, color: 'text-red-700 font-bold' },
  }

  const cfg = configs[status] ?? { label: status, color: 'text-muted-foreground' }

  return (
    <div className="flex items-center gap-1">
      <AlertTriangle className={`h-3.5 w-3.5 ${status === 'aman' ? 'text-emerald-600' : 'text-amber-600'}`} />
      <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
    </div>
  )
}

function getActionLabel(status: string): string {
  const labels: Record<string, string> = {
    diterima:     'Terima Permohonan',
    klarifikasi:  'Minta Klarifikasi',
    diproses:     'Mulai Proses',
    selesai:      'Tandai Selesai',
    ditolak:      'Tolak Permohonan',
    perpanjangan: 'Perpanjang SLA',
    keberatan:    'Proses Keberatan',
  }
  return labels[status] ?? status
}

function formatDate(d: Date | string | null): string {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatKategori(k: string): string {
  const m: Record<string, string> = {
    berkala:     'Berkala',
    serta_merta: 'Serta Merta',
    setiap_saat: 'Setiap Saat',
  }
  return m[k] ?? k
}

function formatCara(c: string): string {
  const m: Record<string, string> = { email: 'Email', langsung: 'Langsung', pos: 'Pos' }
  return m[c] ?? c
}
