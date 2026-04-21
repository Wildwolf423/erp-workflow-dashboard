import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  confirmTone?: 'primary' | 'danger'
  children?: ReactNode
  onConfirm: () => void
  onClose: () => void
  isProcessing?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmTone = 'primary',
  children,
  onConfirm,
  onClose,
  isProcessing,
}: ConfirmDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant={confirmTone} onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
