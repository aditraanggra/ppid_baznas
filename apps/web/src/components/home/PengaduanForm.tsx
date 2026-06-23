'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
import { Upload, X, FileText, Check, MessageSquare } from 'lucide-react'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

const formSchema = z.object({
  nama:         z.string().min(3, 'Nama minimal 3 karakter').max(100),
  email:        z.string().email('Format email tidak valid'),
  nomorTelepon: z.string().max(15).optional(),
  kategori:     z.enum(['pelayanan', 'penyaluran_zis', 'keberatan', 'lainnya']),
  subjek:       z.string().min(5, 'Subjek minimal 5 karakter').max(200),
  isiPengaduan: z.string().min(10, 'Isi pengaduan minimal 10 karakter').max(5000),
  lampiran:     z.instanceof(File).optional(),
})

type FormData = z.infer<typeof formSchema>

const KATEGORI_OPTIONS = [
  { value: 'pelayanan',      label: 'Pelayanan',        desc: 'Kualitas layanan PPID' },
  { value: 'penyaluran_zis', label: 'Penyaluran ZIS',   desc: 'Zakat, infak, sedekah' },
  { value: 'keberatan',      label: 'Keberatan',        desc: 'Keberatan atas informasi' },
  { value: 'lainnya',        label: 'Lainnya',          desc: 'Pengaduan umum lainnya' },
]

export function PengaduanForm() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [submittedTiket, setSubmittedTiket] = useState<string | null>(null)

  const submitMutation = trpc.pengaduan.submit.useMutation({
    onSuccess: (data) => {
      setSubmittedTiket(data.nomorTiket)
      toast.success('Pengaduan berhasil dikirim!')
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal mengirim pengaduan.')
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kategori: 'pelayanan',
    },
    mode: 'onBlur',
  })

  const watchedKategori = watch('kategori')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const f = e.target.files?.[0]
    if (!f) return
    if (!ALLOWED_FILE_TYPES.includes(f.type)) {
      setFileError('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.')
      return
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      setFileError('Ukuran file maksimal 5MB.')
      return
    }
    setFile(f)
    setValue('lampiran', f)
  }

  function removeFile() {
    setFile(null)
    setValue('lampiran', undefined as unknown as File)
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (submittedTiket) {
    return (
      <div className="rounded-2xl border border-success bg-success-light p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success">
          <Check className="h-8 w-8 text-success-foreground" />
        </div>
        <h3 className="mb-2 font-heading text-2xl font-bold tracking-tight text-foreground">
          Pengaduan berhasil dikirim
        </h3>
        <p className="mb-4 text-muted-foreground">
          Nomor tiket pengaduan Anda:
        </p>
        <p className="mb-4 font-mono text-3xl font-bold tabular-nums text-foreground">
          {submittedTiket}
        </p>
        <p className="text-sm text-muted-foreground">
          Simpan nomor tiket ini untuk melacak status pengaduan Anda.
          Tim kami akan segera menindaklanjuti.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await submitMutation.mutateAsync({
            ...data,
            lampiran: undefined,
          })
        } catch {
          // handled in onError
        }
      })}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="pengaduan-nama" className="mb-1 block text-sm font-medium text-foreground">
            Nama Lengkap <span className="text-destructive">*</span>
          </label>
          <input
            id="pengaduan-nama"
            {...register('nama')}
            placeholder="Nama lengkap Anda"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-invalid={!!errors.nama}
            aria-describedby={errors.nama ? 'err-pengaduan-nama' : undefined}
          />
          {errors.nama && (
            <p id="err-pengaduan-nama" className="mt-1 text-xs text-destructive" role="alert">
              {errors.nama.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="pengaduan-email" className="mb-1 block text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="pengaduan-email"
            type="email"
            {...register('email')}
            placeholder="email@contoh.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-pengaduan-email' : undefined}
          />
          {errors.email && (
            <p id="err-pengaduan-email" className="mt-1 text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="pengaduan-telepon" className="mb-1 block text-sm font-medium text-foreground">
            Nomor Telepon
          </label>
          <input
            id="pengaduan-telepon"
            type="tel"
            {...register('nomorTelepon')}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-invalid={!!errors.nomorTelepon}
            aria-describedby={errors.nomorTelepon ? 'err-pengaduan-telepon' : undefined}
          />
          {errors.nomorTelepon && (
            <p id="err-pengaduan-telepon" className="mt-1 text-xs text-destructive" role="alert">
              {errors.nomorTelepon.message}
            </p>
          )}
        </div>

        <div>
          <label id="label-pengaduan-kategori" className="mb-1 block text-sm font-medium text-foreground">
            Kategori Pengaduan <span className="text-destructive">*</span>
          </label>
          <select
            id="pengaduan-kategori"
            {...register('kategori')}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-labelledby="label-pengaduan-kategori"
            aria-invalid={!!errors.kategori}
          >
            {KATEGORI_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} — {opt.desc}
              </option>
            ))}
          </select>
          {errors.kategori && (
            <p className="mt-1 text-xs text-destructive" role="alert">
              {errors.kategori.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="pengaduan-subjek" className="mb-1 block text-sm font-medium text-foreground">
            Subjek Pengaduan <span className="text-destructive">*</span>
          </label>
          <input
            id="pengaduan-subjek"
            {...register('subjek')}
            placeholder="Ringkasan singkat pengaduan Anda"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-invalid={!!errors.subjek}
            aria-describedby={errors.subjek ? 'err-pengaduan-subjek' : undefined}
          />
          {errors.subjek && (
            <p id="err-pengaduan-subjek" className="mt-1 text-xs text-destructive" role="alert">
              {errors.subjek.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="pengaduan-isi" className="mb-1 block text-sm font-medium text-foreground">
            Isi Pengaduan <span className="text-destructive">*</span>
          </label>
          <textarea
            id="pengaduan-isi"
            {...register('isiPengaduan')}
            rows={5}
            placeholder="Jelaskan secara detail pengaduan Anda..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-invalid={!!errors.isiPengaduan}
            aria-describedby={errors.isiPengaduan ? 'err-pengaduan-isi' : undefined}
          />
          {errors.isiPengaduan && (
            <p id="err-pengaduan-isi" className="mt-1 text-xs text-destructive" role="alert">
              {errors.isiPengaduan.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-foreground">
            Lampiran (Opsional)
          </label>
          <p className="mb-2 text-xs text-muted-foreground">
            Unggah bukti pendukung jika ada. Format: JPG, PNG, PDF. Maksimal 5MB.
          </p>
          <input
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={handleFileChange}
            className="hidden"
            id="pengaduan-file"
          />
          <label
            htmlFor="pengaduan-file"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary hover:bg-primary-light/50"
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {file ? file.name : 'Klik untuk memilih file'}
              </p>
              {file && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>
          </label>
          {fileError && (
            <p className="mt-2 text-xs text-destructive">{fileError}</p>
          )}
          {file && (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-border p-3">
              <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive hover:text-white"
                aria-label="Hapus file"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <button
          type="submit"
          disabled={submitMutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {submitMutation.isPending ? 'Mengirim...' : 'Kirim Pengaduan'}
          {!submitMutation.isPending && <MessageSquare className="h-4 w-4" />}
        </button>
      </div>
    </form>
  )
}
