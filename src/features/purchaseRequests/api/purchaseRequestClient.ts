import { purchaseRequestMockApi } from '@/mocks/purchaseRequestMockApi'
import type {
  CreatePurchaseRequestInput,
  DashboardSummary,
  PurchaseRequest,
  PurchaseRequestFilters,
  WorkflowActionInput,
} from '@/types/purchaseRequest'

export type PurchaseRequestClient = {
  getDashboardSummary: () => Promise<DashboardSummary>
  listPurchaseRequests: (filters: PurchaseRequestFilters) => Promise<PurchaseRequest[]>
  getPurchaseRequestById: (requestId: string) => Promise<PurchaseRequest>
  createPurchaseRequest: (input: CreatePurchaseRequestInput) => Promise<PurchaseRequest>
  runWorkflowAction: (requestId: string, input: WorkflowActionInput) => Promise<PurchaseRequest>
}

// This indirection keeps the feature layer independent from the current mock implementation.
// Replacing the mock API with a real backend client later should only require changing this export.
export const purchaseRequestClient: PurchaseRequestClient = purchaseRequestMockApi
