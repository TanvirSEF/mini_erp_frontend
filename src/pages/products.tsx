import { useEffect, useState } from 'react'
import type { Product, ProductQuery } from '@/types'
import { useAuth } from '@/context/auth-context'
import { PERMISSIONS } from '@/lib/permissions'
import { useProducts } from '@/hooks/use-products'
import { ProductsToolbar } from '@/components/products/products-toolbar'
import { ProductsTable } from '@/components/products/products-table'
import { ProductFormDialog } from '@/components/products/product-form-dialog'
import { DeleteProductDialog } from '@/components/products/delete-product-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const PAGE_SIZE = 10

export function ProductsPage() {
  const { hasPermission } = useAuth()
  const canCreate = hasPermission(PERMISSIONS.PRODUCT_CREATE)
  const canUpdate = hasPermission(PERMISSIONS.PRODUCT_UPDATE)
  const canDelete = hasPermission(PERMISSIONS.PRODUCT_DELETE)

  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      setSearchTerm(searchInput)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const query: ProductQuery = { searchTerm, sort, page, limit: PAGE_SIZE }
  const { data, isLoading, isError, refetch } = useProducts(query)

  const products = data?.result ?? []
  const totalPage = data?.meta.totalPage ?? 1

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-medium">Products</h1>
        <p className="text-sm text-muted-foreground">Manage your inventory.</p>
      </div>

      <ProductsToolbar
        search={searchInput}
        onSearchChange={setSearchInput}
        sort={sort}
        onSortChange={(value) => {
          setSort(value)
          setPage(1)
        }}
        canCreate={canCreate}
        onAdd={openCreate}
      />

      {isError ? (
        <div className="flex items-center justify-between rounded-xl border p-4">
          <span className="text-sm text-muted-foreground">
            Failed to load products.
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-sm text-muted-foreground">
          {searchTerm ? 'No products match your search.' : 'No products yet.'}
        </div>
      ) : (
        <ProductsTable
          products={products}
          canUpdate={canUpdate}
          canDelete={canDelete}
          onEdit={openEdit}
          onDelete={(product) => setDeleting(product)}
        />
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPage}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
      />

      <DeleteProductDialog
        product={deleting}
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      />
    </div>
  )
}
