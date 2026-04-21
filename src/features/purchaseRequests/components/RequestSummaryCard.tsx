import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/format'
import type { PurchaseRequest } from '@/types/purchaseRequest'

export function RequestSummaryCard({ request }: { request: PurchaseRequest }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{request.requestNumber}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{request.supplier}</h2>
          <p className="mt-2 text-sm text-slate-500">
            Requested by {request.requestorName} · {request.department}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <dl className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetadataItem label="Request date" value={formatDate(request.requestDate)} />
        <MetadataItem label="Total amount" value={formatCurrency(request.totalAmount)} />
        <MetadataItem label="Line items" value={`${request.lines.length}`} />
        <MetadataItem label="Last updated" value={formatDate(request.lastUpdated)} />
      </dl>
    </Card>
  )
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  )
}
