import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSession } from '@/app/session-context'
import { useToast } from '@/app/toast-context'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageHeader } from '@/components/ui/PageHeader'
import { TextAreaInput } from '@/components/ui/FormFields'
import { AuditTrailCard } from '@/features/purchaseRequests/components/AuditTrailCard'
import { RequestLinesCard } from '@/features/purchaseRequests/components/RequestLinesCard'
import { RequestSummaryCard } from '@/features/purchaseRequests/components/RequestSummaryCard'
import {
  usePurchaseRequestQuery,
  useWorkflowActionMutation,
} from '@/features/purchaseRequests/hooks/usePurchaseRequests'
import { getErrorMessage } from '@/lib/utils'
import type { WorkflowActionType } from '@/types/purchaseRequest'

const actionLabels: Record<WorkflowActionType, string> = {
  Submit: 'Submit for approval',
  Approve: 'Approve request',
  Reject: 'Reject request',
  Post: 'Post request',
}

export function PurchaseRequestDetailsPage() {
  const { id = '' } = useParams()
  const { currentUser } = useSession()
  const { notify } = useToast()
  const [selectedAction, setSelectedAction] = useState<WorkflowActionType | null>(null)
  const [actionNote, setActionNote] = useState('')

  const requestQuery = usePurchaseRequestQuery(id)
  const actionMutation = useWorkflowActionMutation(id)

  const request = requestQuery.data

  const actionAvailability = useMemo(() => {
    if (!request) {
      return []
    }

    return [
      { action: 'Submit' as const, enabled: request.status === 'Draft', helper: 'Move the request into the approval queue.' },
      {
        action: 'Approve' as const,
        enabled:
          request.status === 'PendingApproval'
          && currentUser.role === 'Approver'
          && currentUser.id !== request.requestorId,
        helper: 'Available to approvers reviewing a pending request.',
      },
      {
        action: 'Reject' as const,
        enabled:
          request.status === 'PendingApproval'
          && currentUser.role === 'Approver'
          && currentUser.id !== request.requestorId,
        helper: 'Use this when a request needs revision or should not proceed.',
      },
      {
        action: 'Post' as const,
        enabled: request.status === 'Approved' && currentUser.role === 'Operations',
        helper: 'Release the approved request into downstream ERP posting.',
      },
    ]
  }, [currentUser.id, currentUser.role, request])

  const handleConfirmAction = async () => {
    if (!selectedAction) {
      return
    }

    const updatedRequest = await actionMutation.mutateAsync({
      action: selectedAction,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      note: actionNote || undefined,
    })

    notify({
      tone: 'success',
      title: `${actionLabels[selectedAction]} completed`,
      description: `${updatedRequest.requestNumber} is now ${updatedRequest.status}.`,
    })

    setSelectedAction(null)
    setActionNote('')
  }

  if (requestQuery.isLoading) {
    return <LoadingState title="Loading purchase request details..." />
  }

  if (requestQuery.isError || !request) {
    return (
      <ErrorState
        title="Purchase request details are unavailable"
        description={getErrorMessage(requestQuery.error, 'The selected request could not be loaded.')}
        action={
          <Button variant="secondary" onClick={() => requestQuery.refetch()}>
            Reload
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Request details"
        title={request.requestNumber}
        description="Review request metadata, line items, workflow history, and run the next workflow step."
      />

      <div className="grid gap-6 xl:grid-cols-[1.55fr,0.85fr]">
        <div className="space-y-6">
          <RequestSummaryCard request={request} />
          <RequestLinesCard request={request} />
          <AuditTrailCard request={request} />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
            <h2 className="text-lg font-semibold text-slate-950">Workflow actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Current actor: {currentUser.name} ({currentUser.role})
            </p>

            <div className="mt-6 space-y-3">
              {actionAvailability.map((item) => (
                <div key={item.action} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{actionLabels[item.action]}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.helper}</p>
                    </div>
                    <Button
                      variant={item.action === 'Reject' ? 'danger' : 'secondary'}
                      disabled={!item.enabled}
                      onClick={() => setSelectedAction(item.action)}
                    >
                      {actionLabels[item.action]}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(selectedAction)}
        title={selectedAction ? actionLabels[selectedAction] : 'Confirm action'}
        description="This action updates the workflow state and appends a new audit trail entry."
        confirmLabel={selectedAction ? actionLabels[selectedAction] : 'Confirm'}
        confirmTone={selectedAction === 'Reject' ? 'danger' : 'primary'}
        isProcessing={actionMutation.isPending}
        onClose={() => {
          setSelectedAction(null)
          setActionNote('')
        }}
        onConfirm={handleConfirmAction}
      >
        <TextAreaInput
          label="Optional note"
          placeholder="Add context for the audit trail..."
          value={actionNote}
          onChange={(event) => setActionNote(event.target.value)}
        />
        {actionMutation.isError ? (
          <p className="mt-3 text-sm font-medium text-rose-600">{getErrorMessage(actionMutation.error)}</p>
        ) : null}
      </ConfirmDialog>
    </div>
  )
}
