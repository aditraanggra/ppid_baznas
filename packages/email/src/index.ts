import * as React from 'react'
import { sendEmail } from './send'
import { KonfirmasiPermohonan } from './templates/KonfirmasiPermohonan'
import { ReminderSLA, type ReminderSLAProps } from './templates/ReminderSLA'

export { sendEmail } from './send'
export { KonfirmasiPermohonan } from './templates/KonfirmasiPermohonan'
export { ReminderSLA }          from './templates/ReminderSLA'

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

export interface SendEmailKonfirmasiInput {
  to:          string
  namaPemohon: string
  nomorTiket:  string
}

/**
 * Convenience wrapper used by permohonanRouter.submit.
 * Builds the tracking URL automatically from NEXT_PUBLIC_APP_URL.
 */
export async function sendEmailKonfirmasi(input: SendEmailKonfirmasiInput): Promise<void> {
  const trackingUrl = `${getAppUrl()}/permohonan/tracking/${encodeURIComponent(input.nomorTiket)}`

  await sendEmail({
    to:       input.to,
    subject:  `Permohonan Diterima — ${input.nomorTiket}`,
    template: React.createElement(KonfirmasiPermohonan, {
      namaPemohon: input.namaPemohon,
      nomorTiket:  input.nomorTiket,
      trackingUrl,
    }),
  })
}

export interface SendEmailReminderSLAInput {
  to:           string
  namaAdmin:    string
  nomorTiket:   string
  namaPemohon:  string
  deadline:     string
  jenisReminder: ReminderSLAProps['jenisReminder']
  permohonanId: string
}

/** Used by the SLA cron job (TASK-027). */
export async function sendEmailReminderSLA(input: SendEmailReminderSLAInput): Promise<void> {
  const detailUrl = `${getAppUrl()}/admin/permohonan/${input.permohonanId}`

  const subjectMap: Record<ReminderSLAProps['jenisReminder'], string> = {
    'h-2':    `Pengingat SLA (H-2) — ${input.nomorTiket}`,
    'h-0':    `Deadline Hari Ini — ${input.nomorTiket}`,
    'overdue': `Permohonan Terlambat — ${input.nomorTiket}`,
  }

  await sendEmail({
    to:       input.to,
    subject:  subjectMap[input.jenisReminder],
    template: React.createElement(ReminderSLA, {
      namaAdmin:     input.namaAdmin,
      nomorTiket:    input.nomorTiket,
      namaPemohon:   input.namaPemohon,
      deadline:      input.deadline,
      jenisReminder: input.jenisReminder,
      detailUrl,
    }),
  })
}
