import type { RoleDoc } from '@/types'
import { http } from '@/lib/http'

export const getRoles = () => http.get<RoleDoc[]>('/roles')

export const updateRolePermissions = (name: string, permissions: string[]) =>
  http.patch<RoleDoc>(`/roles/${name}`, { permissions })
