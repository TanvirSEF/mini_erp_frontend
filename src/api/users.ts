import type { CreateUserInput, Role, User } from '@/types'
import { http } from '@/lib/http'

export const getUsers = () => http.get<User[]>('/users')

export const createUser = (input: CreateUserInput) =>
  http.post<User>('/users', input)

export const updateUserRole = (id: string, role: Role) =>
  http.patch<User>(`/users/${id}/role`, { role })

export const deleteUser = (id: string) => http.del<User>(`/users/${id}`)
