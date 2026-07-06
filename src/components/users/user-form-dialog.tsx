import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import type { CreateUserInput, Role } from '@/types'
import { useCreateUser } from '@/hooks/use-users'
import { ApiError } from '@/lib/api-error'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ROLES: Role[] = ['Admin', 'Manager', 'Employee']

const emptyForm: CreateUserInput = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserFormDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            Create a new account. The user signs in with these credentials.
          </DialogDescription>
        </DialogHeader>
        <UserForm key={open ? 'open' : 'closed'} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function UserForm({ onClose }: { onClose: () => void }) {
  const createUser = useCreateUser()
  const [form, setForm] = useState<CreateUserInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof CreateUserInput, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    createUser.mutate(form, {
      onSuccess: onClose,
      onError: (err) =>
        setError(err instanceof ApiError ? err.message : 'Failed to create user.'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-2">
        <Label htmlFor="user-name">Name</Label>
        <Input
          id="user-name"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-email">Email</Label>
        <Input
          id="user-email"
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-password">Password</Label>
        <Input
          id="user-password"
          type="password"
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          minLength={6}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-role">Role</Label>
        <select
          id="user-role"
          value={form.role}
          onChange={(event) => update('role', event.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2 pr-7 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={createUser.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createUser.isPending}>
          {createUser.isPending && <Loader2 className="size-4 animate-spin" />}
          Create user
        </Button>
      </DialogFooter>
    </form>
  )
}
