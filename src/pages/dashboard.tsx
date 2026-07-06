import { Link } from 'react-router-dom'
import { AlertTriangle, Banknote, Boxes, ShoppingCart, ArrowRight } from 'lucide-react'
import { useDashboard, useDashboardSocket } from '@/hooks/use-dashboard'
import { useAuth } from '@/context/auth-context'
import { StatCard } from '@/components/stat-card'
import { LowStockTable } from '@/components/low-stock-table'
import { formatCurrency, formatNumber } from '@/lib/format'
import { ApiError } from '@/lib/api-error'

function StatSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-3.5 w-20 animate-pulse rounded bg-slate-200" />
          <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="size-10 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading, error, isError, refetch } = useDashboard()
  useDashboardSocket()

  const isForbidden = isError && error instanceof ApiError && error.status === 403

  if (isForbidden) {
    return (
      <div className="space-y-8 max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2a5f8f] p-8 text-white shadow-[0_10px_30px_rgba(30,58,95,0.05)]">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-white/[0.04] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 size-56 rounded-full border border-white/[0.03] pointer-events-none" />
          
          <div className="relative z-10 space-y-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-white/50">Employee Portal</span>
            <h1 className="text-3xl font-bold tracking-tight">
              Hello, {user?.name || 'User'}
            </h1>
            <p className="max-w-md text-sm text-white/80 font-light leading-relaxed">
              Access your point-of-sale terminal and manage product inventory.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/sales"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShoppingCart className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Create New Invoice</h3>
                  <p className="text-[11px] text-slate-400">Record a sale transaction</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-slate-400" />
            </Link>

            <Link
              to="/products"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Boxes className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Products Catalog</h3>
                  <p className="text-[11px] text-slate-400">Search and check stock quantity</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Here's an overview of your inventory and sales performance.
        </p>
      </div>

      {isError ? (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
          <span className="text-sm text-slate-500">
            Failed to load the dashboard.
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-lg border border-slate-200 px-3.5 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  label="Total Products"
                  icon={Boxes}
                  iconClassName="bg-[#1e3a5f]/10 text-[#1e3a5f]"
                  value={formatNumber(data?.totalProducts ?? 0)}
                />
                <StatCard
                  label="Total Sales"
                  icon={ShoppingCart}
                  iconClassName="bg-emerald-50 text-emerald-600"
                  value={formatNumber(data?.salesCount ?? 0)}
                />
                <StatCard
                  label="Revenue"
                  icon={Banknote}
                  iconClassName="bg-violet-50 text-violet-600"
                  value={formatCurrency(data?.totalSales ?? 0)}
                />
                <StatCard
                  label="Low Stock"
                  icon={AlertTriangle}
                  iconClassName="bg-amber-50 text-amber-600"
                  value={formatNumber(data?.lowStockProducts.length ?? 0)}
                />
              </>
            )}
          </div>

          {/* Low stock products section */}
          <section className="space-y-0">
            <div className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-[15px] font-semibold text-slate-900">
                  Low Stock Products
                </h2>
                <p className="mt-0.5 text-[13px] text-slate-500">
                  Products that need restocking attention.
                </p>
              </div>

              {isLoading ? (
                <div className="space-y-3 p-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-10 w-full animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              ) : data && data.lowStockProducts.length > 0 ? (
                <LowStockTable products={data.lowStockProducts} />
              ) : (
                <div className="px-5 py-12 text-center text-sm text-slate-400">
                  All products are well stocked.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
