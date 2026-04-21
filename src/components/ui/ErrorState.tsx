import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

type ErrorStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <Card className="border-rose-200 bg-rose-50 p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-700">
          <span className="text-lg font-semibold">!</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-rose-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-rose-800">{description}</p>
        </div>
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  )
}
