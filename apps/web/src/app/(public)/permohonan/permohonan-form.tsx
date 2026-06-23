'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trpc } from '@/lib/trpc/client'
import { toast } from 'sonner'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  X,
  FileText,
  Eye,
} from 'lucide-react'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

const step1Schema = z.object({
  namaPemohon: z.string().min(3, 'Nama minimal 3 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  nomorIdentitas: z
    .string()
    .length(16, 'NIK harus 16 digit')
    .regex(/^\d+$/, 'NIK hanya boleh angka'),
  alamat: z.string().min(10, 'Alamat terlalu singkat').max(500),
  nomorTelepon: z.string().max(15).optional(),
})

const step2Schema = z.object({
  tujuanPermohonan: z.string().min(10, 'Tujuan minimal 10 karakter').max(1000),
  rincianInformasi: z.string().min(10, 'Rincian minimal 10 karakter').max(2000),
  kategoriInformasi: z.enum(['berkala', 'serta_merta', 'setiap_saat']),
  caraMendapatkan: z.enum(['email', 'langsung', 'pos']).default('email'),
})

const fullSchema = step1Schema.merge(step2Schema).extend({
  lampiranIdentitas: z.instanceof(File).optional(),
})

type FormData = z.infer<typeof fullSchema>

const STEPS = [
  { id: 1, label: 'Data Pemohon' },
  { id: 2, label: 'Informasi Diminta' },
  { id: 3, label: 'Unggah Lampiran' },
  { id: 4, label: 'Review & Submit' },
]

const KATEGORI_OPTIONS = [
  { value: 'berkala', label: 'Berkala', desc: 'Diungkapkan secara rutin' },
  {
    value: 'serta_merta',
    label: 'Serta Merta',
    desc: 'Diberikan dalam 24 jam',
  },
  { value: 'setiap_saat', label: 'Setiap Saat', desc: 'Tersedia kapan saja' },
]

const CARA_OPTIONS = [
  { value: 'email', label: 'Email', desc: 'Jawaban dikirim via email' },
  { value: 'langsung', label: 'Langsung', desc: 'Ambil di kantor BAZNAS' },
  { value: 'pos', label: 'Kurir Pos', desc: 'Dikirim via jasa pengiriman' },
]

export function PermohonanForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [submittedTiket, setSubmittedTiket] = useState<string | null>(null)

  const submitMutation = trpc.permohonan.submit.useMutation({
    onSuccess: (data) => {
      setSubmittedTiket(data.nomorTiket)
      toast.success('Permohonan berhasil diajukan!')
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal mengajukan permohonan.')
    },
  })

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      caraMendapatkan: 'email',
      kategoriInformasi: 'berkala',
    },
    mode: 'onBlur',
  })

  const watchedData = watch()

  async function handleNext() {
    const stepFields: Record<number, (keyof FormData)[]> = {
      1: ['namaPemohon', 'email', 'nomorIdentitas', 'alamat', 'nomorTelepon'],
      2: [
        'tujuanPermohonan',
        'rincianInformasi',
        'kategoriInformasi',
        'caraMendapatkan',
      ],
    }
    const fields = stepFields[currentStep]
    if (fields) {
      const valid = await trigger(fields as (keyof FormData)[])
      if (!valid) return
    }
    if (currentStep < 4) setCurrentStep((s) => s + 1)
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

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
    setValue('lampiranIdentitas', f)
  }

  function removeFile() {
    setFile(null)
    setValue('lampiranIdentitas', undefined)
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (submittedTiket) {
    return (
      <div className='rounded-lg border border-success bg-success-light p-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success'>
          <Check className='h-8 w-8 text-success-foreground' />
        </div>
        <h2 className='mb-2 font-heading text-2xl font-bold tracking-tight text-foreground'>
          Permohonan berhasil diajukan
        </h2>
        <p className='mb-4 text-muted-foreground'>Nomor tiket Anda adalah:</p>
        <p className='mb-6 font-mono text-3xl font-bold tabular-nums text-foreground'>
          {submittedTiket}
        </p>
        <p className='mb-6 text-sm text-muted-foreground'>
          Simpan nomor tiket ini dan periksa email Anda untuk konfirmasi. Anda
          dapat melacak status permohonan di halaman Lacak Permohonan.
        </p>
        <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
          <button
            onClick={() => router.push(`/permohonan/tracking`)}
            className='inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark'
          >
            Lacak Permohonan
          </button>
          <button
            onClick={() => router.push('/')}
            className='inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent'
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-2'>
        {STEPS.map((step, idx) => (
          <div key={step.id} className='flex items-center gap-2'>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                currentStep > step.id
                  ? 'bg-primary text-white'
                  : currentStep === step.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > step.id ? <Check className='h-4 w-4' /> : step.id}
            </div>
            <span
              className={`hidden text-sm md:block ${currentStep === step.id ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
            >
              {step.label}
            </span>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-px w-8 flex-shrink-0 md:w-12 ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`}
              />
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            await submitMutation.mutateAsync({
              ...data,
              lampiranIdentitas: undefined,
            })
          } catch {
            // handled in onError
          }
        })}
        className='rounded-lg border border-border bg-card p-6 space-y-6'
      >
        {currentStep === 1 && (
          <div className='space-y-4'>
            <h2 className='font-heading text-xl font-semibold text-foreground'>
              Data Pemohon
            </h2>
            <p className='text-sm text-muted-foreground'>
              Lengkapi data diri Anda sesuai KTP. Data ini diperlukan untuk
              verifikasi.
            </p>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='md:col-span-2'>
                <label
                  htmlFor='namaPemohon'
                  className='mb-1 block text-sm font-medium text-foreground'
                >
                  Nama Lengkap <span className='text-destructive'>*</span>
                </label>
                <input
                  id='namaPemohon'
                  {...register('namaPemohon')}
                  className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  aria-invalid={!!errors.namaPemohon}
                  aria-describedby={
                    errors.namaPemohon ? 'err-namaPemohon' : undefined
                  }
                />
                {errors.namaPemohon && (
                  <p
                    id='err-namaPemohon'
                    className='mt-1 text-xs text-destructive'
                    role='alert'
                  >
                    {errors.namaPemohon.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='mb-1 block text-sm font-medium text-foreground'
                >
                  Email <span className='text-destructive'>*</span>
                </label>
                <input
                  id='email'
                  type='email'
                  {...register('email')}
                  className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'err-email' : undefined}
                />
                {errors.email && (
                  <p
                    id='err-email'
                    className='mt-1 text-xs text-destructive'
                    role='alert'
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='nomorTelepon'
                  className='mb-1 block text-sm font-medium text-foreground'
                >
                  Nomor Telepon
                </label>
                <input
                  id='nomorTelepon'
                  type='tel'
                  {...register('nomorTelepon')}
                  placeholder='08xxxxxxxxxx'
                  className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  aria-invalid={!!errors.nomorTelepon}
                  aria-describedby={
                    errors.nomorTelepon ? 'err-nomorTelepon' : undefined
                  }
                />
                {errors.nomorTelepon && (
                  <p
                    id='err-nomorTelepon'
                    className='mt-1 text-xs text-destructive'
                    role='alert'
                  >
                    {errors.nomorTelepon.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='nomorIdentitas'
                  className='mb-1 block text-sm font-medium text-foreground'
                >
                  NIK (16 Digit) <span className='text-destructive'>*</span>
                </label>
                <input
                  id='nomorIdentitas'
                  {...register('nomorIdentitas')}
                  placeholder='3301010101010001'
                  maxLength={16}
                  className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  aria-invalid={!!errors.nomorIdentitas}
                  aria-describedby={
                    errors.nomorIdentitas ? 'err-nomorIdentitas' : undefined
                  }
                />
                {errors.nomorIdentitas && (
                  <p
                    id='err-nomorIdentitas'
                    className='mt-1 text-xs text-destructive'
                    role='alert'
                  >
                    {errors.nomorIdentitas.message}
                  </p>
                )}
              </div>

              <div className='md:col-span-2'>
                <label
                  htmlFor='alamat'
                  className='mb-1 block text-sm font-medium text-foreground'
                >
                  Alamat Lengkap <span className='text-destructive'>*</span>
                </label>
                <textarea
                  id='alamat'
                  {...register('alamat')}
                  rows={3}
                  className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                  aria-invalid={!!errors.alamat}
                  aria-describedby={errors.alamat ? 'err-alamat' : undefined}
                />
                {errors.alamat && (
                  <p
                    id='err-alamat'
                    className='mt-1 text-xs text-destructive'
                    role='alert'
                  >
                    {errors.alamat.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className='space-y-6'>
            <h2 className='font-heading text-xl font-semibold text-foreground'>
              Informasi yang Diminta
            </h2>

            <div>
              <label
                id='label-kategoriInformasi'
                className='mb-2 block text-sm font-medium text-foreground'
              >
                Kategori Informasi <span className='text-destructive'>*</span>
              </label>
              <div
                className='grid gap-3 md:grid-cols-3'
                role='radiogroup'
                aria-labelledby='label-kategoriInformasi'
              >
                {KATEGORI_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-colors ${
                      watchedData.kategoriInformasi === opt.value
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <input
                      type='radio'
                      {...register('kategoriInformasi')}
                      value={opt.value}
                      className='sr-only'
                    />
                    <span className='font-medium'>{opt.label}</span>
                    <span className='text-xs opacity-70'>{opt.desc}</span>
                  </label>
                ))}
              </div>
              {errors.kategoriInformasi && (
                <p className='mt-1 text-xs text-destructive' role='alert'>
                  {errors.kategoriInformasi.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='tujuanPermohonan'
                className='mb-1 block text-sm font-medium text-foreground'
              >
                Tujuan Permohonan Informasi{' '}
                <span className='text-destructive'>*</span>
              </label>
              <textarea
                id='tujuanPermohonan'
                {...register('tujuanPermohonan')}
                rows={3}
                placeholder='Jelaskan mengapa Anda membutuhkan informasi ini...'
                className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                aria-invalid={!!errors.tujuanPermohonan}
                aria-describedby={
                  errors.tujuanPermohonan ? 'err-tujuanPermohonan' : undefined
                }
              />
              {errors.tujuanPermohonan && (
                <p
                  id='err-tujuanPermohonan'
                  className='mt-1 text-xs text-destructive'
                  role='alert'
                >
                  {errors.tujuanPermohonan.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='rincianInformasi'
                className='mb-1 block text-sm font-medium text-foreground'
              >
                Rincian Informasi yang Diminta{' '}
                <span className='text-destructive'>*</span>
              </label>
              <textarea
                id='rincianInformasi'
                {...register('rincianInformasi')}
                rows={4}
                placeholder='Jelaskan secara spesifik informasi apa yang Anda butuhkan...'
                className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
                aria-invalid={!!errors.rincianInformasi}
                aria-describedby={
                  errors.rincianInformasi ? 'err-rincianInformasi' : undefined
                }
              />
              {errors.rincianInformasi && (
                <p
                  id='err-rincianInformasi'
                  className='mt-1 text-xs text-destructive'
                  role='alert'
                >
                  {errors.rincianInformasi.message}
                </p>
              )}
            </div>

            <div>
              <label
                id='label-caraMendapatkan'
                className='mb-2 block text-sm font-medium text-foreground'
              >
                Cara Memperoleh Informasi{' '}
                <span className='text-destructive'>*</span>
              </label>
              <div
                className='grid gap-3 md:grid-cols-3'
                role='radiogroup'
                aria-labelledby='label-caraMendapatkan'
              >
                {CARA_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-colors ${
                      watchedData.caraMendapatkan === opt.value
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <input
                      type='radio'
                      {...register('caraMendapatkan')}
                      value={opt.value}
                      className='sr-only'
                    />
                    <span className='font-medium'>{opt.label}</span>
                    <span className='text-xs opacity-70'>{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className='space-y-4'>
            <h2 className='font-heading text-xl font-semibold text-foreground'>
              Unggah Lampiran (Opsional)
            </h2>
            <p className='text-sm text-muted-foreground'>
              Unggah fotokopi KTP Anda untuk mempercepat verifikasi. Format yang
              diizinkan: JPG, PNG, PDF. Maksimal 5MB.
            </p>

            <div>
              <input
                type='file'
                accept={ALLOWED_FILE_TYPES.join(',')}
                onChange={handleFileChange}
                className='hidden'
                id='lampiran-file'
              />
              <label
                htmlFor='lampiran-file'
                className='flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary hover:bg-primary-light'
              >
                <Upload className='h-8 w-8 text-muted-foreground' />
                <div>
                  <p className='font-medium text-foreground'>
                    {file ? file.name : 'Klik untuk memilih file'}
                  </p>
                  {file && (
                    <p className='text-sm text-muted-foreground'>
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </div>
              </label>
              {fileError && (
                <p className='mt-2 text-sm text-destructive'>{fileError}</p>
              )}
            </div>

            {file && (
              <div className='flex items-center gap-3 rounded-lg border border-border p-3'>
                <FileText className='h-5 w-5 flex-shrink-0 text-primary' />
                <div className='flex-1 min-w-0'>
                  <p className='truncate text-sm font-medium text-foreground'>
                    {file.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={removeFile}
                  className='flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive hover:text-white'
                  aria-label='Hapus file'
                >
                  <X className='h-4 w-4' aria-hidden='true' />
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className='space-y-4'>
            <h2 className='font-heading text-xl font-semibold text-foreground'>
              Review Permohonan
            </h2>
            <p className='text-sm text-muted-foreground'>
              Pastikan data yang Anda isi sudah benar sebelum mengirim
              permohonan.
            </p>

            <div className='rounded-lg border border-border divide-y divide-border'>
              <div className='flex items-start gap-3 p-4'>
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                  <FileText className='h-4 w-4' />
                </div>
                <div className='flex-1'>
                  <h3 className='mb-3 font-heading font-semibold text-foreground'>
                    Data Pemohon
                  </h3>
                  <dl className='space-y-1 text-sm'>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Nama</dt>
                      <dd className='text-foreground'>
                        {watchedData.namaPemohon || '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Email</dt>
                      <dd className='text-foreground'>
                        {watchedData.email || '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>NIK</dt>
                      <dd className='text-foreground'>
                        {watchedData.nomorIdentitas
                          ? '**************' +
                            watchedData.nomorIdentitas.slice(-4)
                          : '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Alamat</dt>
                      <dd className='text-foreground'>
                        {watchedData.alamat || '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Telepon</dt>
                      <dd className='text-foreground'>
                        {watchedData.nomorTelepon || '—'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className='flex items-start gap-3 p-4'>
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary'>
                  <Eye className='h-4 w-4' />
                </div>
                <div className='flex-1'>
                  <h3 className='mb-3 font-heading font-semibold text-foreground'>
                    Informasi Diminta
                  </h3>
                  <dl className='space-y-1 text-sm'>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Kategori</dt>
                      <dd className='text-foreground capitalize'>
                        {watchedData.kategoriInformasi?.replace('_', ' ') ||
                          '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>
                        Cara Dapatkan
                      </dt>
                      <dd className='text-foreground capitalize'>
                        {watchedData.caraMendapatkan || '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Tujuan</dt>
                      <dd className='text-foreground'>
                        {watchedData.tujuanPermohonan || '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Rincian</dt>
                      <dd className='text-foreground'>
                        {watchedData.rincianInformasi || '—'}
                      </dd>
                    </div>
                    <div className='flex gap-2'>
                      <dt className='w-28 text-muted-foreground'>Lampiran</dt>
                      <dd className='text-foreground'>
                        {file ? file.name : 'Tidak ada'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className='rounded-lg bg-primary-light p-4'>
              <p className='text-sm text-foreground'>
                Dengan mengajukan permohonan ini, saya menyatakan bahwa data
                yang saya berikan adalah benar dan saya memahami bahwa
                permohonan ini akan diproses sesuai ketentuan
                <span className='font-medium'> UU No. 14 Tahun 2008</span>{' '}
                tentang Keterbukaan Informasi Publik.
              </p>
            </div>
          </div>
        )}

        <div className='flex justify-between gap-4 pt-4 border-t border-border'>
          <button
            type='button'
            onClick={handleBack}
            disabled={currentStep === 1 || submitMutation.isPending}
            className='inline-flex items-center gap-2 rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50'
          >
            <ChevronLeft className='h-4 w-4' />
            Sebelumnya
          </button>

          {currentStep < 4 ? (
            <button
              type='button'
              onClick={handleNext}
              className='inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark'
            >
              Selanjutnya
              <ChevronRight className='h-4 w-4' />
            </button>
          ) : (
            <button
              type='submit'
              disabled={submitMutation.isPending}
              className='inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50'
            >
              {submitMutation.isPending ? 'Mengirim...' : 'Ajukan Permohonan'}
              {!submitMutation.isPending && <Check className='h-4 w-4' />}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
