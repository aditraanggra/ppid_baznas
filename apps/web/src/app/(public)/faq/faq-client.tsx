'use client'

import { useState } from 'react'
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

export function FAQClient({ items }: Props) {
  const [selectedKategori, setSelectedKategori] = useState<string>('semua')

  const kategoris = Array.from(new Set(items.map((item) => item.kategori)))

  const filtered =
    selectedKategori === 'semua'
      ? items
      : items.filter((item) => item.kategori === selectedKategori)

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter kategori FAQ"
      >
        <button
          onClick={() => setSelectedKategori('semua')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
            selectedKategori === 'semua'
              ? 'bg-primary text-white shadow-sm'
              : 'border border-border bg-background text-foreground hover:border-primary/50 hover:text-primary'
          }`}
          aria-pressed={selectedKategori === 'semua'}
        >
          Semua ({items.length})
        </button>
        {kategoris.map((k) => {
          const count = items.filter((i) => i.kategori === k).length
          return (
            <button
              key={k}
              onClick={() => setSelectedKategori(k)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                selectedKategori === k
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-border bg-background text-foreground hover:border-primary/50 hover:text-primary'
              }`}
              aria-pressed={selectedKategori === k}
            >
              {KATEGORI_LABELS[k] ?? k} ({count})
            </button>
          )
        })}
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {filtered.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 hover:border-primary/30 data-[state=open]:border-primary/25"
          >
            <AccordionTrigger className="gap-4 px-5 py-5 font-heading font-semibold text-foreground hover:no-underline data-[state=open]:text-primary">
              <span className="min-w-0 flex-1 text-left text-[0.9375rem] leading-snug">{item.pertanyaan}</span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="border-t border-border pt-4">
                <span className="mb-2.5 inline-block rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
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
    </div>
  )
}
