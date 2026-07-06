import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
  canManage: boolean
  onAdd: () => void
}

const sortOptions = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: 'sellingPrice', label: 'Price: Low to High' },
  { value: '-sellingPrice', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
]

export function ProductsToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  canManage,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, SKU, category…"
          className="pl-8"
        />
      </div>
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        className="h-8 rounded-lg border border-input bg-transparent px-2 pr-7 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {canManage && (
        <Button onClick={onAdd}>
          <Plus className="size-4" />
          Add product
        </Button>
      )}
    </div>
  )
}
