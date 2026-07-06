import { useAuth } from '@/context/auth-context'
import { useSales } from '@/hooks/use-sales'
import { CreateSaleForm } from '@/components/sales/create-sale-form'
import { SaleHistoryTable } from '@/components/sales/sale-history-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function SalesPage() {
  const { user } = useAuth()
  const canViewHistory = user?.role === 'Admin' || user?.role === 'Manager'
  const { data, isLoading, isError, refetch } = useSales(canViewHistory)

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl font-medium">Sales</h1>
        <p className="text-sm text-muted-foreground">
          Record a sale and review history.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium">Record a sale</h2>
        <CreateSaleForm />
      </section>

      {canViewHistory && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Sale history</h2>
          {isError ? (
            <div className="flex items-center justify-between rounded-xl border p-4">
              <span className="text-sm text-muted-foreground">
                Failed to load sale history.
              </span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <SaleHistoryTable sales={data} />
          ) : (
            <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
              No sales recorded yet.
            </div>
          )}
        </section>
      )}
    </div>
  )
}
