import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.root })
      toast.success(`User role updated to ${variables.role} successfully!`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update user role.')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.root })
      toast.success('User deleted successfully!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user.')
    },
  })
}

