import { Metadata } from 'next'
import Link from 'next/link'
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  Bot,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
} from 'lucide-react'
import { serverCaller } from '@/server/caller'
import DOMPurify from 'isomorphic-dompurify'
import {
  getDokumenPublikList,
  getFAQList,
  getSiteSettings,
} from '@/lib/payload'
import { HeroSection } from '@/components/home/HeroSection'
import { HomePageFAQ } from '@/components/home/HomePageFAQ'
import { PengaduanForm } from '@/components/home/PengaduanForm'
import { InformasiPublikCards } from '@/components/home/InformasiPublikCards'

export const metadata: Metadata = {
  title: 'Beranda',
  description:
    'PPID BAZNAS Kabupaten Cianjur - Layanan informasi publik transparan dan akuntabel. Ajukan permohonan informasi, akses dokumen publik, dan pantau status permohonan Anda.',
  openGraph: {
    title: 'PPID BAZNAS Kabupaten Cianjur',
    description:
      'Layanan informasi publik BAZNAS Kabupaten Cianjur yang transparan dan akuntabel.',
  },
}

interface StatusCount {
  status: string
  total: number
}

export default async function BerandaPage() {
  const caller = await serverCaller()
  const rawStats = await caller.statistik.ringkasan({})
  const stats = rawStats as unknown as {
    total: number
    byStatus: StatusCount[]
  }

  const totalSelesai =
    stats.byStatus.find((s) => s.status === 'selesai')?.total ?? 0
  const persentase =
    stats.total > 0 ? Math.round((totalSelesai / stats.total) * 100) : 0

  const [berkala, sertaMerta, setiapSaat] = await Promise.all([
    getDokumenPublikList({ kategoriInformasi: 'berkala', limit: 50 }),
    getDokumenPublikList({ kategoriInformasi: 'serta_merta', limit: 50 }),
    getDokumenPublikList({ kategoriInformasi: 'setiap_saat', limit: 50 }),
  ])

  const faqItems = await getFAQList()
  const settings = await getSiteSettings()

  return (
    <div>
      <HeroSection
        totalPermohonan={stats.total}
        totalSelesai={totalSelesai}
        persentase={persentase}
      />

      <section className='bg-background py-20'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <h2 className='mb-2 text-balance font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
                Daftar Informasi Publik
              </h2>
              <p className='text-muted-foreground'>
                Akses informasi publik BAZNAS Kabupaten Cianjur sesuai UU KIP
                No.14/2008
              </p>
            </div>
            <Link
              href='/informasi-publik'
              className='inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all hover:gap-2.5'
            >
              Lihat semua dokumen
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <InformasiPublikCards
            berkalaCount={berkala.totalDocs}
            sertaMertaCount={sertaMerta.totalDocs}
            setiapSaatCount={setiapSaat.totalDocs}
          />
        </div>
      </section>

      <section className='bg-surface/50 py-24'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='grid gap-16 lg:grid-cols-5'>
            <div className='lg:col-span-2'>
              <div className='flex flex-col items-start gap-5'>
                <h2 className='text-balance font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
                  Pertanyaan yang Sering Diajukan
                </h2>
                <p className='max-w-md text-pretty text-base leading-relaxed text-muted-foreground'>
                  Temukan jawaban atas pertanyaan umum seputar layanan PPID
                  BAZNAS Kabupaten Cianjur.
                </p>
                <Link
                  href='/faq'
                  className='group inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary hover:text-primary'
                >
                  Lihat semua FAQ
                  <ArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Link>
              </div>
            </div>

            <div className='lg:col-span-3'>
              {faqItems.length === 0 ? (
                <div className='rounded-lg border border-border bg-background px-8 py-14 text-center'>
                  <HelpCircle className='mx-auto mb-4 h-10 w-10 text-muted-foreground' />
                  <p className='font-heading text-base font-semibold text-foreground'>
                    Belum ada FAQ tersedia
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Kami sedang menyiapkan jawaban untuk pertanyaan yang sering
                    diajukan.
                  </p>
                </div>
              ) : (
                <HomePageFAQ items={faqItems} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='bg-background py-20'>
        <div className='container mx-auto max-w-4xl px-4'>
          <div className='mb-10 text-center'>
            <h2 className='mb-2 text-balance font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
              Pengaduan Online
            </h2>
            <p className='text-muted-foreground'>
              Sampaikan pengaduan Anda terkait layanan PPID BAZNAS Kabupaten
              Cianjur
            </p>
          </div>

          <div className='rounded-xl border border-border bg-card p-6 md:p-8'>
            <PengaduanForm />
          </div>
        </div>
      </section>

      <section className='bg-surface/30 py-24'>
        <div className='container mx-auto max-w-7xl px-4'>
          <div className='mb-12 text-center'>
            <h2 className='mb-2 text-balance font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
              Hubungi Kami
            </h2>
            <p className='text-muted-foreground'>
              Hubungi kami untuk informasi lebih lanjut atau kunjungi kantor
              PPID BAZNAS
            </p>
          </div>

          <div className='grid gap-6 lg:grid-cols-2'>
            <div className='space-y-5'>
              <div className='rounded-lg border border-border bg-card p-6'>
                <h3 className='mb-5 font-heading text-lg font-semibold text-foreground'>
                  Informasi Kontak
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                      <MapPin className='h-5 w-5' />
                    </div>
                    <div className='flex-1'>
                      <p className='mb-1 text-sm font-medium text-foreground'>
                        Alamat
                      </p>
                      <p
                        className='text-sm leading-relaxed text-muted-foreground'
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            settings?.alamat ??
                              'Jl.Raya Bandung No.108B, Cianjur, Jawa Barat 43281',
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                      <Phone className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='mb-1 text-sm font-medium text-foreground'>
                        Telepon
                      </p>
                      <p
                        className='text-sm text-muted-foreground'
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            settings?.telepon ?? '(0263) 264-847',
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                      <Mail className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='mb-1 text-sm font-medium text-foreground'>
                        Email
                      </p>
                      <p
                        className='text-sm text-muted-foreground'
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            settings?.email ?? 'baznaskab.cianjur@baznas.go.id',
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                      <Clock className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-foreground'>
                        Jam Pelayanan
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {settings?.jamPelayanan ??
                          'Senin - Jumat, 08.00 - 16.00 WIB'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-5'>
              <div className='overflow-hidden rounded-lg border border-border'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d591.28622969782!2d107.15315918212897!3d-6.808455078067625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68531c7a6d2045%3A0x1f114ecfb2eb15d!2sBAZNAS%20Kabupaten%20Cianjur!5e1!3m2!1sen!2sid!4v1781754112765!5m2!1sen!2sid'
                  width='100%'
                  height='400'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Lokasi PPID BAZNAS Kabupaten Cianjur'
                />
              </div>

              <div className='rounded-lg border border-primary/20 bg-primary-light p-6'>
                <h3 className='mb-3 font-heading text-lg font-semibold text-foreground'>
                  Cara Menghubungi Kami
                </h3>
                <ul className='space-y-2.5 text-sm text-foreground'>
                  <li className='flex items-start gap-2.5'>
                    <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                    Kunjungi kantor PPID BAZNAS Kabupaten Cianjur pada jam
                    pelayanan
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                    Hubungi via telepon atau email untuk konsultasi
                  </li>
                  <li className='flex items-start gap-2.5'>
                    <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                    Ajukan permohonan informasi melalui formulir online di{' '}
                    <a
                      href='/permohonan'
                      className='font-medium text-primary hover:underline'
                    >
                      halaman permohonan
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary-dark hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        aria-label='Asisten AI'
        title='Asisten AI'
      >
        <Bot className='h-6 w-6' />
      </button>
    </div>
  )
}
