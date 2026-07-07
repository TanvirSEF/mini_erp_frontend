import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'

type Props = {
  permissions?: string[]
}

export function ProtectedRoute({ permissions }: Props) {
  const { isAuthenticated, hasPermission } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (permissions && !permissions.some(hasPermission)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
