export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

export interface Paginated<T> {
  result: T[]
  meta: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  message: string
  errorDetails?: unknown
  stack?: string
}

export type Role = 'Admin' | 'Manager' | 'Employee'

export interface AuthUser {
  _id: string
  name: string
  email: string
  role: Role
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role?: Role
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface Product {
  _id: string
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: string
  createdAt: string
  updatedAt: string
}

export interface ProductFormValues {
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
}

export interface ProductQuery {
  searchTerm?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
}

export interface SaleItem {
  product: string
  name: string
  price: number
  quantity: number
  subtotal: number
}

export interface Sale {
  _id: string
  items: SaleItem[]
  grandTotal: number
  createdAt: string
  updatedAt: string
}

export interface SaleItemInput {
  productId: string
  quantity: number
}

export interface CreateSaleInput {
  items: SaleItemInput[]
}

export interface RoleDoc {
  _id: string
  name: Role
  permissions: string[]
  description: string
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalProducts: number
  salesCount: number
  totalSales: number
  lowStockProducts: Product[]
}
