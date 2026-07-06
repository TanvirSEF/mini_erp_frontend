import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  PackageCheck,
  LogOut,
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const items = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', to: '/products', icon: Boxes },
    { label: 'Sales', to: '/sales', icon: ShoppingCart },
    ...(user?.role === 'Admin'
      ? [
          { label: 'Users', to: '/users', icon: Users },
          { label: 'Roles', to: '/roles', icon: ShieldCheck },
        ]
      : []),
  ]

  const currentPath = location.pathname.substring(1)
  const currentPageLabel =
    currentPath.charAt(0).toUpperCase() + currentPath.slice(1)

  return (
    <div className="light flex min-h-svh bg-slate-50 text-slate-900">
      <aside className="relative hidden w-60 shrink-0 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2a5f8f] text-white md:flex md:flex-col md:justify-between shadow-[4px_0_24px_rgba(0,0,0,0.03)] border-r border-slate-200/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="absolute -bottom-24 -left-24 size-48 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -top-16 -right-16 size-40 rounded-full bg-white/[0.03] pointer-events-none" />

        <div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                <PackageCheck className="size-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white">
                  Mini ERP
                </span>
                <p className="text-[10px] font-medium text-white/50 tracking-wider uppercase leading-none mt-0.5">
                  Enterprise Suite
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-4 py-3">
            <ul className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white',
                          isActive &&
                            'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] font-semibold'
                        )
                      }
                    >
                      <Icon className="size-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/40 backdrop-blur-xs">
          <aside className="relative w-64 flex-col justify-between bg-gradient-to-br from-[#1e3a5f] to-[#2a5f8f] p-5 text-white flex shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/10 text-white"
            >
              <X className="size-4" />
            </button>

            <div>
              <div className="flex items-center gap-3 mb-8 mt-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                  <PackageCheck className="size-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-bold text-white">Mini ERP</span>
                  <p className="text-[10px] text-white/50 uppercase leading-none mt-0.5">Enterprise</p>
                </div>
              </div>

              <ul className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white',
                            isActive &&
                              'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] font-semibold'
                          )
                        }
                      >
                        <Icon className="size-[18px]" />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden"
              aria-label="Toggle Menu"
            >
              <Menu className="size-4.5" />
            </button>

            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
              <span className="text-slate-400">Home</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-slate-800">{currentPageLabel || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#1e3a5f] text-[11px] font-bold text-white shadow-sm">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
              <div className="hidden sm:block text-left leading-none">
                <p className="text-[12px] font-semibold text-slate-800">{user?.name ?? 'User'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{user?.role}</p>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-[0.98]"
            >
              <LogOut className="size-3.5 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
