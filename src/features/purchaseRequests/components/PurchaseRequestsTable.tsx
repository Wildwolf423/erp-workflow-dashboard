import { Link, useNavigate } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Table } from '@/components/ui/Table'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PurchaseRequest } from '@/types/purchaseRequest'

export function PurchaseRequestsTable({ requests }: { requests: PurchaseRequest[] }) {
  const navigate = useNavigate()

  return (
    <Table>
      <thead className="bg-slate-50">
        <tr>
          {['Request', 'Requestor', 'Supplier', 'Request Date', 'Status', 'Total', 'Action'].map((label) => (
            <th key={label} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white">
        {requests.map((request) => (
          <tr
            key={request.id}
            tabIndex={0}
            className={cn(
              'cursor-pointer transition hover:bg-slate-50/80 focus-visible:bg-blue-50 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-200',
            )}
            onClick={() => navigate(`/requests/${request.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigate(`/requests/${request.id}`)
              }
            }}
            aria-label={`Open details for ${request.requestNumber}`}
          >
            <td className="px-5 py-4">
              <Link
                to={`/requests/${request.id}`}
                className="font-semibold text-slate-900 transition hover:text-blue-700 focus:outline-none"
                onClick={(event) => event.stopPropagation()}
              >
                {request.requestNumber}
              </Link>
              <p className="mt-1 text-xs text-slate-500">{request.department}</p>
            </td>
            <td className="px-5 py-4 text-slate-700">{request.requestorName}</td>
            <td className="px-5 py-4 text-slate-700">{request.supplier}</td>
            <td className="px-5 py-4 text-slate-700">{formatDate(request.requestDate)}</td>
            <td className="px-5 py-4">
              <StatusBadge status={request.status} />
            </td>
            <td className="px-5 py-4 font-medium text-slate-900">{formatCurrency(request.totalAmount)}</td>
            <td className="px-5 py-4">
              <Link
                to={`/requests/${request.id}`}
                className="text-sm font-medium text-blue-700 transition hover:text-blue-900 focus:outline-none"
                onClick={(event) => event.stopPropagation()}
              >
                View details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
