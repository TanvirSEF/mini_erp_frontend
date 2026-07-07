import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import { NAV_ITEMS, firstAccessiblePath } from '@/lib/navigation'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function RequirePermission({
  path,
  children,
}: {
  path: string
  children: ReactNode
}) {
  const { hasPermission } = useAuth()
  const item = NAV_ITEMS.find((entry) => entry.path === path)

  if (item && !item.permissions.some(hasPermission)) {
    return <Navigate to={firstAccessiblePath(hasPermission) ?? '/'} replace />
  }

  return <>{children}</>
}
