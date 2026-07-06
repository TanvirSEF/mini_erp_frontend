import { useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { useProducts } from '@/hooks/use-products'
import { useCreateSale } from '@/hooks/use-sales'
import { ApiError } from '@/lib/api-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/format'

type LineItem = { product: Product; quantity: number }

export function CreateSaleForm() {
  const { data } = useProducts({ limit: 100 })
  const createSale = useCreateSale()

  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const products = data?.result ?? []
  const inStockProducts = products.filter((p) => p.stockQuantity > 0)
  const available = inStockProducts.filter(
    (p) => !lineItems.some((li) => li.product._id === p._id)
  )

  const addItem = () => {
    const product = inStockProducts.find((p) => p._id === selectedId)
    if (!product) return
    setLineItems((prev) => [...prev, { product, quantity: 1 }])
    setSelectedId('')
  }

  const setQuantity = (id: string, quantity: number) =>
    setLineItems((prev) =>
      prev.map((li) => (li.product._id === id ? { ...li, quantity } : li))
    )

  const removeItem = (id: string) =>
    setLineItems((prev) => prev.filter((li) => li.product._id !== id))

  const grandTotal = lineItems.reduce(
    (sum, li) => sum + li.product.sellingPrice * li.quantity,
    0
  )

  const handleSubmit = () => {
    setError(null)
    if (lineItems.length === 0) return

    createSale.mutate(
      {
        items: lineItems.map((li) => ({
          productId: li.product._id,
          quantity: li.quantity,
        })),
      },
      {
        onSuccess: () => {
          setLineItems([])
          toast.success('Sale recorded successfully.')
        },
        onError: (err) =>
          setError(err instanceof ApiError ? err.message : 'Failed to record sale.'),
      }
    )
  }

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="grid min-w-[200px] flex-1 gap-1.5">
          <Label htmlFor="product">Product</Label>
          <select
            id="product"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent pr-7 pl-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select a product…</option>
            {available.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} ({product.stockQuantity} in stock)
              </option>
            ))}
          </select>
        </div>
        <Button type="button" onClick={addItem} disabled={!selectedId}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {lineItems.length > 0 ? (
        <div className="space-y-2">
          {lineItems.map((li) => (
            <div key={li.product._id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{li.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(li.product.sellingPrice)} each · {li.product.stockQuantity} in stock
                </p>
              </div>
              <Input
                type="number"
                min="1"
                max={li.product.stockQuantity}
                value={li.quantity}
                onChange={(event) => {
                  const next = Math.floor(Number(event.target.value) || 1)
                  setQuantity(li.product._id, Math.max(1, next))
                }}
                className="w-20"
              />
              <span className="w-24 text-right text-sm tabular-nums">
                {formatCurrency(li.product.sellingPrice * li.quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeItem(li.product._id)}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm font-medium">Grand total</span>
            <span className="text-lg font-semibold tabular-nums">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No products added yet.</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={lineItems.length === 0 || createSale.isPending}
      >
        {createSale.isPending && <Loader2 className="size-4 animate-spin" />}
        Record sale
      </Button>
    </div>
  )
}
