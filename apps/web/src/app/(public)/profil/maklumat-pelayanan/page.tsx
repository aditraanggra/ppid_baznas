import type { Metadata } from 'next'
import { getMaklumat } from '@/lib/payload'
import { renderLexical } from '@/lib/lexical'

export const metadata: Metadata = {
  title: 'Maklumat Pelayanan',
  description: 'Maklumat Pelayanan PPID BAZNAS Kabupaten Cianjur.',
}

export default async function MaklumatPage() {
  const maklumat = await getMaklumat()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/profil" className="hover:text-primary">
          Profil
        </a>
        <span>/</span>
        <span className="text-foreground">Maklumat Pelayanan</span>
      </nav>

      <div className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
          Maklumat Pelayanan PPID
        </h1>
        <p className="text-muted-foreground">
          Pernyataan komitmen PPID BAZNAS Kabupaten Cianjur terhadap pelayanan informasi publik
        </p>
      </div>

      {!maklumat ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Maklumat pelayanan belum tersedia. Silakan hubungi kami untuk informasi lebih lanjut.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 text-sm text-muted-foreground">
              Ditetapkan pada:{' '}
              <span className="font-medium text-foreground">
                {new Date(maklumat.tanggalDitetapkan).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="prose max-w-none">{renderLexical(maklumat.isi)}</div>
          </div>

          <div className="rounded-lg border border-border bg-primary-light p-8">
            <div className="text-center">
              <p className="mb-2 text-sm text-muted-foreground">Ditetapkan oleh:</p>
              <p className="font-heading text-lg font-semibold text-foreground">
                {maklumat.penandatangan.nama}
              </p>
              <p className="text-sm text-muted-foreground">
                {maklumat.penandatangan.jabatan}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
