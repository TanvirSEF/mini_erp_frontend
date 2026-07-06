import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '@/types'
import { useAuth } from '@/context/auth-context'

type Props = {
  roles?: Role[]
}

export function ProtectedRoute({ roles }: Props) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
