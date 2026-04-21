import { useNavigate } from 'react-router-dom'
import { useSession } from '@/app/session-context'
import { useToast } from '@/app/toast-context'
import { PageHeader } from '@/components/ui/PageHeader'
import { PurchaseRequestForm } from '@/features/purchaseRequests/components/PurchaseRequestForm'
import { useCreatePurchaseRequestMutation } from '@/features/purchaseRequests/hooks/usePurchaseRequests'
import { getErrorMessage } from '@/lib/utils'
import type { PurchaseRequestFormValues } from '@/features/purchaseRequests/schemas/purchaseRequestFormSchema'

export function CreatePurchaseRequestPage() {
  const navigate = useNavigate()
  const { currentUser } = useSession()
  const { notify } = useToast()
  const createMutation = useCreatePurchaseRequestMutation()

  const handleSubmit = async (values: PurchaseRequestFormValues) => {
    try {
      const request = await createMutation.mutateAsync(values)

      notify({
        tone: 'success',
        title: 'Purchase request created',
        description: `${request.requestNumber} was saved as a draft.`,
      })

      navigate(`/requests/${request.id}`)
    } catch (error) {
      notify({
        tone: 'error',
        title: 'Draft could not be created',
        description: getErrorMessage(error, 'Please review the form and try again.'),
      })
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="New workflow item"
        title="Create purchase request"
        description="Capture request metadata, add line items, and save the request as a draft before submission."
      />

      <PurchaseRequestForm
        initialValues={{
          requestorName: currentUser.name,
          requestorId: currentUser.id,
          department: currentUser.department,
        }}
        isSubmitting={createMutation.isPending}
        submitError={createMutation.isError ? getErrorMessage(createMutation.error, 'The request could not be saved.') : undefined}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
