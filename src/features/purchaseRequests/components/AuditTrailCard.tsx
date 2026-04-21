import { Card } from '@/components/ui/Card'
import { formatDateTime } from '@/lib/format'
import type { PurchaseRequest } from '@/types/purchaseRequest'

export function AuditTrailCard({ request }: { request: PurchaseRequest }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-slate-950">Audit trail</h2>
      <p className="mt-1 text-sm text-slate-500">Every major workflow event is captured for review.</p>

      <div className="mt-6 space-y-4">
        {request.auditTrail.map((entry) => (
          <div key={entry.id} className="relative pl-6">
            <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-slate-900" />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p className="font-semibold text-slate-900">{entry.action}</p>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {formatDateTime(entry.timestamp)}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {entry.actorName} · {entry.actorRole}
              </p>
              {entry.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{entry.note}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
