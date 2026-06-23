'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@ppid/ui'
import { Input } from '@ppid/ui'
import { Badge } from '@ppid/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@ppid/ui'
import { Skeleton } from '@ppid/ui'

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'diterima', label: 'Diterima' },
  { value: 'klarifikasi', label: 'Klarifikasi' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Ditolak' },
  { value: 'perpanjangan', label: 'Perpanjangan' },
  { value: 'keberatan', label: 'Keberatan' },
]

const PAGE_SIZE_OPTIONS = [10, 20, 50]

/**
 * Admin permohonan list page.
 * Features: search, status filter, pagination, sort, link to detail.
 */
export default function PermohonanListPage() {
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [status, setStatus] = useState<string>('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 400)
  }, [])

  const { data, isLoading, refetch, isFetching } =
    trpc.admin.listPermohonan.useQuery(
      {
        page,
        pageSize,
        status: (status || undefined) as
          | 'pending'
          | 'diterima'
          | 'klarifikasi'
          | 'diproses'
          | 'selesai'
          | 'ditolak'
          | 'perpanjangan'
          | 'keberatan'
          | undefined,
        search: debouncedSearch || undefined,
      },
      { placeholderData: (prev) => prev },
    )

  const rows = (data?.rows ?? []) as Array<Record<string, unknown>>
  const pagination = data?.pagination as
    | { page: number; pageSize: number; total: number; totalPages: number }
    | undefined

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold font-heading text-foreground'>
          Permohonan Informasi
        </h1>
        <p className='text-sm text-muted-foreground'>
          Kelola seluruh permohonan informasi publik.
        </p>
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between gap-4 pb-4'>
          <CardTitle className='text-base'>Daftar Permohonan</CardTitle>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => void refetch()}
            disabled={isFetching}
            title='Segarkan data'
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Cari nomor tiket atau nama pemohon...'
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className='pl-9'
              />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className='h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className='space-y-2'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-14 w-full rounded-md' />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground'>
              <FileSearch className='mb-3 h-10 w-10 text-muted-foreground/50' />
              <p>Tidak ada permohonan yang ditemukan.</p>
              <p>Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-border text-left'>
                      <th className='pb-3 font-medium text-muted-foreground'>
                        No. Tiket
                      </th>
                      <th className='pb-3 font-medium text-muted-foreground'>
                        Nama Pemohon
                      </th>
                      <th className='pb-3 font-medium text-muted-foreground'>
                        Kategori
                      </th>
                      <th className='pb-3 font-medium text-muted-foreground'>
                        Status
                      </th>
                      <th className='pb-3 font-medium text-muted-foreground'>
                        Tanggal
                      </th>
                      <th className='pb-3 font-medium text-muted-foreground'>
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-border'>
                    {rows.map((row) => (
                      <tr
                        key={String(row.id)}
                        className='hover:bg-surface/50 transition-colors'
                      >
                        <td className='py-3 font-mono text-xs font-medium text-primary'>
                          {String(row.nomorTiket)}
                        </td>
                        <td className='py-3'>{String(row.namaPemohon)}</td>
                        <td className='py-3'>
                          <Badge variant='outline'>
                            {formatKategori(String(row.kategoriInformasi))}
                          </Badge>
                        </td>
                        <td className='py-3'>
                          {<StatusBadge status={String(row.status)} />}
                        </td>
                        <td className='py-3 text-muted-foreground'>
                          {formatDate(row.createdAt as Date | string | null)}
                        </td>
                        <td className='py-3'>
                          <Button variant='ghost' size='icon' asChild>
                            <Link
                              href={`/admin/permohonan/${String(row.id)}`}
                              title='Lihat detail'
                            >
                              <Eye className='h-4 w-4' />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && (
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <span>Menampilkan</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setPage(1)
                      }}
                      className='rounded border border-input bg-background px-1 py-0.5 text-xs'
                    >
                      {PAGE_SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span>dari {pagination.total} permohonan</span>
                  </div>

                  <div className='flex items-center gap-1'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                    >
                      <ChevronsLeft className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>

                    <span className='flex items-center gap-1 px-2 text-xs'>
                      <input
                        type='number'
                        min={1}
                        max={pagination.totalPages}
                        value={page}
                        onChange={(e) => {
                          const v = parseInt(e.target.value)
                          if (
                            !isNaN(v) &&
                            v >= 1 &&
                            v <= pagination.totalPages
                          ) {
                            setPage(v)
                          }
                        }}
                        className='w-12 rounded border border-input bg-background px-1 py-0.5 text-center text-xs'
                      />
                      <span>dari {pagination.totalPages}</span>
                    </span>

                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() =>
                        setPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={page === pagination.totalPages}
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setPage(pagination.totalPages)}
                      disabled={page === pagination.totalPages}
                    >
                      <ChevronsRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<
    string,
    {
      label: string
      variant:
        | 'default'
        | 'success'
        | 'warning'
        | 'destructive'
        | 'secondary'
        | 'outline'
    }
  > = {
    pending: { label: 'Menunggu', variant: 'warning' },
    diterima: { label: 'Diterima', variant: 'secondary' },
    klarifikasi: { label: 'Klarifikasi', variant: 'secondary' },
    diproses: { label: 'Diproses', variant: 'secondary' },
    selesai: { label: 'Selesai', variant: 'success' },
    ditolak: { label: 'Ditolak', variant: 'destructive' },
    perpanjangan: { label: 'Perpanjangan', variant: 'warning' },
    keberatan: { label: 'Keberatan', variant: 'destructive' },
  }
  const { label, variant } = cfg[status] ?? {
    label: status,
    variant: 'outline',
  }
  return <Badge variant={variant}>{label}</Badge>
}

function formatKategori(k: string): string {
  const m: Record<string, string> = {
    berkala: 'Berkala',
    serta_merta: 'Serta Merta',
    setiap_saat: 'Setiap Saat',
  }
  return m[k] ?? k
}

function formatDate(d: Date | string | null): string {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function FileSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25m-8.5 14.625v2.625M15 17.25v2.625m4.5-2.625v2.625m-4.5 0h4.5'
      />
    </svg>
  )
}
