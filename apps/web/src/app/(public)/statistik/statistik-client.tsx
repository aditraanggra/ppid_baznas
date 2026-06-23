'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: '#eab308',
  diterima: '#3b82f6',
  klarifikasi: '#f97316',
  diproses: '#6366f1',
  selesai: '#22c55e',
  ditolak: '#ef4444',
  perpanjangan: '#a855f7',
  keberatan: '#6b7280',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  diterima: 'Diterima',
  klarifikasi: 'Klarifikasi',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
  perpanjangan: 'Perpanjangan',
  keberatan: 'Keberatan',
}

const KATEGORI_LABELS: Record<string, string> = {
  berkala: 'Berkala',
  serta_merta: 'Serta Merta',
  setiap_saat: 'Setiap Saat',
}

const KATEGORI_COLORS = ['#259148', '#fdc727', '#1a5276']

interface RingkasanItem {
  status: string
  total: number
}

interface TrenItem {
  month: string
  total: number
}

interface KategoriItem {
  kategori: string
  total: number
}

interface Props {
  ringkasan: { total: number; byStatus: RingkasanItem[] }
  trenBulanan: TrenItem[]
  perKategori: KategoriItem[]
}

function formatMonthLabel(month: string): string {
  const parts = month.split('-')
  const y = parts[0] ?? ''
  const m = parts[1] ?? '01'
  const monthIndex = parseInt(m, 10) - 1
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ]
  if (monthIndex < 0 || monthIndex >= 12 || isNaN(monthIndex)) {
    return `${m} ${y}` // Fallback to raw month
  }
  return `${months[monthIndex]} ${y}`
}

export function StatistikClient({
  ringkasan,
  trenBulanan: tren,
  perKategori,
}: Props) {
  const totalSelesai =
    ringkasan.byStatus.find((s) => s.status === 'selesai')?.total ?? 0
  const totalDiproses =
    ringkasan.byStatus.find((s) => s.status === 'diproses')?.total ?? 0
  const totalPending =
    ringkasan.byStatus.find((s) => s.status === 'pending')?.total ?? 0

  const pieData = ringkasan.byStatus
    .filter((s) => s.total > 0)
    .map((s) => ({
      name: STATUS_LABELS[s.status] ?? s.status,
      value: s.total,
      color: STATUS_COLORS[s.status] ?? '#6b7280',
    }))

  const barData = tren.map((t) => ({
    month: formatMonthLabel(t.month),
    total: t.total,
  }))

  return (
    <div className='space-y-8'>
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-border bg-card p-6'>
          <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary'>
            <Users className='h-5 w-5' />
          </div>
          <p className='text-sm text-muted-foreground'>Total Permohonan</p>
          <p className='font-heading text-3xl font-bold text-foreground'>
            {ringkasan.total}
          </p>
        </div>

        <div className='rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md'>
          <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-success-light text-success'>
            <CheckCircle className='h-5 w-5' />
          </div>
          <p className='text-sm text-muted-foreground'>Selesai</p>
          <p className='font-heading text-3xl font-bold tabular-nums text-foreground'>
            {totalSelesai}
          </p>
        </div>

        <div className='rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md'>
          <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-info-light text-info'>
            <TrendingUp className='h-5 w-5' />
          </div>
          <p className='text-sm text-muted-foreground'>Diproses</p>
          <p className='font-heading text-3xl font-bold tabular-nums text-foreground'>
            {totalDiproses}
          </p>
        </div>

        <div className='rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md'>
          <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-warning-light text-warning'>
            <Clock className='h-5 w-5' />
          </div>
          <p className='text-sm text-muted-foreground'>Menunggu</p>
          <p className='font-heading text-3xl font-bold tabular-nums text-foreground'>
            {totalPending}
          </p>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='rounded-lg border border-border bg-card p-6'>
          <h2 className='mb-6 font-heading text-lg font-semibold text-foreground'>
            Tren Permohonan (12 Bulan)
          </h2>
          {barData.length === 0 ? (
            <div className='flex h-60 items-center justify-center text-muted-foreground'>
              Belum ada data permohonan.
            </div>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <BarChart
                data={barData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
                <XAxis
                  dataKey='month'
                  tick={{ fontSize: 12 }}
                  stroke='var(--muted-foreground)'
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke='var(--muted-foreground)'
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey='total'
                  fill='#259148'
                  radius={[4, 4, 0, 0]}
                  name='Jumlah'
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className='rounded-lg border border-border bg-card p-6'>
          <h2 className='mb-6 font-heading text-lg font-semibold text-foreground'>
            Distribusi Status
          </h2>
          {pieData.length === 0 ? (
            <div className='flex h-60 items-center justify-center text-muted-foreground'>
              Belum ada data.
            </div>
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey='value'
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {perKategori.length > 0 && (
        <div className='rounded-lg border border-border bg-card p-6'>
          <h2 className='mb-6 font-heading text-lg font-semibold text-foreground'>
            Permohonan per Kategori
          </h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {perKategori.map((k, idx) => (
              <div
                key={k.kategori}
                className='flex items-center gap-4 rounded-lg border border-border p-4'
              >
                <div
                  className='flex h-10 w-10 items-center justify-center rounded-lg text-white'
                  style={{
                    backgroundColor:
                      KATEGORI_COLORS[idx % KATEGORI_COLORS.length],
                  }}
                >
                  {k.total}
                </div>
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    {KATEGORI_LABELS[k.kategori] ?? k.kategori}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {((k.total / ringkasan.total) * 100).toFixed(1)}% dari total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
