import type { CreateSaleInput, Sale } from '@/types'
import { http } from '@/lib/http'

export const getSales = () => http.get<Sale[]>('/sales')

export const createSale = (payload: CreateSaleInput) =>
  http.post<Sale>('/sales', payload)
