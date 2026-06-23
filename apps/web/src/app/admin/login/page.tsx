'use client'

import { useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { Button, Input, Label } from '@ppid/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ppid/ui'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin'
  const error = searchParams.get('error')
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setFormError('Email atau password salah. Silakan coba lagi.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark p-12 text-white md:flex md:flex-col md:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
            <span className="text-lg font-bold font-heading">P</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">PPID BAZNAS</p>
            <p className="text-xs text-white/70">Kabupaten Cianjur</p>
          </div>
        </div>

        <div className="relative space-y-4">
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-[-0.02em] lg:text-4xl" style={{ textWrap: 'balance' }}>
            Panel Administrasi
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-white/80">
            Kelola permohonan informasi publik dan jalankan tugas administrasi PPID BAZNAS Kabupaten Cianjur.
          </p>
        </div>

        <p className="relative text-xs text-white/50">
          &copy; {new Date().getFullYear()} BAZNAS Kabupaten Cianjur
        </p>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-8">
        <Card className="w-full max-w-[400px] border-border shadow-sm">
          <CardHeader className="space-y-1 pb-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white md:hidden">
              <span className="text-xl font-bold font-heading">P</span>
            </div>
            <CardTitle className="text-xl font-heading">Masuk ke Panel Admin</CardTitle>
            <CardDescription>
              Gunakan akun administrasi Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(formError || error) && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError || 'Sesi berakhir. Silakan login kembali.'}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  ref={emailRef}
                  type="email"
                  placeholder="admin@baznas-cianjur.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    tabIndex={0}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Masuk
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
