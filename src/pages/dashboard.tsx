import { AlertTriangle, Banknote, Boxes, ShoppingCart } from 'lucide-react'
import { useDashboard, useDashboardSocket } from '@/hooks/use-dashboard'
import { StatCard } from '@/components/stat-card'
import { LowStockTable } from '@/components/low-stock-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatNumber } from '@/lib/format'

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard()
  useDashboardSocket()

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your inventory and sales.
        </p>
      </div>

      {isError ? (
        <div className="flex items-center justify-between rounded-xl border p-4">
          <span className="text-sm text-muted-foreground">
            Failed to load the dashboard.
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total products"
              icon={Boxes}
              value={
                isLoading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  formatNumber(data?.totalProducts ?? 0)
                )
              }
            />
            <StatCard
              label="Total sales"
              icon={ShoppingCart}
              value={
                isLoading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  formatNumber(data?.salesCount ?? 0)
                )
              }
            />
            <StatCard
              label="Revenue"
              icon={Banknote}
              value={
                isLoading ? (
                  <Skeleton className="h-7 w-24" />
                ) : (
                  formatCurrency(data?.totalSales ?? 0)
                )
              }
            />
            <StatCard
              label="Low stock"
              icon={AlertTriangle}
              value={
                isLoading ? (
                  <Skeleton className="h-7 w-12" />
                ) : (
                  formatNumber(data?.lowStockProducts.length ?? 0)
                )
              }
            />
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-medium">Low stock products</h2>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : data && data.lowStockProducts.length > 0 ? (
              <LowStockTable products={data.lowStockProducts} />
            ) : (
              <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
                All products are well stocked.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
