import { Card } from '@/components/ui/Card'
import { formatCompactNumber } from '@/lib/format'

type MetricCardProps = {
  label: string
  value: number
  hint: string
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{formatCompactNumber(value)}</p>
      <p className="mt-3 text-sm text-slate-500">{hint}</p>
    </Card>
  )
}
