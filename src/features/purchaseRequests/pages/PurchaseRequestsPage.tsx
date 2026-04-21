import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { PurchaseRequestFiltersBar } from '@/features/purchaseRequests/components/PurchaseRequestFiltersBar'
import { PurchaseRequestsTable } from '@/features/purchaseRequests/components/PurchaseRequestsTable'
import { usePurchaseRequestsQuery } from '@/features/purchaseRequests/hooks/usePurchaseRequests'
import { getErrorMessage } from '@/lib/utils'
import type { PurchaseRequestFilters, PurchaseRequestStatus } from '@/types/purchaseRequest'

function parseFilters(searchParams: URLSearchParams): PurchaseRequestFilters {
  return {
    search: searchParams.get('search') ?? '',
    status: (searchParams.get('status') as PurchaseRequestStatus | 'All' | null) ?? 'All',
    sortBy: (searchParams.get('sortBy') as PurchaseRequestFilters['sortBy'] | null) ?? 'requestDate',
    sortDirection: (searchParams.get('sortDirection') as PurchaseRequestFilters['sortDirection'] | null) ?? 'desc',
  }
}

export function PurchaseRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const requestsQuery = usePurchaseRequestsQuery(filters)

  const updateFilters = (nextFilters: PurchaseRequestFilters) => {
    const nextSearchParams = new URLSearchParams()

    if (nextFilters.search) {
      nextSearchParams.set('search', nextFilters.search)
    }

    if (nextFilters.status && nextFilters.status !== 'All') {
      nextSearchParams.set('status', nextFilters.status)
    }

    if (nextFilters.sortBy) {
      nextSearchParams.set('sortBy', nextFilters.sortBy)
    }

    if (nextFilters.sortDirection) {
      nextSearchParams.set('sortDirection', nextFilters.sortDirection)
    }

    setSearchParams(nextSearchParams)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operational queue"
        title="Purchase requests"
        description="Browse, filter, and review requests moving through the ERP approval lifecycle."
        actions={
          <Link to="/requests/new">
            <Button>Create request</Button>
          </Link>
        }
      />

      <PurchaseRequestFiltersBar filters={filters} onFiltersChange={updateFilters} />

      {!requestsQuery.isLoading && !requestsQuery.isError && requestsQuery.data ? (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing <span className="font-semibold text-slate-700">{requestsQuery.data.length}</span> request
            {requestsQuery.data.length === 1 ? '' : 's'}
          </p>
          <p>Click any row to open the request details page.</p>
        </div>
      ) : null}

      {requestsQuery.isLoading ? (
        <LoadingState title="Loading purchase requests..." />
      ) : requestsQuery.isError ? (
        <ErrorState
          title="Purchase requests are unavailable"
          description={getErrorMessage(requestsQuery.error, 'The request list could not be loaded.')}
          action={
            <Button variant="secondary" onClick={() => requestsQuery.refetch()}>
              Reload
            </Button>
          }
        />
      ) : requestsQuery.data && requestsQuery.data.length > 0 ? (
        <PurchaseRequestsTable requests={requestsQuery.data} />
      ) : (
        <EmptyState
          title="No requests match the current filters"
          description="Try adjusting the status or search terms, or create a new request to start the workflow."
          action={
            <Link to="/requests/new">
              <Button>Create request</Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
