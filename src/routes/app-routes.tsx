import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/app-layout'
import { ProtectedRoute, RequirePermission } from '@/routes/protected-route'
import { PublicOnlyRoute } from '@/routes/public-only-route'
import { useAuth } from '@/context/auth-context'
import { firstAccessiblePath } from '@/lib/navigation'

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

function HomeRedirect() {
  const { hasPermission } = useAuth()
  const path = firstAccessiblePath(hasPermission)

  if (!path) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          You don&apos;t have access to any pages. Please contact an administrator.
        </p>
      </div>
    )
  }

  return <Navigate to={path} replace />
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
            <Route index element={<HomeRedirect />} />
            <Route
              path="/dashboard"
              element={
                <RequirePermission path="/dashboard">
                  <DashboardPage />
                </RequirePermission>
              }
            />
            <Route
              path="/products"
              element={
                <RequirePermission path="/products">
                  <ProductsPage />
                </RequirePermission>
              }
            />
            <Route
              path="/sales"
              element={
                <RequirePermission path="/sales">
                  <SalesPage />
                </RequirePermission>
              }
            />
            <Route
              path="/users"
              element={
                <RequirePermission path="/users">
                  <UsersPage />
                </RequirePermission>
              }
            />
            <Route
              path="/roles"
              element={
                <RequirePermission path="/roles">
                  <RolesPage />
                </RequirePermission>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
