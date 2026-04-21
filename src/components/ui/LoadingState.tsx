import { Card } from '@/components/ui/Card'

export function LoadingState({
  title = 'Loading data...',
  description = 'Preparing the next view and retrieving the latest workflow information.',
}: {
  title?: string
  description?: string
}) {
  return (
    <Card className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-slate-100">
          <div className="h-5 w-5 rounded-full bg-slate-300" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-64 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="flex animate-pulse flex-col gap-3">
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
      </div>
      <p className="mt-6 text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
    </Card>
  )
}
