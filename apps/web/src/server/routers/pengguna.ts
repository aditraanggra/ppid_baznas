import { router, superAdminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { desc, eq } from 'drizzle-orm'
import { db, users } from '@ppid/db'

/**
 * Super-admin-only user management CRUD.
 */
export const penggunaRouter = router({
  /**
   * List all admin users.
   */
  list: superAdminProcedure.query(async () => {
    const rows = await db
      .select({
        id:        users.id,
        name:      users.name,
        email:     users.email,
        role:      users.role,
        isActive:  users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    return rows
  }),

  /**
   * Create a new admin user.
   */
  create: superAdminProcedure
    .input(
      z.object({
        name:     z.string().min(3).max(100),
        email:    z.string().email(),
        password: z.string().min(8),
        role:     z.enum(['super_admin', 'admin_ppid', 'operator']),
      }),
    )
    .mutation(async ({ input }) => {
      const bcrypt = await import('bcryptjs')
      const hashedPassword = await bcrypt.hash(input.password, 10)

      try {
        const createdRows = await db
          .insert(users)
          .values({
            name:     input.name,
            email:    input.email,
            password: hashedPassword,
            role:     input.role,
          })
          .returning()

        const created = createdRows[0]
        if (!created) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Gagal membuat user.' })
        }

        return { id: created.id, name: created.name, email: created.email, role: created.role }
      } catch (err) {
        if (err instanceof Error && err.message.includes('duplicate')) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Email sudah terdaftar.' })
        }
        throw err
      }
    }),

  /**
   * Update an existing admin user.
   */
  update: superAdminProcedure
    .input(
      z.object({
        id:       z.string().uuid(),
        name:     z.string().min(3).max(100).optional(),
        email:    z.string().email().optional(),
        role:     z.enum(['super_admin', 'admin_ppid', 'operator']).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...fields } = input
      const patch = { ...fields, updatedAt: new Date() }

      const updatedRows = await db
        .update(users)
        .set(patch)
        .where(eq(users.id, id))
        .returning()

      const updated = updatedRows[0]
      if (!updated) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User tidak ditemukan.' })
      }

      return {
        id:       updated.id,
        name:     updated.name,
        email:    updated.email,
        role:     updated.role,
        isActive: updated.isActive,
      }
    }),

  /**
   * Delete an admin user.
   */
  remove: superAdminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const deletedRows = await db
        .delete(users)
        .where(eq(users.id, input.id))
        .returning()

      if (!deletedRows[0]) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User tidak ditemukan.' })
      }

      return { success: true }
    }),
})
