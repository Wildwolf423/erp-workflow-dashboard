import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/format'
import type { PurchaseRequest } from '@/types/purchaseRequest'

export function RequestLinesCard({ request }: { request: PurchaseRequest }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-950">Line items</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Description', 'Quantity', 'Unit Price', 'Line Total'].map((label) => (
                <th key={label} className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {request.lines.map((line) => (
              <tr key={line.id}>
                <td className="px-6 py-4 font-medium text-slate-800">{line.description}</td>
                <td className="px-6 py-4 text-slate-600">{line.quantity}</td>
                <td className="px-6 py-4 text-slate-600">{formatCurrency(line.unitPrice)}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(line.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50">
            <tr>
              <td className="px-6 py-4 text-sm font-semibold text-slate-700" colSpan={3}>
                Total
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-950">{formatCurrency(request.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
