import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.root }),
  })
}
