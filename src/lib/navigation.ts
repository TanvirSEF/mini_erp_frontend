import {
  Boxes,
  LayoutDashboard,
  ShoppingCart,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { PERMISSIONS } from './permissions'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
  permissions: string[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    permissions: [PERMISSIONS.DASHBOARD_READ],
  },
  {
    label: 'Products',
    path: '/products',
    icon: Boxes,
    permissions: [PERMISSIONS.PRODUCT_READ],
  },
  {
    label: 'Sales',
    path: '/sales',
    icon: ShoppingCart,
    permissions: [PERMISSIONS.SALE_CREATE, PERMISSIONS.SALE_READ],
  },
  {
    label: 'Users',
    path: '/users',
    icon: Users,
    permissions: [PERMISSIONS.USER_MANAGE],
  },
  {
    label: 'Roles',
    path: '/roles',
    icon: ShieldCheck,
    permissions: [PERMISSIONS.ROLE_MANAGE],
  },
]

export const firstAccessiblePath = (
  hasPermission: (permission: string) => boolean
): string | null =>
  NAV_ITEMS.find((item) => item.permissions.some(hasPermission))?.path ?? null
