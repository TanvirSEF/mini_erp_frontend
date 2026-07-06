import { useState } from 'react'
import { Check } from 'lucide-react'
import type { RoleDoc } from '@/types'
import { useRoles, useUpdateRolePermissions } from '@/hooks/use-roles'
import { PERMISSION_GROUPS } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function RolesPage() {
  const { data, isLoading, isError, refetch } = useRoles()
  const updateMutation = useUpdateRolePermissions()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-medium">Roles</h1>
        <p className="text-sm text-muted-foreground">
          Edit what each role is allowed to do. Admin is fixed.
        </p>
      </div>

      {isError ? (
        <div className="flex items-center justify-between rounded-xl border p-4">
          <span className="text-sm text-muted-foreground">Failed to load roles.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {(data ?? []).map((role) => (
            <RoleCard
              key={role.name}
              role={role}
              saving={updateMutation.isPending}
              onSave={(permissions) =>
                updateMutation.mutate({ name: role.name, permissions })
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

type CardProps = {
  role: RoleDoc
  saving: boolean
  onSave: (permissions: string[]) => void
}

function RoleCard({ role, saving, onSave }: CardProps) {
  const isImmutable = role.name === 'Admin'
  const [permissions, setPermissions] = useState<string[]>(role.permissions)

  const toggle = (permission: string) =>
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((item) => item !== permission)
        : [...prev, permission]
    )

  const isDirty =
    JSON.stringify([...permissions].sort()) !==
    JSON.stringify([...role.permissions].sort())

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="font-medium">{role.name}</h3>
          {role.description && (
            <p className="text-xs text-muted-foreground">{role.description}</p>
          )}
        </div>
        {!isImmutable && (
          <Button
            size="sm"
            disabled={!isDirty || saving}
            onClick={() => onSave(permissions)}
          >
            Save changes
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.permissions.map((permission) => {
                const active = permissions.includes(permission)
                return (
                  <button
                    key={permission}
                    type="button"
                    disabled={isImmutable}
                    onClick={() => toggle(permission)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted',
                      isImmutable && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    {active && <Check className="size-3" />}
                    {permission.split(':')[1]}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
