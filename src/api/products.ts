import type { Paginated, Product, ProductQuery } from '@/types'
import { http } from '@/lib/http'

export const getProducts = (query: ProductQuery) =>
  http.get<Paginated<Product>>('/products', { params: query })

export const getProduct = (id: string) => http.get<Product>(`/products/${id}`)

export const createProduct = (payload: FormData) =>
  http.post<Product>('/products', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const updateProduct = (id: string, payload: FormData) =>
  http.patch<Product>(`/products/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteProduct = (id: string) =>
  http.del<Product>(`/products/${id}`)
