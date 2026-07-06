import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/app-layout'
import { ProtectedRoute } from '@/routes/protected-route'
import { PublicOnlyRoute } from '@/routes/public-only-route'

const LoginPage = lazy(() =>
  import('@/pages/login').then((m) => ({ default: m.LoginPage }))
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard').then((m) => ({ default: m.DashboardPage }))
)
const ProductsPage = lazy(() =>
  import('@/pages/products').then((m) => ({ default: m.ProductsPage }))
)
const SalesPage = lazy(() =>
  import('@/pages/sales').then((m) => ({ default: m.SalesPage }))
)
const UsersPage = lazy(() =>
  import('@/pages/users').then((m) => ({ default: m.UsersPage }))
)
const RolesPage = lazy(() =>
  import('@/pages/roles').then((m) => ({ default: m.RolesPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage }))
)

function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />

            <Route element={<ProtectedRoute roles={['Admin']} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/roles" element={<RolesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
