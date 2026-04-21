import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type CardProps = PropsWithChildren<{
  className?: string
}>

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5', className)}>
      {children}
    </div>
  )
}
