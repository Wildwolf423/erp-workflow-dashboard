import { Button } from '@/components/ui/Button'
import { SelectInput, TextInput } from '@/components/ui/FormFields'
import type { PurchaseRequestFilters, PurchaseRequestStatus } from '@/types/purchaseRequest'

type PurchaseRequestFiltersBarProps = {
  filters: PurchaseRequestFilters
  onFiltersChange: (filters: PurchaseRequestFilters) => void
}

const statuses: Array<PurchaseRequestStatus | 'All'> = ['All', 'Draft', 'PendingApproval', 'Approved', 'Rejected', 'Posted']

export function PurchaseRequestFiltersBar({
  filters,
  onFiltersChange,
}: PurchaseRequestFiltersBarProps) {
  const hasActiveFilters = Boolean(filters.search) || (filters.status && filters.status !== 'All')

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Filter and sort requests</h2>
          <p className="mt-1 text-sm text-slate-500">Refine the operational queue by supplier, requestor, workflow state, or amount.</p>
        </div>
        <Button
          variant="ghost"
          className="text-slate-600"
          disabled={!hasActiveFilters}
          onClick={() =>
            onFiltersChange({
              search: '',
              status: 'All',
              sortBy: 'requestDate',
              sortDirection: 'desc',
            })
          }
        >
          Reset filters
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr,1fr]">
      <TextInput
        label="Search requestor or supplier"
        hint="Search against requestor name and supplier."
        placeholder="Search by requestor or supplier..."
        value={filters.search ?? ''}
        onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
      />
      <SelectInput
        label="Status"
        value={filters.status ?? 'All'}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            status: event.target.value as PurchaseRequestStatus | 'All',
          })
        }
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status === 'PendingApproval' ? 'Pending Approval' : status}
          </option>
        ))}
      </SelectInput>
      <SelectInput
        label="Sort"
        value={`${filters.sortBy ?? 'requestDate'}:${filters.sortDirection ?? 'desc'}`}
        onChange={(event) => {
          const [sortBy, sortDirection] = event.target.value.split(':') as ['requestDate' | 'totalAmount', 'asc' | 'desc']
          onFiltersChange({ ...filters, sortBy, sortDirection })
        }}
      >
        <option value="requestDate:desc">Newest request date</option>
        <option value="requestDate:asc">Oldest request date</option>
        <option value="totalAmount:desc">Highest amount</option>
        <option value="totalAmount:asc">Lowest amount</option>
      </SelectInput>
      </div>
    </div>
  )
}
