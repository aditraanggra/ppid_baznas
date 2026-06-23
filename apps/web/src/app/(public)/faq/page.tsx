import type { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, ArrowRight, MessageSquare } from 'lucide-react'
import { getFAQList } from '@/lib/payload'
import { FAQClient } from './faq-client'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Pertanyaan yang sering diajukan tentang layanan PPID BAZNAS Kabupaten Cianjur.',
}

export default async function FAQPage() {
  const items = await getFAQList()

  return (
    <div className='container mx-auto max-w-4xl px-4 py-16 lg:py-20'>
      <header className='mb-12'>
        <HelpCircle className='mb-4 h-6 w-6 text-primary' />
        <h1 className='text-balance font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className='mt-3 max-w-2xl text-muted-foreground'>
          Temukan jawaban atas pertanyaan umum seputar layanan PPID BAZNAS
          Kabupaten Cianjur.
        </p>
      </header>

      {items.length === 0 ? (
        <div className='rounded-lg border border-border px-8 py-16 text-center'>
          <HelpCircle className='mx-auto mb-4 h-10 w-10 text-muted-foreground' />
          <p className='font-heading text-lg font-semibold text-foreground'>
            Belum ada FAQ tersedia
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            Kami sedang menyiapkan jawaban untuk pertanyaan yang sering
            diajukan.
          </p>
        </div>
      ) : (
        <FAQClient items={items} />
      )}

      <div className='mt-16 border-t border-border pt-12'>
        <div className='flex flex-col items-start gap-6 rounded-lg border border-border bg-background p-8 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='font-heading text-lg font-semibold text-foreground'>
              Pertanyaan Anda belum terjawab?
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Hubungi kami atau ajukan permohonan informasi melalui formulir
              online.
            </p>
          </div>
          <div className='flex flex-shrink-0 flex-col gap-3 sm:flex-row'>
            <Link
              href='/kontak'
              className='group inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-nowrap text-sm font-medium text-foreground transition-all duration-200 hover:border-primary hover:text-primary'
            >
              Hubungi Kami
              <ArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1' />
            </Link>
            <Link
              href='/permohonan'
              className='inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-nowrap text-sm font-medium text-white transition-all duration-200 hover:bg-primary-dark'
            >
              <MessageSquare className='h-4 w-4' />
              Ajukan Permohonan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
