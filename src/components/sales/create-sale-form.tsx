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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

  const selectedProduct = products.find((p) => p._id === selectedId)

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <div className="flex items-end gap-2.5 max-w-md">
        <div className="grid flex-1 gap-1.5">
          <Label htmlFor="product">Product</Label>
          <Select
            value={selectedId || undefined}
            onValueChange={(val) => setSelectedId(val || '')}
          >
            <SelectTrigger id="product" className="w-full">
              <SelectValue placeholder="Select a product…">
                {selectedProduct ? `${selectedProduct.name} (${selectedProduct.stockQuantity} in stock)` : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {available.map((product) => (
                <SelectItem key={product._id} value={product._id}>
                  {product.name} ({product.stockQuantity} in stock)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
