import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const items = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Products', to: '/products' },
    { label: 'Sales', to: '/sales' },
    ...(user?.role === 'Admin'
      ? [
          { label: 'Users', to: '/users' },
          { label: 'Roles', to: '/roles' },
        ]
      : []),
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <span className="font-semibold">Mini ERP</span>
        <nav className="flex items-center gap-1 text-sm">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isActive && 'bg-muted text-foreground'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
