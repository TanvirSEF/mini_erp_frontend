import type { Product, ProductQuery } from '@/types'
import { http } from '@/lib/http'

export const getProducts = (query: ProductQuery) =>
  http.get<Product[]>('/products', { params: query })

export const getProduct = (id: string) => http.get<Product>(`/products/${id}`)

export const createProduct = (payload: FormData) =>
  http.post<Product>('/products', payload)

export const updateProduct = (id: string, payload: FormData) =>
  http.patch<Product>(`/products/${id}`, payload)

export const deleteProduct = (id: string) =>
  http.del<Product>(`/products/${id}`)
