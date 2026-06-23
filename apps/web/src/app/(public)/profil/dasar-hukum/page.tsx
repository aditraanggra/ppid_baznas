import type { Metadata } from 'next'
import Link from 'next/link'
import { Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dasar Hukum PPID',
  description:
    'Landasan hukum pengelolaan informasi publik PPID BAZNAS Kabupaten Cianjur.',
}

interface DasarHukum {
  judul: string
  tentang: string
  tahun: string
}

const peraturan: DasarHukum[] = [
  {
    judul: 'Undang-Undang Nomor 14 Tahun 2008',
    tentang: 'Keterbukaan Informasi Publik',
    tahun: '2008',
  },
  {
    judul: 'Undang-Undang Nomor 23 Tahun 2011',
    tentang: 'Pengelolaan Zakat',
    tahun: '2011',
  },
  {
    judul: 'Peraturan Pemerintah Nomor 61 Tahun 2010',
    tentang:
      'Pelaksanaan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik',
    tahun: '2010',
  },
  {
    judul: 'Peraturan Pemerintah Nomor 14 Tahun 2014',
    tentang: 'Pelaksanaan UU No. 23 Tahun 2011 tentang Pengelolaan Zakat',
    tahun: '2014',
  },
  {
    judul: 'Peraturan Komisi Informasi Nomor 1 Tahun 2021',
    tentang: 'Standar Layanan Informasi Publik pada Badan Publik',
    tahun: '2021',
  },
  {
    judul: 'Peraturan BAZNAS Nomor 1 Tahun 2016',
    tentang: 'Pedoman Penyusunan Rencana Strategis BAZNAS',
    tahun: '2016',
  },
  {
    judul: 'Surat Keputusan Ketua BAZNAS Kab. Cianjur',
    tentang: 'Penunjukan Pejabat Pengelola Informasi dan Dokumentasi',
    tahun: '—',
  },
]

export default function DasarHukumPage() {
  return (
    <div className='container mx-auto max-w-7xl px-4 py-12'>
      <nav className='mb-6 flex items-center gap-2 text-sm text-muted-foreground'>
        <Link href='/profil' className='hover:text-primary'>
          Profil
        </Link>
        <span>/</span>
        <span className='text-foreground'>Dasar Hukum</span>
      </nav>

      <div className='mb-8'>
        <h1 className='mb-2 font-heading text-4xl font-bold text-foreground'>
          Dasar Hukum
        </h1>
        <p className='text-muted-foreground'>
          Landasan hukum penyelenggaraan layanan informasi publik PPID BAZNAS
          Kabupaten Cianjur
        </p>
      </div>

      <section className='space-y-4'>
        {peraturan.map((item, idx) => (
          <div
            key={idx}
            className='flex items-start gap-4 rounded-lg border border-border bg-card p-6'
          >
            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
              <Scale className='h-6 w-6' />
            </div>
            <div className='flex-1'>
              <h3 className='mb-1 font-heading font-semibold text-foreground'>
                {item.judul}
              </h3>
              <p className='text-sm text-muted-foreground'>
                Tentang{' '}
                <span className='font-medium text-foreground'>
                  {item.tentang}
                </span>
              </p>
            </div>
            <span className='hidden flex-shrink-0 rounded-md bg-primary-light px-3 py-1 text-sm font-medium text-primary md:inline-block'>
              {item.tahun}
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
