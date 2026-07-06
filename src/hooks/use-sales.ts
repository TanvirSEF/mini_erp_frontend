import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSale, getSales } from '@/api/sales'
import { queryKeys } from '@/api/query-keys'

export const useSales = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.sales.list(),
    queryFn: getSales,
    enabled,
  })

export const useCreateSale = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.root })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.root })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })
}
