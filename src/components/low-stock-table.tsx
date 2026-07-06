import type { Product } from '@/types'
import { formatCurrency } from '@/lib/format'

type Props = {
  products: Product[]
}

export function LowStockTable({ products }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Product
            </th>
            <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              SKU
            </th>
            <th className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Category
            </th>
            <th className="px-5 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Price
            </th>
            <th className="px-5 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Stock
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product._id}
              className={
                index !== products.length - 1
                  ? 'border-b border-slate-50'
                  : ''
              }
            >
              <td className="px-5 py-3 font-medium text-slate-900">
                {product.name}
              </td>
              <td className="px-5 py-3 text-slate-500">{product.sku}</td>
              <td className="px-5 py-3 text-slate-500">{product.category}</td>
              <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                {formatCurrency(product.sellingPrice)}
              </td>
              <td className="px-5 py-3 text-right">
                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[12px] font-semibold text-red-600">
                  {product.stockQuantity} left
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
