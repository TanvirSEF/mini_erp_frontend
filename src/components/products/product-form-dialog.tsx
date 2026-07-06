import { useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import type { Product } from '@/types'
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products'
import { ApiError } from '@/lib/api-error'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormState = {
  name: string
  sku: string
  category: string
  purchasePrice: string
  sellingPrice: string
  stockQuantity: string
}

const emptyForm: FormState = {
  name: '',
  sku: '',
  category: '',
  purchasePrice: '',
  sellingPrice: '',
  stockQuantity: '',
}

const fromProduct = (product: Product): FormState => ({
  name: product.name,
  sku: product.sku,
  category: product.category,
  purchasePrice: String(product.purchasePrice),
  sellingPrice: String(product.sellingPrice),
  stockQuantity: String(product.stockQuantity),
})

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductFormDialog({ open, onOpenChange, product }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? 'Edit product' : 'Add product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the product details.' : 'Fill in the product details.'}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          key={product?._id ?? 'create'}
          product={product}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

type FormProps = {
  product?: Product | null
  onClose: () => void
}

function ProductForm({ product, onClose }: FormProps) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState<FormState>(() =>
    product ? fromProduct(product) : emptyForm
  )
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isPending = createMutation.isPending || updateMutation.isPending

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleError = (err: unknown) =>
    setError(err instanceof ApiError ? err.message : 'Something went wrong.')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!isEdit && !image) {
      setError('Product image is required.')
      return
    }

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    if (image) data.append('file', image)

    if (isEdit && product) {
      updateMutation.mutate(
        { id: product._id, data },
        { onSuccess: onClose, onError: handleError }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: onClose,
        onError: handleError,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          value={form.sku}
          onChange={(event) => update('sku', event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={form.category}
          onChange={(event) => update('category', event.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="purchasePrice">Purchase</Label>
          <Input
            id="purchasePrice"
            type="number"
            min="0"
            step="0.01"
            value={form.purchasePrice}
            onChange={(event) => update('purchasePrice', event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sellingPrice">Selling</Label>
          <Input
            id="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.sellingPrice}
            onChange={(event) => update('sellingPrice', event.target.value)}
            required
          />
        </div>
        <div className="col-span-2 grid gap-2 sm:col-span-1">
          <Label htmlFor="stockQuantity">Stock</Label>
          <Input
            id="stockQuantity"
            type="number"
            min="0"
            step="1"
            value={form.stockQuantity}
            onChange={(event) => update('stockQuantity', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">
          {isEdit ? 'Replace image (optional)' : 'Image'}
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          required={!isEdit}
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? 'Save changes' : 'Create product'}
        </Button>
      </DialogFooter>
    </form>
  )
}
