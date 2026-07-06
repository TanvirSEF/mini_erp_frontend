import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Role } from '@/types'
import { createUser, deleteUser, getUsers, updateUserRole } from '@/api/users'
import { queryKeys } from '@/api/query-keys'

export const useUsers = () =>
  useQuery({ queryKey: queryKeys.users.list(), queryFn: getUsers })

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.root }),
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      updateUserRole(id, role),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.root }),
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.root }),
  })
}
