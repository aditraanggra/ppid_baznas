import type { Metadata } from 'next'
import { PermohonanForm } from './permohonan-form'

export const metadata: Metadata = {
  title: 'Ajukan Permohonan Informasi',
  description:
    'Ajukan permohonan informasi publik BAZNAS Kabupaten Cianjur secara online.',
}

export default function PermohonanPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
          Ajukan Permohonan Informasi
        </h1>
        <p className="text-muted-foreground">
          Lengkapi formulir berikut untuk mengajukan permohonan informasi publik
        </p>
      </div>
      <PermohonanForm />
    </div>
  )
}
