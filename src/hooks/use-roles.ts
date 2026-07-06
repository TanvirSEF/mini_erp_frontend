import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getRoles, updateRolePermissions } from '@/api/roles'
import { queryKeys } from '@/api/query-keys'

export const useRoles = () =>
  useQuery({ queryKey: queryKeys.roles.list(), queryFn: getRoles })

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      name,
      permissions,
    }: {
      name: string
      permissions: string[]
    }) => updateRolePermissions(name, permissions),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.root })
      toast.success(`Permissions for ${variables.name} updated successfully!`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update permissions')
    },
  })
}

