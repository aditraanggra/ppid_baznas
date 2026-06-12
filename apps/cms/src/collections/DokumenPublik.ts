import type { CollectionConfig } from 'payload'

/**
 * DokumenPublik — files exposed in the Download Center (/download).
 * Stored in MinIO via @payloadcms/storage-s3 (configured in payload.config.ts).
 */
export const DokumenPublik: CollectionConfig = {
  slug: 'dokumen-publik',
  upload: {
    // The actual binary lives in MinIO; Payload stores metadata in PG.
    mimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  admin: {
    useAsTitle:     'judul',
    defaultColumns: ['judul', 'kategori', 'tahun', 'updatedAt'],
    description:    'Dokumen yang dapat diunduh publik (laporan keuangan, SOP, dll.).',
  },
  access: {
    read:   () => true, // Public download center
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'judul',     type: 'text',     required: true, maxLength: 200 },
    { name: 'deskripsi', type: 'textarea', maxLength: 1000 },
    {
      name: 'kategori',
      type: 'select',
      required: true,
      options: [
        { label: 'Laporan Keuangan',          value: 'laporan_keuangan' },
        { label: 'Laporan Tahunan',            value: 'laporan_tahunan' },
        { label: 'Laporan Penyaluran ZIS',     value: 'penyaluran_zis' },
        { label: 'Profil & Maklumat',          value: 'profil' },
        { label: 'Regulasi & Dasar Hukum',     value: 'regulasi' },
        { label: 'SOP & Standar Layanan',      value: 'sop' },
        { label: 'Lainnya',                    value: 'lainnya' },
      ],
    },
    {
      name: 'tahun',
      type: 'number',
      required: true,
      min:  2000,
      max:  2100,
      defaultValue: () => new Date().getFullYear(),
    },
    {
      name: 'kategoriInformasi',
      type: 'select',
      required: true,
      defaultValue: 'berkala',
      options: [
        { label: 'Berkala',     value: 'berkala'     },
        { label: 'Serta Merta', value: 'serta_merta' },
        { label: 'Setiap Saat', value: 'setiap_saat' },
      ],
      admin: { description: 'Klasifikasi sesuai UU KIP No.14/2008.' },
    },
  ],
  timestamps: true,
}
