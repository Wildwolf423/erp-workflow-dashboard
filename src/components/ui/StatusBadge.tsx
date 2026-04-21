import type { PurchaseRequestStatus } from '@/types/purchaseRequest'
import { cn } from '@/lib/utils'

const badgeClasses: Record<PurchaseRequestStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700',
  PendingApproval: 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-800',
  Rejected: 'bg-rose-100 text-rose-800',
  Posted: 'bg-blue-100 text-blue-800',
}

export function StatusBadge({ status }: { status: PurchaseRequestStatus }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', badgeClasses[status])}>
      {status}
    </span>
  )
}
