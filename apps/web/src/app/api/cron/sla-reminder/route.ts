import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@ppid/db'
import { sql } from 'drizzle-orm'
import { getSLAStatus } from '@/lib/sla'

interface ActiveRow {
  id: string
  nomor_tiket: string
  nama_pemohon: string
  email: string
  tanggal_deadline: Date
}

/**
 * SLA reminder cron endpoint.
 * Designed for external cron services (e.g. cron-job.org, Uptime Kuma).
 *
 * Security: protected by CRON_SECRET Bearer token.
 * Vercel users: configure vercel.json cron instead of calling this endpoint.
 *
 * Expected env vars:
 *   CRON_SECRET   — shared secret for authentication
 *   SMTP_*        — email configuration (forwarded to @ppid/email)
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get('Authorization')
  const secret = process.env.CRON_SECRET

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  const rows = await db.execute(sql`
    SELECT id, nomor_tiket, nama_pemohon, email, tanggal_deadline
    FROM permohonan
    WHERE tanggal_deadline IS NOT NULL
      AND status = 'diproses'
  `)

  const active = rows as unknown as ActiveRow[]

  const results: Array<{
    id: string
    nomorTiket: string
    slaStatus: string
    action: string
  }> = []

  for (const row of active) {
    const slaStatus = getSLAStatus(new Date(row.tanggal_deadline))
    let action = 'none'

    if (slaStatus === 'lewat') {
      action = 'escalate_overdue'
    } else if (slaStatus === 'hari_ini') {
      action = 'alert_deadline_today'
    } else if (slaStatus === 'mendekati') {
      action = 'reminder_approaching'
    }

    results.push({
      id:          row.id,
      nomorTiket: row.nomor_tiket,
      slaStatus,
      action,
    })

    if (action !== 'none') {
      await sendReminderEmail(row, slaStatus).catch((err) =>
        console.error('[cron] email gagal:', err),
      )
    }
  }

  return NextResponse.json({
    processed: results.length,
    timestamp: now.toISOString(),
    results,
  })
}

async function sendReminderEmail(
  row: ActiveRow,
  slaStatus: string,
): Promise<void> {
  const { sendEmailReminderSLA } = await import('@ppid/email')
  const jenisMap: Record<string, 'h-2' | 'h-0' | 'overdue'> = {
    mendekati: 'h-2',
    hari_ini:  'h-0',
    lewat:     'overdue',
  }
  const jenis = jenisMap[slaStatus]
  if (!jenis) return

  await sendEmailReminderSLA({
    to:           row.email,
    namaAdmin:    'Admin PPID',
    nomorTiket:   row.nomor_tiket,
    namaPemohon:  row.nama_pemohon,
    deadline:     new Date(row.tanggal_deadline).toISOString(),
    jenisReminder: jenis,
    permohonanId: row.id,
  })
}
