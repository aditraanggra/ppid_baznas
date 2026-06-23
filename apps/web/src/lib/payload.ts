/**
 * Payload CMS REST API client for fetching public content.
 * Used exclusively in Server Components (no client-side calls).
 */

const PAYLOAD_URL = process.env.PAYLOAD_URL ?? 'http://localhost:3001'

interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface PayloadMediaDoc {
  id: string
  url: string
  alt?: string
  filename: string
  mimeType: string
}

export interface PengumumanDoc {
  id: string
  judul: string
  slug: string
  ringkasan?: string
  konten?: unknown
  gambarSampul?: PayloadMediaDoc
  tanggalTerbit: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface FAQDoc {
  id: string
  pertanyaan: string
  jawaban: string
  kategori: 'umum' | 'permohonan' | 'zis' | 'keberatan'
  urutan: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface DokumenPublikDoc {
  id: string
  judul: string
  deskripsi?: string
  kategori:
    | 'laporan_keuangan'
    | 'laporan_tahunan'
    | 'penyaluran_zis'
    | 'profil'
    | 'regulasi'
    | 'sop'
    | 'lainnya'
  tahun: number
  kategoriInformasi: 'berkala' | 'serta_merta' | 'setiap_saat'
  url: string
  filename: string
  mimeType: string
  filesize?: number
  createdAt: string
  updatedAt: string
}

export interface SiteSettingsDoc {
  namaInstansi: string
  tagline?: string
  alamat: string
  telepon: string
  email: string
  jamPelayanan?: string
  sosialMedia?: {
    facebook?: string
    instagram?: string
    youtube?: string
    tiktok?: string
    x?: string
    website?: string
  }
  mapsEmbedUrl?: string
}

export interface MaklumatDoc {
  judul: string
  tanggalDitetapkan: string
  isi: unknown
  penandatangan: {
    nama: string
    jabatan: string
  }
}

const EMPTY_LIST = <T>(): PayloadListResponse<T> => ({
  docs: [],
  totalDocs: 0,
  totalPages: 0,
  page: 1,
  hasNextPage: false,
  hasPrevPage: false,
})

/**
 * Fetch the list of published pengumuman.
 */
export async function getPengumumanList(params?: {
  limit?: number
  page?: number
}): Promise<PayloadListResponse<PengumumanDoc>> {
  try {
    const url = new URL(`${PAYLOAD_URL}/api/pengumuman`)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('sort', '-tanggalTerbit')
    if (params?.limit) url.searchParams.set('limit', String(params.limit))
    if (params?.page) url.searchParams.set('page', String(params.page))

    const res = await fetch(url.toString(), { next: { revalidate: 300 } })
    if (!res.ok) {
      console.error('[payload] getPengumumanList: HTTP', res.status, res.statusText)
      return EMPTY_LIST<PengumumanDoc>()
    }
    return res.json() as Promise<PayloadListResponse<PengumumanDoc>>
  } catch (err) {
    console.error('[payload] getPengumumanList failed:', err)
    return EMPTY_LIST<PengumumanDoc>()
  }
}

/**
 * Fetch a single pengumuman by slug.
 */
export async function getPengumumanBySlug(slug: string): Promise<PengumumanDoc | null> {
  try {
    const url = new URL(`${PAYLOAD_URL}/api/pengumuman`)
    url.searchParams.set('where[slug][equals]', slug)
    url.searchParams.set('where[status][equals]', 'published')
    url.searchParams.set('limit', '1')

    const res = await fetch(url.toString(), { next: { revalidate: 300 } })
    if (!res.ok) {
      console.error('[payload] getPengumumanBySlug: HTTP', res.status, res.statusText)
      return null
    }
    const data = await res.json() as PayloadListResponse<PengumumanDoc>
    return data.docs[0] ?? null
  } catch (err) {
    console.error('[payload] getPengumumanBySlug failed:', err)
    return null
  }
}

/**
 * Fetch all published FAQ items, sorted by urutan ascending.
 */
export async function getFAQList(): Promise<FAQDoc[]> {
  try {
    const url = new URL(`${PAYLOAD_URL}/api/faq`)
    url.searchParams.set('where[isPublished][equals]', 'true')
    url.searchParams.set('sort', 'urutan')
    url.searchParams.set('limit', '100')

    const res = await fetch(url.toString(), { next: { revalidate: 600 } })
    if (!res.ok) {
      console.error('[payload] getFAQList: HTTP', res.status, res.statusText)
      return []
    }
    const data = await res.json() as PayloadListResponse<FAQDoc>
    return data.docs
  } catch (err) {
    console.error('[payload] getFAQList failed:', err)
    return []
  }
}

/**
 * Fetch publicly available documents, optionally filtered by kategori.
 */
export async function getDokumenPublikList(params?: {
  kategori?: DokumenPublikDoc['kategori']
  kategoriInformasi?: DokumenPublikDoc['kategoriInformasi']
  limit?: number
  page?: number
}): Promise<PayloadListResponse<DokumenPublikDoc>> {
  try {
    const url = new URL(`${PAYLOAD_URL}/api/dokumen-publik`)
    url.searchParams.set('sort', '-tahun,-updatedAt')
    if (params?.kategori) url.searchParams.set('where[kategori][equals]', params.kategori)
    if (params?.kategoriInformasi) url.searchParams.set('where[kategoriInformasi][equals]', params.kategoriInformasi)
    if (params?.limit) url.searchParams.set('limit', String(params.limit))
    if (params?.page) url.searchParams.set('page', String(params.page))

    const res = await fetch(url.toString(), { next: { revalidate: 300 } })
    if (!res.ok) {
      console.error('[payload] getDokumenPublikList: HTTP', res.status, res.statusText)
      return EMPTY_LIST<DokumenPublikDoc>()
    }
    return res.json() as Promise<PayloadListResponse<DokumenPublikDoc>>
  } catch (err) {
    console.error('[payload] getDokumenPublikList failed:', err)
    return EMPTY_LIST<DokumenPublikDoc>()
  }
}

/**
 * Fetch site-wide settings global.
 */
export async function getSiteSettings(): Promise<SiteSettingsDoc | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/site-settings`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      console.error('[payload] getSiteSettings: HTTP', res.status, res.statusText)
      return null
    }
    return res.json() as Promise<SiteSettingsDoc>
  } catch (err) {
    console.error('[payload] getSiteSettings failed:', err)
    return null
  }
}

/**
 * Fetch the Maklumat Pelayanan global.
 */
export async function getMaklumat(): Promise<MaklumatDoc | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/maklumat-pelayanan`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      console.error('[payload] getMaklumat: HTTP', res.status, res.statusText)
      return null
    }
    return res.json() as Promise<MaklumatDoc>
  } catch (err) {
    console.error('[payload] getMaklumat failed:', err)
    return null
  }
}
