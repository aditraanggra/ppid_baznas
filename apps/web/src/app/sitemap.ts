import { MetadataRoute } from 'next'
import { getPengumumanList } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ppid.baznascianjur.go.id'

  const staticRoutes = [
    '',
    '/profil',
    '/profil/struktur-organisasi',
    '/profil/dasar-hukum',
    '/profil/maklumat-pelayanan',
    '/informasi-publik',
    '/informasi-publik/berkala',
    '/informasi-publik/serta-merta',
    '/informasi-publik/setiap-saat',
    '/permohonan',
    '/permohonan/tracking',
    '/download',
    '/statistik',
    '/pengumuman',
    '/faq',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  let dynamicRoutes: MetadataRoute.Sitemap = []

  try {
    const pengumuman = await getPengumumanList({ limit: 100 })
    dynamicRoutes = pengumuman.docs.map((doc) => ({
      url: `${baseUrl}/pengumuman/${doc.slug}`,
      lastModified: new Date(doc.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Failed to fetch dynamic routes for sitemap:', error)
  }

  return [...staticRoutes, ...dynamicRoutes]
}
