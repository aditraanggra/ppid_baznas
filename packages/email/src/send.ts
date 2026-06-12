import { render } from '@react-email/components'
import nodemailer, { type Transporter } from 'nodemailer'
import type * as React from 'react'

let cachedTransporter: Transporter | null = null

/**
 * Build (and cache) the SMTP transporter from env vars.
 * Env:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
 */
function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('[email] SMTP_HOST / SMTP_USER / SMTP_PASS belum di-set.')
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return cachedTransporter
}

export interface SendEmailInput {
  to:       string
  subject:  string
  template: React.ReactElement
}

/**
 * Render a React Email template to HTML and dispatch via SMTP.
 * Throws on failure — callers may choose to swallow or surface.
 */
export async function sendEmail({ to, subject, template }: SendEmailInput): Promise<void> {
  const html = await render(template)
  const text = await render(template, { plainText: true })

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM ?? 'noreply@baznas-cianjur.or.id',
    to,
    subject,
    html,
    text,
  })
}
