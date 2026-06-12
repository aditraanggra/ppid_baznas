'use client'

import { Toaster as SonnerToaster, toast } from 'sonner'

/**
 * Mount once in the root layout: <Toaster />.
 * Use anywhere via: toast.success('Berhasil'), toast.error('Gagal'), etc.
 */
export function Toaster(): JSX.Element {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
    />
  )
}

export { toast }
