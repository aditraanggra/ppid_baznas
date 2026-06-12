import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

/**
 * Pengumuman — public announcements shown at /pengumuman.
 * Slug is auto-generated from judul on create.
 */
export const Pengumuman: CollectionConfig = {
  slug: 'pengumuman',
  admin: {
    useAsTitle:  'judul',
    defaultColumns: ['judul', 'tanggalTerbit', 'status', 'updatedAt'],
    description: 'Pengumuman resmi PPID yang ditampilkan di halaman publik.',
  },
  access: {
    // Public can read only published items
    read:   ({ req: { user } }) => Boolean(user) || { status: { equals: 'published' } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'judul', type: 'text', required: true, maxLength: 200 },
    {
      name:     'slug',
      type:     'text',
      required: true,
      unique:   true,
      index:    true,
      admin: { description: 'URL path (lowercase, kebab-case). Auto-generated jika kosong.' },
    },
    { name: 'ringkasan', type: 'textarea', maxLength: 500 },
    { name: 'konten',    type: 'richText', editor: lexicalEditor({}) },
    {
      name: 'gambarSampul',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'tanggalTerbit',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft',     value: 'draft' },
        { label: 'Diterbitkan', value: 'published' },
        { label: 'Diarsipkan',  value: 'archived' },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.judul && !data.slug) {
          data.slug = String(data.judul)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 120)
        }
        return data
      },
    ],
  },
  timestamps: true,
}
