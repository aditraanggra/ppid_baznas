'use client'

import { useEffect } from 'react'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@ppid/ui'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Public route error:', error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h2 className="mb-2 text-2xl font-bold">Terjadi Kesalahan</h2>
        <p className="mb-6 text-muted-foreground">
          Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
          <Button asChild variant="outline">
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
