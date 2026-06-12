import { pgTable, uuid, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('user_role', [
  'super_admin',  // Full access + user management
  'admin_ppid',   // Manage requests + content
  'operator',     // View only + status update
])

export const users = pgTable('users', {
  id:        uuid('id').defaultRandom().primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  email:     varchar('email', { length: 255 }).notNull().unique(),
  /** bcrypt hashed */
  password:  varchar('password', { length: 255 }).notNull(),
  role:      roleEnum('role').notNull().default('operator'),
  isActive:  boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User       = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert
export type UserRole   = typeof roleEnum.enumValues[number]
