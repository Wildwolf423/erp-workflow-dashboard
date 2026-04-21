import { Card } from '@/components/ui/Card'
import type { DashboardSummary } from '@/types/purchaseRequest'

export function StatusOverviewCard({ summary }: { summary: DashboardSummary }) {
  const total = summary.totalRequests || 1

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Workflow mix</h2>
          <p className="mt-1 text-sm text-slate-500">Current distribution of request statuses.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {summary.statusBreakdown.map((item) => (
          <div key={item.status}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.status}</span>
              <span className="text-slate-500">{item.count}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-900"
                style={{ width: `${(item.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
