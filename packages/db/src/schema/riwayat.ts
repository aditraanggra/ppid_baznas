import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { permohonan, statusPermohonanEnum } from './permohonan'
import { users } from './users'

/**
 * Audit log: every status change on a permohonan is recorded here.
 * Immutable — no updates or deletes allowed.
 */
export const riwayatPermohonan = pgTable('riwayat_permohonan', {
  id:            uuid('id').defaultRandom().primaryKey(),
  permohonanId:  uuid('permohonan_id').notNull().references(() => permohonan.id, { onDelete: 'cascade' }),
  statusDari:    statusPermohonanEnum('status_dari'),
  statusKe:      statusPermohonanEnum('status_ke').notNull(),
  catatan:       text('catatan'),
  /** null = system action (e.g. SLA reminder) */
  userId:        uuid('user_id').references(() => users.id),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
})

export type RiwayatPermohonan       = typeof riwayatPermohonan.$inferSelect
export type RiwayatPermohonanInsert = typeof riwayatPermohonan.$inferInsert
