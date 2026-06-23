import type { GlobalConfig } from 'payload'

/**
 * Single document holding site-wide settings: footer info, contact, social.
 * Rendered by apps/web on every page (cached).
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { description: 'Pengaturan situs (header, footer, kontak).' },
  access: {
    read:   () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'namaInstansi',     type: 'text', required: true, defaultValue: 'BAZNAS Kabupaten Cianjur' },
    { name: 'tagline',          type: 'text' },
    { name: 'alamat',           type: 'textarea', required: true },
    { name: 'telepon',          type: 'text', required: true },
    { name: 'email',            type: 'email', required: true },
    { name: 'jamPelayanan',     type: 'text' },
    {
      name: 'sosialMedia',
      type: 'group',
      fields: [
        { name: 'facebook',  type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube',   type: 'text' },
        { name: 'tiktok',    type: 'text' },
        { name: 'x',         type: 'text' },
        { name: 'website',   type: 'text' },
      ],
    },
    {
      name: 'mapsEmbedUrl',
      type: 'text',
      admin: { description: 'URL embed Google Maps (src dari iframe).' },
    },
  ],
}
