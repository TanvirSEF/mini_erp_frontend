import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Product } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatNumber } from '@/lib/format'

type Props = {
  products: Product[]
  canUpdate: boolean
  canDelete: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsTable({ products, canUpdate, canDelete, onEdit, onDelete }: Props) {
  const [preview, setPreview] = useState<Product | null>(null)

  return (
    <div className="rounded-xl border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="w-[11%]">SKU</TableHead>
            <TableHead className="w-[13%]">Category</TableHead>
            <TableHead className="w-[14%] text-right">Purchase Price</TableHead>
            <TableHead className="w-[14%] text-right">Selling Price</TableHead>
            <TableHead className="w-[9%] text-right">Stock</TableHead>
            {(canUpdate || canDelete) && (
              <TableHead className="w-[7%] text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPreview(product)}
                    className="size-10 shrink-0 cursor-zoom-in overflow-hidden rounded-md ring-1 ring-foreground/10 transition hover:opacity-80"
                    aria-label={`Preview ${product.name} image`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  </button>
                  <span className="min-w-0 truncate font-medium">
                    {product.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="block truncate">{product.sku}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <span className="block truncate">{product.category}</span>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(product.purchasePrice)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(product.sellingPrice)}
              </TableCell>
              <TableCell className="text-right">
                {product.stockQuantity < 5 ? (
                  <Badge variant="destructive">
                    {formatNumber(product.stockQuantity)} left
                  </Badge>
                ) : (
                  <span className="tabular-nums">
                    {formatNumber(product.stockQuantity)}
                  </span>
                )}
              </TableCell>
              {(canUpdate || canDelete) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {canUpdate && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) setPreview(null)
        }}
      >
        <DialogContent className="p-2 sm:max-w-3xl">
          {preview && (
            <>
              <DialogTitle className="sr-only">{preview.name}</DialogTitle>
              <img
                src={preview.image}
                alt={preview.name}
                className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
