'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@ppid/ui'
import { Input } from '@ppid/ui'
import { Badge } from '@ppid/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@ppid/ui'
import { Skeleton } from '@ppid/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ppid/ui'

type UserRole = 'super_admin' | 'admin_ppid' | 'operator'

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin_ppid:  'Admin PPID',
  operator:    'Operator',
}

interface UserFormData {
  name:     string
  email:    string
  password: string
  role:     UserRole
}

const EMPTY_FORM: UserFormData = {
  name: '', email: '', password: '', role: 'operator',
}

/**
 * User management page (super_admin only).
 * CRUD operations for admin users.
 */
export default function PenggunaPage() {
  const utils = trpc.useUtils()

  const { data: users, isLoading } = trpc.pengguna.list.useQuery()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const createMutation = trpc.pengguna.create.useMutation({
    onSuccess: () => {
      void utils.pengguna.list.invalidate()
      closeDialog()
    },
  })

  const updateMutation = trpc.pengguna.update.useMutation({
    onSuccess: () => {
      void utils.pengguna.list.invalidate()
      closeDialog()
    },
  })

  const deleteMutation = trpc.pengguna.remove.useMutation({
    onSuccess: () => {
      void utils.pengguna.list.invalidate()
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    },
  })

  function closeDialog() {
    setDialogOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEdit(user: NonNullable<typeof users>[number]) {
    setEditingId(user.id)
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate({
        id:   editingId,
        name: form.name,
        email: form.email,
        role: form.role,
      })
    } else {
      createMutation.mutate({
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
      })
    }
  }

  function toggleActive(user: NonNullable<typeof users>[number]) {
    updateMutation.mutate({
      id:       user.id,
      isActive: !user.isActive,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Manajemen Pengguna</h1>
          <p className="text-sm text-muted-foreground">
            Kelola akun administrator PPID BAZNAS Kabupaten Cianjur.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : !users?.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada pengguna terdaftar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Nama</th>
                    <th className="pb-3 font-medium text-muted-foreground">Email</th>
                    <th className="pb-3 font-medium text-muted-foreground">Role</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-muted-foreground">{user.email}</td>
                      <td className="py-3">
                        <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={user.isActive ? 'success' : 'destructive'}>
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(user)}
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleActive(user)}
                            title={user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          >
                            {user.isActive
                              ? <UserX className="h-3.5 w-3.5" />
                              : <UserCheck className="h-3.5 w-3.5" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => {
                              setDeleteTarget({ id: user.id, name: user.name })
                              setDeleteDialogOpen(true)
                            }}
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Perbarui informasi pengguna admin.'
                : 'Buat akun baru untuk administrator PPID.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nama lengkap"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@baznas-cianjur.go.id"
                required
              />
            </div>

            {!editingId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="operator">Operator</option>
                <option value="admin_ppid">Admin PPID</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-sm text-red-600">
                {createMutation.error?.message ?? updateMutation.error?.message ?? 'Terjadi kesalahan.'}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Menyimpan...'
                  : editingId ? 'Perbarui' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pengguna?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pengguna{' '}
              <strong>{deleteTarget?.name}</strong> akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
