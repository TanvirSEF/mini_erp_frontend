export const PERMISSIONS = {
  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  SALE_CREATE: 'sale:create',
  SALE_READ: 'sale:read',
  DASHBOARD_READ: 'dashboard:read',
  ROLE_MANAGE: 'role:manage',
  USER_MANAGE: 'user:manage',
} as const

export const PERMISSION_GROUPS = [
  {
    label: 'Products',
    permissions: [
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
    ],
  },
  {
    label: 'Sales',
    permissions: [PERMISSIONS.SALE_CREATE, PERMISSIONS.SALE_READ],
  },
  {
    label: 'Dashboard',
    permissions: [PERMISSIONS.DASHBOARD_READ],
  },
  {
    label: 'Administration',
    permissions: [PERMISSIONS.USER_MANAGE, PERMISSIONS.ROLE_MANAGE],
  },
]
