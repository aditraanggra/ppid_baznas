'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { TrackingForm } from '../tracking-form'

export default function TrackingDetailPage() {
  const params = useParams()
  const nomorTiket = params.nomorTiket as string

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
          Lacak Permohonan
        </h1>
        <p className="text-muted-foreground">
          Masukkan email yang digunakan saat mengajukan permohonan untuk melihat status.
        </p>
      </div>
      <TrackingFormWithTicket defaultTicket={nomorTiket} />
    </div>
  )
}

function TrackingFormWithTicket({ defaultTicket }: { defaultTicket: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="h-40 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return <TrackingForm defaultTicket={defaultTicket} />
}
