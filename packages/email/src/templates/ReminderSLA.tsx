import * as React from 'react'
import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Link,
} from '@react-email/components'

export interface ReminderSLAProps {
  namaAdmin:    string
  nomorTiket:   string
  namaPemohon:  string
  deadline:     string  // formatted dd MMM yyyy
  jenisReminder: 'h-2' | 'h-0' | 'overdue'
  detailUrl:    string
}

/**
 * SLA reminder sent to the assigned admin.
 *   - h-2: 2 working days before deadline
 *   - h-0: on the deadline day
 *   - overdue: every day after deadline (escalated to super_admin)
 */
export function ReminderSLA({
  namaAdmin,
  nomorTiket,
  namaPemohon,
  deadline,
  jenisReminder,
  detailUrl,
}: ReminderSLAProps): JSX.Element {
  const config = {
    'h-2':    { color: '#fdc727', title: 'Pengingat SLA: 2 Hari Kerja Lagi',     urgency: 'Pengingat' },
    'h-0':    { color: '#dc2626', title: 'Deadline Hari Ini',                     urgency: 'Mendesak' },
    'overdue': { color: '#7f1d1d', title: 'Permohonan Melewati Batas Waktu',      urgency: 'Sudah Lewat' },
  }[jenisReminder]

  return (
    <Html lang="id">
      <Head />
      <Preview>{config.title} — Permohonan {nomorTiket}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={{ ...header, backgroundColor: config.color }}>
            <Text style={badge}>{config.urgency}</Text>
            <Heading style={h1}>{config.title}</Heading>
          </Section>

          <Section style={content}>
            <Text style={p}>Halo <strong>{namaAdmin}</strong>,</Text>
            <Text style={p}>
              Permohonan berikut memerlukan tindak lanjut Anda:
            </Text>

            <Section style={infoBox}>
              <Text style={infoRow}><strong>Nomor Tiket:</strong> {nomorTiket}</Text>
              <Text style={infoRow}><strong>Pemohon:</strong> {namaPemohon}</Text>
              <Text style={infoRow}><strong>Deadline:</strong> {deadline}</Text>
            </Section>

            <Link href={detailUrl} style={btn}>Buka Permohonan</Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body      = { backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '20px' }
const header    = { padding: '24px', borderRadius: '8px 8px 0 0' }
const badge     = { color: '#ffffff', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '2px', margin: 0, opacity: 0.9 }
const h1        = { color: '#ffffff', fontSize: '20px', margin: '8px 0 0 0' }
const content   = { backgroundColor: '#ffffff', padding: '32px 24px' }
const p         = { color: '#1a1a1a', fontSize: '15px', lineHeight: '24px', margin: '12px 0' }
const infoBox   = { backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '6px', margin: '20px 0' }
const infoRow   = { color: '#1a1a1a', fontSize: '14px', margin: '6px 0' }
const btn       = { display: 'inline-block', backgroundColor: '#259148', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' as const }
