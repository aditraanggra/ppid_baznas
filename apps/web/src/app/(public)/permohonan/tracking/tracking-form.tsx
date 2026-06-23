'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
import { TrackingResult } from './tracking-result'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu Validasi',
  diterima: 'Diterima',
  klarifikasi: 'Memerlukan Klarifikasi',
  diproses: 'Sedang Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
  perpanjangan: 'Perpanjangan',
  keberatan: 'Keberatan',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning-light text-warning',
  diterima: 'bg-info-light text-info',
  klarifikasi: 'bg-warning-light text-warning',
  diproses: 'bg-info-light text-info',
  selesai: 'bg-success-light text-success',
  ditolak: 'bg-destructive-light text-destructive',
  perpanjangan: 'bg-warning-light text-warning',
  keberatan: 'bg-muted text-muted-foreground',
}

interface TrackingFormProps {
  defaultTicket?: string
}

export function TrackingForm({ defaultTicket }: TrackingFormProps = {}) {
  const router = useRouter()
  const [nomorTiket, setNomorTiket] = useState(defaultTicket ?? '')
  const [email, setEmail] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const { data, isLoading, error, refetch } = trpc.permohonan.cekStatus.useQuery(
    { nomorTiket, email },
    {
      enabled: hasSearched,
      retry: false,
    },
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!nomorTiket || !email) {
      toast.error('Nomor tiket dan email wajib diisi.')
      return
    }
    setHasSearched(true)
    refetch()
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSearch}
        className="rounded-lg border border-border bg-card p-6 space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Nomor Tiket <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={nomorTiket}
            onChange={(e) => setNomorTiket(e.target.value.toUpperCase())}
            placeholder="PPID-202506-0001"
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@contoh.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memeriksa...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Lacak Permohonan
            </>
          )}
        </button>
      </form>

      {hasSearched && error && (
        <div className="rounded-lg border border-destructive bg-destructive-light p-6 text-center">
          <p className="text-sm text-destructive">
            {error.message || 'Permohonan tidak ditemukan. Periksa kembali nomor tiket dan email Anda.'}
          </p>
        </div>
      )}

      {hasSearched && data && (
        <TrackingResult
          data={data}
          statusLabels={STATUS_LABELS}
          statusColors={STATUS_COLORS}
        />
      )}
    </div>
  )
}
