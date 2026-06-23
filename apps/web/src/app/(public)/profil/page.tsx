import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Users, Scale, FileCheck, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Profil PPID',
  description:
    'Profil Pejabat Pengelola Informasi dan Dokumentasi BAZNAS Kabupaten Cianjur. Kenali tugas, fungsi, dan komitmen kami.',
}

export default function ProfilPage() {
  return (
    <div className='container mx-auto max-w-7xl px-4 py-12'>
      <div className='mb-8'>
        <h1 className='mb-2 font-heading text-4xl font-bold tracking-tight text-foreground'>
          Profil PPID
        </h1>
        <p className='text-muted-foreground'>
          Kenali Pejabat Pengelola Informasi dan Dokumentasi BAZNAS Kabupaten
          Cianjur
        </p>
      </div>

      <section className='mb-12 rounded-lg border border-border bg-card p-8'>
        <h2 className='mb-4 font-heading text-2xl font-semibold text-foreground'>
          Tentang PPID
        </h2>
        <div className='prose max-w-none text-muted-foreground'>
          <p className='mb-4'>
            Pejabat Pengelola Informasi dan Dokumentasi (PPID) adalah pejabat
            yang diberi tugas untuk mengelola informasi dan dokumentasi di
            lingkungan Badan Amil Zakat Nasional (BAZNAS) Kabupaten Cianjur.
          </p>
          <p className='mb-4'>
            PPID memiliki tugas pokok Melaksanakan penyimpanan,
            pendokumentasian, penyediaan, dan/atau pemberian layanan informasi
            kepada pemohon informasi publik.PPID juga bertanggung jawab untuk
            memastikan bahwa setiap informasi publik dapat diakses oleh
            masyarakat sesuai dengan ketentuan Undang-Undang No. 14 Tahun 2008
            tentang Keterbukaan Informasi Publik.
          </p>
          <p>
            Melalui PPID ini, BAZNAS Kabupaten Cianjur berkomitmen untuk
            meningkatkan transparansi dan akuntabilitas dalam pengelolaan dana
            Zakat, Infak, dan Sedekah (ZIS) demi kepercayaan masyarakat.
          </p>
        </div>
      </section>

      <section className='mb-12'>
        <h2 className='mb-6 font-heading text-2xl font-semibold tracking-tight text-foreground'>
          Informasi profil
        </h2>
        <div className='grid gap-6 md:grid-cols-2'>
          <Link
            href='/profil/struktur-organisasi'
            className='group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md'
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary'>
              <Users className='h-6 w-6' />
            </div>
            <div className='flex-1'>
              <h3 className='mb-1 font-heading font-semibold text-foreground'>
                Struktur Organisasi
              </h3>
              <p className='text-sm text-muted-foreground'>
                Susunan organisasi dan tupoksi PPID BAZNAS
              </p>
            </div>
            <ChevronRight className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1' />
          </Link>

          <Link
            href='/profil/dasar-hukum'
            className='group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md'
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary'>
              <Scale className='h-6 w-6' />
            </div>
            <div className='flex-1'>
              <h3 className='mb-1 font-heading font-semibold text-foreground'>
                Dasar Hukum
              </h3>
              <p className='text-sm text-muted-foreground'>
                Landasan hukum pengelolaan informasi publik
              </p>
            </div>
            <ChevronRight className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1' />
          </Link>

          <Link
            href='/profil/maklumat-pelayanan'
            className='group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md'
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary'>
              <FileCheck className='h-6 w-6' />
            </div>
            <div className='flex-1'>
              <h3 className='mb-1 font-heading font-semibold text-foreground'>
                Maklumat Pelayanan
              </h3>
              <p className='text-sm text-muted-foreground'>
                Standar pelayanan informasi publik PPID
              </p>
            </div>
            <ChevronRight className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1' />
          </Link>

          <div className='flex items-center gap-4 rounded-lg border border-border bg-card p-6'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary'>
              <Shield className='h-6 w-6' />
            </div>
            <div className='flex-1'>
              <h3 className='mb-1 font-heading font-semibold text-foreground'>
                Visi & Misi PPID
              </h3>
              <p className='text-sm text-muted-foreground'>
                Mewujudkan keterbukaan informasi publik yang optimal
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-lg bg-primary-light p-8'>
        <h2 className='mb-4 font-heading text-xl font-semibold text-foreground'>
          Tugas dan Fungsi PPID
        </h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <h3 className='mb-2 font-semibold text-foreground'>Tugas:</h3>
            <ul className='space-y-2 text-muted-foreground'>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Menyediakan dan memberi layanan informasi publik
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Melakukan dokumentasi dan penyimpanan informasi
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Melakukan verifikasi dan uji konsekuensi informasi
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-2 font-semibold text-foreground'>Fungsi:</h3>
            <ul className='space-y-2 text-muted-foreground'>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Mengkoordinasikan pengelolaan informasi di BAZNAS
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Memberikan laporan pelaksanaan pengelolaan informasi
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Meningkatkan kualitas layanan informasi kepada publik
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
