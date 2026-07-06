import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ProductQuery } from '@/types'
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '@/api/products'
import { queryKeys } from '@/api/query-keys'

export const useProducts = (query: ProductQuery) =>
  useQuery({
    queryKey: queryKeys.products.list(query),
    queryFn: () => getProducts(query),
  })

const useInvalidateProducts = () => {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.root })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
  }
}

export const useCreateProduct = () => {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: invalidate,
  })
}

export const useUpdateProduct = () => {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateProduct(id, data),
    onSuccess: invalidate,
  })
}

export const useDeleteProduct = () => {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidate,
  })
}
