import { FileQuestion, Home } from 'lucide-react'
import { Button } from '@ppid/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <FileQuestion className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Halaman Tidak Ditemukan</h2>
        <p className="mb-6 text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>
        <Button asChild variant="default">
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </a>
        </Button>
      </div>
    </div>
  )
}
