'use client'

import { trpc } from '@/lib/trpc/client'
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@ppid/ui'
import { StatsCard } from '@/components/admin/StatsCard'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
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

/**
 * Admin dashboard page.
 * Displays:
 *   - KPI stat cards (total, pending, diproses, selesai, ditolak)
 *   - Monthly trend bar chart
 *   - Status distribution pie chart
 */
export default function AdminDashboardPage() {
  const { data: ringkasan, isLoading: loadingRingkasan } =
    trpc.statistik.ringkasan.useQuery({})
  const { data: tren, isLoading: loadingTren } =
    trpc.statistik.trenBulanan.useQuery(undefined)

  const statusCounts = (ringkasan?.byStatus ?? []) as Array<{
    status: string
    total: number
  }>
  const total = ringkasan?.total ?? 0

  const getCount = (status: string) =>
    statusCounts.find((s) => s.status === status)?.total ?? 0

  const pieData = statusCounts.map((s) => ({
    name: formatStatusLabel(s.status),
    value: Number(s.total),
  }))

  const PIE_COLORS = [
    '#259148',
    '#1a5276',
    '#fdc727',
    '#e74c3c',
    '#8e44ad',
    '#f39c12',
    '#1abc9c',
    '#95a5a6',
  ]

  const barData = (tren ?? []).map((t) => ({
    month: formatMonth(t.month as string),
    total: Number(t.total),
  }))

  if (loadingRingkasan) {
    return (
      <div className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-32 w-full rounded-lg' />
          ))}
        </div>
        <Skeleton className='h-80 w-full rounded-lg' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold font-heading text-foreground'>
          Dashboard
        </h1>
        <p className='text-sm text-muted-foreground'>
          Ringkasan permohonan informasi publik PPID BAZNAS Kabupaten Cianjur.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Permohonan'
          value={total}
          icon={FileText}
          description='Seluruh permohonan masuk'
        />
        <StatsCard
          title='Menunggu Validasi'
          value={getCount('pending')}
          icon={Clock}
          description='Belum divalidasi admin'
          variant='warning'
        />
        <StatsCard
          title='Selesai'
          value={getCount('selesai')}
          icon={CheckCircle}
          description='Informasi telah diberikan'
          variant='success'
        />
        <StatsCard
          title='Ditolak'
          value={getCount('ditolak')}
          icon={XCircle}
          description='Ditolak dengan alasan'
          variant='danger'
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <TrendingUp className='h-4 w-4 text-primary' />
              Tren Permohonan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTren || !barData.length ? (
              <Skeleton className='h-64 w-full' />
            ) : (
              <ResponsiveContainer width='100%' height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis dataKey='month' tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '12px',
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <AlertTriangle className='h-4 w-4 text-primary' />
              Distribusi Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!pieData.length ? (
              <div className='flex h-64 items-center justify-center text-sm text-muted-foreground'>
                Belum ada data permohonan.
              </div>
            ) : (
              <ResponsiveContainer width='100%' height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey='value'
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {pieData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign='bottom'
                    height={36}
                    iconType='circle'
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Map status enum to a human-readable label in Bahasa Indonesia.
 */
function formatStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Menunggu',
    diterima: 'Diterima',
    klarifikasi: 'Klarifikasi',
    diproses: 'Diproses',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    perpanjangan: 'Perpanjangan',
    keberatan: 'Keberatan',
  }
  return labels[status] ?? status
}

/**
 * Format 'YYYY-MM' to a short month label like 'Jun 25'.
 */
function formatMonth(ym: string): string {
  const [year = '', month = '01'] = ym.split('-')
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
  return `${months[parseInt(month, 10) - 1]} '${year.slice(2)}`
}
