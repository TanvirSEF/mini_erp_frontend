import type { Sale } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/format'

type Props = {
  sales: Sale[]
}

export function SaleHistoryTable({ sales }: Props) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => {
            const units = sale.items.reduce((sum, item) => sum + item.quantity, 0)
            return (
              <TableRow key={sale._id}>
                <TableCell>{formatDate(sale.createdAt)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {units} units · {sale.items.length} products
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(sale.grandTotal)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
