'use client'

import { useEffect } from 'react'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@ppid/ui'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
            <h2 className="mb-2 text-2xl font-bold">Terjadi Kesalahan Sistem</h2>
            <p className="mb-6 text-muted-foreground">
              Maaf, terjadi kesalahan pada sistem. Silakan coba lagi atau hubungi administrator.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={reset} variant="default">
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
      </body>
    </html>
  )
}
