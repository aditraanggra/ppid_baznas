import type { CollectionConfig } from 'payload'

/**
 * FAQ — frequently asked questions shown at /faq.
 * Items are grouped by `kategori` and ordered by `urutan` asc.
 */
export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle:     'pertanyaan',
    defaultColumns: ['pertanyaan', 'kategori', 'urutan', 'isPublished'],
    description:    'Pertanyaan yang sering diajukan oleh pemohon informasi.',
  },
  access: {
    read:   ({ req: { user } }) => Boolean(user) || { isPublished: { equals: true } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'pertanyaan', type: 'text',     required: true, maxLength: 300 },
    { name: 'jawaban',    type: 'textarea', required: true },
    {
      name: 'kategori',
      type: 'select',
      required: true,
      defaultValue: 'umum',
      options: [
        { label: 'Umum',                   value: 'umum' },
        { label: 'Permohonan Informasi',   value: 'permohonan' },
        { label: 'Penyaluran ZIS',         value: 'zis' },
        { label: 'Pengaduan & Keberatan',  value: 'keberatan' },
      ],
    },
    {
      name: 'urutan',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'Urutan tampil (angka kecil = tampil duluan).' },
    },
    { name: 'isPublished', type: 'checkbox', defaultValue: true, label: 'Tampilkan ke publik' },
  ],
  timestamps: true,
}
