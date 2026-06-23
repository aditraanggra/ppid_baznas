import type { Metadata } from 'next'
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react'
import { getSiteSettings } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Kontak dan lokasi PPID BAZNAS Kabupaten Cianjur.',
}

export default async function KontakPage() {
  const settings = await getSiteSettings()

  return (
    <div className='container mx-auto max-w-7xl px-4 py-12'>
      <div className='mb-8'>
        <h1 className='mb-2 font-heading text-4xl font-bold text-foreground'>
          Kontak & Lokasi
        </h1>
        <p className='text-muted-foreground'>
          Hubungi kami untuk informasi lebih lanjut atau kunjungi kantor PPID
          BAZNAS
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='space-y-6'>
          <div className='rounded-lg border border-border bg-card p-6'>
            <h2 className='mb-4 font-heading text-xl font-semibold text-foreground'>
              Informasi Kontak
            </h2>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                  <MapPin className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-foreground'>Alamat</p>
                  <p className='text-sm text-muted-foreground'>
                    {settings?.alamat ??
                      'Jl. Siliwangi No. 123, Cianjur, Jawa Barat 43211'}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                  <Phone className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-foreground'>Telepon</p>
                  <p className='text-sm text-muted-foreground'>
                    {settings?.telepon ?? '(0263) 123-4567'}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                  <Mail className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-medium text-foreground'>Email</p>
                  <p className='text-sm text-muted-foreground'>
                    {settings?.email ?? 'ppid@baznas-cianjur.or.id'}
                  </p>
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

          {settings?.sosialMedia && (
            <div className='rounded-lg border border-border bg-card p-6'>
              <h2 className='mb-4 font-heading text-xl font-semibold text-foreground'>
                Media Sosial
              </h2>
              <div className='flex gap-3'>
                {settings.sosialMedia.facebook && (
                  <a
                    href={settings.sosialMedia.facebook}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                    aria-label='Facebook'
                  >
                    <Facebook className='h-5 w-5' />
                  </a>
                )}
                {settings.sosialMedia.instagram && (
                  <a
                    href={settings.sosialMedia.instagram}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                    aria-label='Instagram'
                  >
                    <Instagram className='h-5 w-5' />
                  </a>
                )}
                {settings.sosialMedia.youtube && (
                  <a
                    href={settings.sosialMedia.youtube}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                    aria-label='YouTube'
                  >
                    <Youtube className='h-5 w-5' />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className='space-y-6'>
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

          <div className='rounded-lg bg-primary-light p-6'>
            <h3 className='mb-3 font-heading text-lg font-semibold text-foreground'>
              Cara Menghubungi Kami
            </h3>
            <ul className='space-y-2 text-sm text-foreground'>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Kunjungi kantor PPID BAZNAS Kabupaten Cianjur pada jam pelayanan
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                Hubungi via telepon atau email untuk konsultasi
              </li>
              <li className='flex items-start gap-2'>
                <span className='mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
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
  )
}
