import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { MetricCard } from '@/components/ui/MetricCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDashboardSummaryQuery } from '@/features/purchaseRequests/hooks/usePurchaseRequests'
import { PurchaseRequestsTable } from '@/features/purchaseRequests/components/PurchaseRequestsTable'
import { StatusOverviewCard } from '@/features/purchaseRequests/components/StatusOverviewCard'
import { getErrorMessage } from '@/lib/utils'

export function DashboardPage() {
  const summaryQuery = useDashboardSummaryQuery()

  if (summaryQuery.isLoading) {
    return <LoadingState title="Loading dashboard metrics and recent activity..." />
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <ErrorState
        title="Dashboard data is unavailable"
        description={getErrorMessage(summaryQuery.error, 'The dashboard could not be loaded.')}
        action={
          <Button variant="secondary" onClick={() => summaryQuery.refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  const summary = summaryQuery.data

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operations Overview"
        title="ERP workflow dashboard"
        description="Monitor purchase request volume, approval workload, and posting readiness across the workflow."
        actions={
          <Link to="/requests/new">
            <Button>Create request</Button>
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-5">
        <MetricCard label="Total requests" value={summary.totalRequests} hint="All requests currently in the workspace" />
        <MetricCard label="Pending approval" value={summary.pendingApproval} hint="Waiting on approver review" />
        <MetricCard label="Approved" value={summary.approved} hint="Ready for posting or downstream handling" />
        <MetricCard label="Rejected" value={summary.rejected} hint="Returned to requestors for rework" />
        <MetricCard label="Posted" value={summary.posted} hint="Already released to ERP posting" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr,0.85fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent purchase requests</h2>
              <p className="mt-1 text-sm text-slate-500">Latest requests raised by business users across departments.</p>
            </div>
            <Link to="/requests" className="text-sm font-medium text-blue-700 transition hover:text-blue-900">
              View all requests
            </Link>
          </div>
          <PurchaseRequestsTable requests={summary.recentRequests} />
        </div>

        <div className="space-y-6">
          <StatusOverviewCard summary={summary} />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <h2 className="text-lg font-semibold text-slate-950">Workflow posture</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {summary.pendingApproval > 0
                ? `${summary.pendingApproval} request${summary.pendingApproval === 1 ? '' : 's'} currently need approver attention.`
                : 'No requests are currently waiting for approver attention.'}
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Draft backlog</p>
                <p className="mt-1 text-sm text-slate-700">{summary.draft} requests still in preparation</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Posting readiness</p>
                <p className="mt-1 text-sm text-slate-700">{summary.approved} approved requests are ready for operations handling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
