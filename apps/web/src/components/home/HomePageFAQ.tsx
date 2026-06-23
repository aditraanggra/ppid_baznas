'use client'

import type { FAQDoc } from '@/lib/payload'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ppid/ui'

const KATEGORI_LABELS: Record<string, string> = {
  umum: 'Umum',
  permohonan: 'Permohonan Informasi',
  zis: 'Penyaluran ZIS',
  keberatan: 'Pengaduan & Keberatan',
}

interface Props {
  items: FAQDoc[]
}

export function HomePageFAQ({ items }: Props) {
  return (
    <Accordion type="single" collapsible className="space-y-2.5">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="overflow-hidden rounded-lg border border-border bg-background transition-colors duration-200 hover:border-primary/30 data-[state=open]:border-primary/25"
        >
          <AccordionTrigger className="gap-4 px-5 py-[1.125rem] font-heading text-[0.9375rem] font-semibold leading-snug text-foreground hover:no-underline data-[state=open]:text-primary">
            <span className="min-w-0 flex-1 text-left">{item.pertanyaan}</span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="border-t border-border pt-4">
              <span className="mb-2.5 inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-[0.6875rem] font-semibold text-primary-dark">
                {KATEGORI_LABELS[item.kategori] ?? item.kategori}
              </span>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {item.jawaban}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
