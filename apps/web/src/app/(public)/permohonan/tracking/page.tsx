import type { Metadata } from 'next'
import { TrackingForm } from './tracking-form'

export const metadata: Metadata = {
  title: 'Lacak Permohonan',
  description: 'Lacak status permohonan informasi publik BAZNAS Kabupaten Cianjur.',
}

export default function TrackingPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
          Lacak Permohonan
        </h1>
        <p className="text-muted-foreground">
          Masukkan nomor tiket dan email Anda untuk melihat status permohonan
        </p>
      </div>
      <TrackingForm />
    </div>
  )
}
