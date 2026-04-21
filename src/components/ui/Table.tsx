import type { PropsWithChildren } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type TableProps = PropsWithChildren<{
  className?: string
}>

export function Table({ children, className }: TableProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">{children}</table>
      </div>
    </Card>
  )
}
