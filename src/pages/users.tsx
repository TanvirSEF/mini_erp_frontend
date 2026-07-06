import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Role, User } from '@/types'
import { useAuth } from '@/context/auth-context'
import { useDeleteUser, useUpdateUserRole, useUsers } from '@/hooks/use-users'
import { UserFormDialog } from '@/components/users/user-form-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const ROLES: Role[] = ['Admin', 'Manager', 'Employee']

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const { data, isLoading, isError, refetch } = useUsers()
  const updateRole = useUpdateUserRole()
  const deleteMutation = useDeleteUser()
  const [deleting, setDeleting] = useState<User | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-medium">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts and their roles.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="size-4" />
          Add user
        </Button>
      </div>

      {isError ? (
        <div className="flex items-center justify-between rounded-xl border p-4">
          <span className="text-sm text-muted-foreground">Failed to load users.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((user) => {
                const isSelf = user._id === currentUser?._id
                return (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        disabled={isSelf || updateRole.isPending}
                        onValueChange={(val) =>
                          updateRole.mutate({
                            id: user._id,
                            role: val as Role,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue placeholder="Role..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={isSelf}
                        onClick={() => setDeleting(user)}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>{deleting?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleting) return
                deleteMutation.mutate(deleting._id, {
                  onSuccess: () => setDeleting(null),
                })
              }}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
