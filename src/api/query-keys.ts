import type { ProductQuery } from '@/types'

export const queryKeys = {
  products: {
    root: ['products'] as const,
    list: (query?: ProductQuery) => ['products', 'list', query ?? {}] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  sales: {
    root: ['sales'] as const,
    list: () => ['sales', 'list'] as const,
  },
  dashboard: ['dashboard'] as const,
  users: {
    root: ['users'] as const,
    list: () => ['users', 'list'] as const,
  },
  roles: {
    root: ['roles'] as const,
    list: () => ['roles', 'list'] as const,
  },
}
