import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { purchaseRequestClient } from '@/features/purchaseRequests/api/purchaseRequestClient'
import { queryKeys } from '@/lib/queryKeys'
import type {
  CreatePurchaseRequestInput,
  PurchaseRequestFilters,
  WorkflowActionInput,
} from '@/types/purchaseRequest'

function toFilterKey(filters: PurchaseRequestFilters) {
  return JSON.stringify(filters)
}

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: purchaseRequestClient.getDashboardSummary,
  })
}

export function usePurchaseRequestsQuery(filters: PurchaseRequestFilters) {
  return useQuery({
    queryKey: queryKeys.purchaseRequests(toFilterKey(filters)),
    queryFn: () => purchaseRequestClient.listPurchaseRequests(filters),
  })
}

export function usePurchaseRequestQuery(requestId: string) {
  return useQuery({
    queryKey: queryKeys.purchaseRequest(requestId),
    queryFn: () => purchaseRequestClient.getPurchaseRequestById(requestId),
    enabled: Boolean(requestId),
  })
}

export function useCreatePurchaseRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreatePurchaseRequestInput) => purchaseRequestClient.createPurchaseRequest(input),
    onSuccess: async (request) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: ['purchase-requests'] }),
      ])

      queryClient.setQueryData(queryKeys.purchaseRequest(request.id), request)
    },
  })
}

export function useWorkflowActionMutation(requestId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: WorkflowActionInput) => purchaseRequestClient.runWorkflowAction(requestId, input),
    onSuccess: async (request) => {
      queryClient.setQueryData(queryKeys.purchaseRequest(request.id), request)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: ['purchase-requests'] }),
      ])
    },
  })
}
