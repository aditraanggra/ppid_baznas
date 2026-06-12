import * as React from 'react'
import {
  Html, Head, Preview, Body, Container, Section, Heading, Text, Hr, Link,
} from '@react-email/components'

export interface KonfirmasiPermohonanProps {
  namaPemohon: string
  nomorTiket:  string
  trackingUrl: string
}

/**
 * Email sent immediately after a permohonan is submitted.
 * Contains the nomor tiket the pemohon will use to track status.
 */
export function KonfirmasiPermohonan({
  namaPemohon,
  nomorTiket,
  trackingUrl,
}: KonfirmasiPermohonanProps): JSX.Element {
  return (
    <Html lang="id">
      <Head />
      <Preview>Permohonan informasi Anda telah kami terima — {nomorTiket}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>PPID BAZNAS Kabupaten Cianjur</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Permohonan Diterima</Heading>
            <Text style={p}>Yth. <strong>{namaPemohon}</strong>,</Text>
            <Text style={p}>
              Terima kasih telah mengajukan permohonan informasi publik kepada PPID BAZNAS
              Kabupaten Cianjur. Permohonan Anda telah kami terima dan akan segera divalidasi
              oleh petugas (paling lambat 1 hari kerja).
            </Text>

            <Section style={tiketBox}>
              <Text style={tiketLabel}>Nomor Tiket Permohonan</Text>
              <Text style={tiketNomor}>{nomorTiket}</Text>
            </Section>

            <Text style={p}>
              Simpan nomor tiket di atas. Gunakan untuk memantau status permohonan Anda melalui
              tautan berikut:
            </Text>
            <Link href={trackingUrl} style={btn}>Cek Status Permohonan</Link>

            <Hr style={hr} />
            <Text style={pSmall}>
              Sesuai UU No.14/2008 tentang Keterbukaan Informasi Publik, jawaban akan kami
              berikan paling lambat <strong>10 hari kerja</strong> sejak permohonan divalidasi.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Email ini dibuat otomatis. Mohon tidak membalas email ini.
              <br />Hubungi: ppid@baznas-cianjur.or.id
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/* ---------- styles (inline because email clients ignore <style>) ---------- */
const body      = { backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '20px' }
const header    = { backgroundColor: '#259148', padding: '24px', borderRadius: '8px 8px 0 0' }
const h1        = { color: '#ffffff', fontSize: '20px', margin: 0, textAlign: 'center' as const }
const content   = { backgroundColor: '#ffffff', padding: '32px 24px' }
const h2        = { color: '#145c2e', fontSize: '24px', marginTop: 0 }
const p         = { color: '#1a1a1a', fontSize: '15px', lineHeight: '24px', margin: '12px 0' }
const pSmall    = { color: '#4a4a4a', fontSize: '13px', lineHeight: '20px', margin: '12px 0' }
const tiketBox    = { backgroundColor: '#e8f5ee', padding: '20px', borderRadius: '8px', textAlign: 'center' as const, margin: '20px 0' }
const tiketLabel  = { color: '#4a4a4a', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: 0 }
const tiketNomor  = { color: '#145c2e', fontSize: '24px', fontWeight: 'bold' as const, margin: '8px 0 0 0', fontFamily: 'monospace' }
const btn         = { display: 'inline-block', backgroundColor: '#259148', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' as const, margin: '8px 0' }
const hr          = { borderColor: '#dddddd', margin: '24px 0' }
const footer      = { backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '0 0 8px 8px', textAlign: 'center' as const }
const footerText  = { color: '#4a4a4a', fontSize: '12px', margin: 0, lineHeight: '18px' }
