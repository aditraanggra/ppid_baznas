'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, RefreshCw } from 'lucide-react'
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
import Link from 'next/link'

type StatusPengaduan = 'pending' | 'diproses' | 'ditindaklanjuti' | 'selesai'

const STATUS_TRANSITIONS: Record<StatusPengaduan, StatusPengaduan[]> = {
  pending: ['diproses'],
  diproses: ['ditindaklanjuti'],
  ditindaklanjuti: ['selesai'],
  selesai: [],
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  diproses: 'Diproses',
  ditindaklanjuti: 'Ditindaklanjuti',
  selesai: 'Selesai',
}

/**
 * Admin pengaduan detail page.
 * Shows full details and status update form.
 */
export default function PengaduanDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [updateStatus, setUpdateStatus] = useState<StatusPengaduan | null>(null)
  const [catatan, setCatatan] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading, refetch } = trpc.admin.getPengaduan.useQuery({ id })

  const updateMutation = trpc.admin.updateStatusPengaduan.useMutation({
    onSuccess: () => {
      setDialogOpen(false)
      setCatatan('')
      setUpdateStatus(null)
      void refetch()
    },
  })

  const handleStatusUpdate = () => {
    if (!updateStatus) return
    updateMutation.mutate({ id, toStatus: updateStatus, catatanAdmin: catatan || undefined })
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
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
        <p>Pengaduan tidak ditemukan.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link href="/admin/pengaduan">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
      </div>
    )
  }

  const currentStatus = data.status as StatusPengaduan
  const availableTransitions = STATUS_TRANSITIONS[currentStatus] ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/pengaduan">
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
              <CardTitle className="text-base">Data Pelapor</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <InfoRow label="Nama" value={data.nama} />
              <InfoRow label="Email" value={data.email} />
              <InfoRow label="Nomor Telepon" value={data.nomorTelepon ?? '-'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detail Pengaduan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <InfoRow label="Kategori" value={formatKategori(data.kategori)} />
              <InfoRow label="Subjek" value={data.subjek} />
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">Isi Pengaduan</p>
                <p className="font-medium whitespace-pre-wrap break-words">{data.isiPengaduan}</p>
              </div>
              {data.lampiran && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Lampiran</p>
                  <a
                    href={`/api/files/${data.lampiran}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary underline"
                  >
                    Unduh lampiran
                  </a>
                </div>
              )}
              {data.catatanAdmin && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Catatan Admin</p>
                  <p className="font-medium whitespace-pre-wrap break-words">{data.catatanAdmin}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
                        variant="default"
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
                          Status pengaduan akan diubah menjadi{' '}
                          <strong>{STATUS_LABELS[nextStatus]}</strong>.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Catatan Admin (opsional)
                        </label>
                        <Textarea
                          placeholder="Tambahkan catatan jika diperlukan..."
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
                          disabled={updateMutation.isPending}
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
    pending: { label: 'Menunggu', variant: 'warning' },
    diproses: { label: 'Diproses', variant: 'secondary' },
    ditindaklanjuti: { label: 'Ditindaklanjuti', variant: 'secondary' },
    selesai: { label: 'Selesai', variant: 'success' },
  }
  const { label, variant } = cfg[status] ?? { label: status, variant: 'outline' }
  return <Badge variant={variant}>{label}</Badge>
}

function getActionLabel(status: string): string {
  const labels: Record<string, string> = {
    diproses: 'Mulai Proses',
    ditindaklanjuti: 'Tindaklanjuti',
    selesai: 'Tandai Selesai',
  }
  return labels[status] ?? status
}

function formatDate(d: Date | string | null): string {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatKategori(k: string): string {
  const m: Record<string, string> = {
    pelayanan: 'Pelayanan',
    penyaluran_zis: 'Penyaluran ZIS',
    keberatan: 'Keberatan',
    lainnya: 'Lainnya',
  }
  return m[k] ?? k
}
