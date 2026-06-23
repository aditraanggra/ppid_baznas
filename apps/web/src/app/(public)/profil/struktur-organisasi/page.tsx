import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Struktur Organisasi PPID',
  description: 'Susunan struktur organisasi PPID BAZNAS Kabupaten Cianjur.',
}

interface OfficialCard {
  nama: string
  jabatanPPID: string
  jabatanInstitusi: string
}

const pejabat: OfficialCard[] = [
  {
    nama: 'Ketua BAZNAS Kab. Cianjur',
    jabatanPPID: 'Atasan PPID',
    jabatanInstitusi: 'Ketua BAZNAS Kabupaten Cianjur',
  },
  {
    nama: 'Wakil Ketua Bidang',
    jabatanPPID: 'PPID Utama',
    jabatanInstitusi: 'Wakil Ketua Bidang Administrasi, SDM, dan Umum',
  },
  {
    nama: 'Kepala Bagian Umum',
    jabatanPPID: 'PPID Pelaksana',
    jabatanInstitusi: 'Kepala Bagian Umum',
  },
]

export default function StrukturOrganisasiPage() {
  return (
    <div className='container mx-auto max-w-7xl px-4 py-12'>
      <nav className='mb-6 flex items-center gap-2 text-sm text-muted-foreground'>
        <Link href='/profil' className='hover:text-primary'>
          Profil
        </Link>
        <span>/</span>
        <span className='text-foreground'>Struktur Organisasi</span>
      </nav>

      <div className='mb-8'>
        <h1 className='mb-2 font-heading text-4xl font-bold text-foreground'>
          Struktur Organisasi PPID
        </h1>
        <p className='text-muted-foreground'>
          Susunan organisasi Pejabat Pengelola Informasi dan Dokumentasi BAZNAS
          Kabupaten Cianjur
        </p>
      </div>

      <section className='mb-12'>
        <h2 className='mb-6 font-heading text-2xl font-semibold text-foreground'>
          Pejabat PPID
        </h2>
        <div className='flex flex-col items-center gap-6'>
          {pejabat.map((p, idx) => (
            <div key={idx} className='w-full max-w-lg'>
              {idx > 0 && <div className='mx-auto mb-4 h-8 w-px bg-border' />}
              <div className='rounded-lg border border-border bg-card p-6 text-center'>
                <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light'>
                  <span className='font-heading text-xl font-bold text-primary'>
                    {idx + 1}
                  </span>
                </div>
                <p className='mb-1 font-heading text-lg font-semibold text-foreground'>
                  {p.nama}
                </p>
                <p className='mb-2 text-sm font-medium text-primary'>
                  {p.jabatanPPID}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {p.jabatanInstitusi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='rounded-lg border border-border bg-card p-8'>
        <h2 className='mb-4 font-heading text-2xl font-semibold text-foreground'>
          Dasar Pembentukan
        </h2>
        <p className='text-muted-foreground'>
          Struktur organisasi PPID BAZNAS Kabupaten Cianjur dibentuk berdasarkan
          Peraturan Komisi Informasi Publik Nomor 1 Tahun 2021 tentang Standar
          Layanan Informasi Publik pada Badan Publik, serta Surat Keputusan
          Ketua BAZNAS Kabupaten Cianjur.
        </p>
      </section>
    </div>
  )
}
