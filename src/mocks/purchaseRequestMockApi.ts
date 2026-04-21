import {
  createPurchaseRequestRecord,
  findPurchaseRequestById,
  getPurchaseRequestsSnapshot,
  updatePurchaseRequestRecord,
} from '@/mocks/purchaseRequestStore'
import type {
  CreatePurchaseRequestInput,
  DashboardSummary,
  PurchaseRequest,
  PurchaseRequestFilters,
  PurchaseRequestStatus,
  WorkflowActionInput,
} from '@/types/purchaseRequest'

const statusOrder: PurchaseRequestStatus[] = ['Draft', 'PendingApproval', 'Approved', 'Rejected', 'Posted']

class MockApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MockApiError'
  }
}

async function simulateLatency<T>(factory: () => T, delay = 520): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, delay + Math.round(Math.random() * 220)))
  return factory()
}

function calculateLineTotal(quantity: number, unitPrice: number) {
  return Number((quantity * unitPrice).toFixed(2))
}

function calculateRequestTotal(lines: PurchaseRequest['lines']) {
  return Number(lines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2))
}

function sortPurchaseRequests(requests: PurchaseRequest[], filters: PurchaseRequestFilters) {
  const sortBy = filters.sortBy ?? 'requestDate'
  const sortDirection = filters.sortDirection ?? 'desc'

  return [...requests].sort((left, right) => {
    const leftValue = sortBy === 'totalAmount' ? left.totalAmount : new Date(left.requestDate).getTime()
    const rightValue = sortBy === 'totalAmount' ? right.totalAmount : new Date(right.requestDate).getTime()

    return sortDirection === 'asc' ? leftValue - rightValue : rightValue - leftValue
  })
}

function buildDashboardSummary(requests: PurchaseRequest[]): DashboardSummary {
  return {
    totalRequests: requests.length,
    pendingApproval: requests.filter((item) => item.status === 'PendingApproval').length,
    approved: requests.filter((item) => item.status === 'Approved').length,
    rejected: requests.filter((item) => item.status === 'Rejected').length,
    posted: requests.filter((item) => item.status === 'Posted').length,
    draft: requests.filter((item) => item.status === 'Draft').length,
    recentRequests: sortPurchaseRequests(requests, { sortBy: 'requestDate', sortDirection: 'desc' }).slice(0, 5),
    statusBreakdown: statusOrder.map((status) => ({
      status,
      count: requests.filter((item) => item.status === status).length,
    })),
  }
}

function validateWorkflowTransition(request: PurchaseRequest, input: WorkflowActionInput) {
  const actionVerbByType: Partial<Record<WorkflowActionInput['action'], string>> = {
    Approve: 'approve',
    Reject: 'reject',
  }

  if (input.action === 'Submit') {
    if (request.status !== 'Draft') {
      throw new MockApiError('Only draft requests can be submitted for approval.')
    }

    if (request.lines.length === 0) {
      throw new MockApiError('At least one line item is required before submission.')
    }
  }

  if (input.action === 'Approve' || input.action === 'Reject') {
    if (request.status !== 'PendingApproval') {
      throw new MockApiError(`Only requests pending approval can be ${input.action === 'Approve' ? 'approved' : 'rejected'}.`)
    }

    if (input.actorRole !== 'Approver') {
      throw new MockApiError(`Only users with the Approver role can ${actionVerbByType[input.action]} requests.`)
    }

    if (input.actorId === request.requestorId) {
      throw new MockApiError(`Requestors cannot ${actionVerbByType[input.action]} their own requests.`)
    }
  }

  if (input.action === 'Post') {
    if (request.status !== 'Approved') {
      throw new MockApiError('Only approved requests can be posted.')
    }

    if (input.actorRole !== 'Operations') {
      throw new MockApiError('Only Operations users can post approved requests.')
    }
  }
}

function applyWorkflowTransition(request: PurchaseRequest, input: WorkflowActionInput) {
  const timestamp = new Date().toISOString()
  const nextStatusByAction: Record<WorkflowActionInput['action'], PurchaseRequestStatus> = {
    Submit: 'PendingApproval',
    Approve: 'Approved',
    Reject: 'Rejected',
    Post: 'Posted',
  }
  const nextActionByType: Record<WorkflowActionInput['action'], string> = {
    Submit: 'Submitted for approval',
    Approve: 'Approved',
    Reject: 'Rejected',
    Post: 'Posted',
  }

  return {
    ...request,
    status: nextStatusByAction[input.action],
    lastUpdated: timestamp,
    auditTrail: [
      {
        id: crypto.randomUUID(),
        timestamp,
        actorName: input.actorName,
        actorRole: input.actorRole,
        action: nextActionByType[input.action],
        note: input.note,
      },
      ...request.auditTrail,
    ],
  }
}

export const purchaseRequestMockApi = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return simulateLatency(() => buildDashboardSummary(getPurchaseRequestsSnapshot()))
  },

  async listPurchaseRequests(filters: PurchaseRequestFilters): Promise<PurchaseRequest[]> {
    return simulateLatency(() => {
      const searchTerm = filters.search?.trim().toLowerCase()
      const requests = getPurchaseRequestsSnapshot()

      const filteredRequests = requests.filter((request) => {
        const matchesSearch = !searchTerm
          || request.requestorName.toLowerCase().includes(searchTerm)
          || request.supplier.toLowerCase().includes(searchTerm)

        const matchesStatus = !filters.status || filters.status === 'All' || request.status === filters.status

        return matchesSearch && matchesStatus
      })

      return sortPurchaseRequests(filteredRequests, filters)
    })
  },

  async getPurchaseRequestById(requestId: string): Promise<PurchaseRequest> {
    return simulateLatency(() => {
      const request = findPurchaseRequestById(requestId)

      if (!request) {
        throw new MockApiError('The selected purchase request could not be found.')
      }

      return request
    })
  },

  async createPurchaseRequest(input: CreatePurchaseRequestInput): Promise<PurchaseRequest> {
    return simulateLatency(() => {
      const normalizedLines = input.lines.map((line, index) => ({
        id: `line-${Date.now()}-${index + 1}`,
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        lineTotal: calculateLineTotal(line.quantity, line.unitPrice),
      }))

      const request = createPurchaseRequestRecord({
        id: crypto.randomUUID(),
        requestNumber: `PR-2026-${1000 + getPurchaseRequestsSnapshot().length + 1}`,
        requestorName: input.requestorName,
        requestorId: input.requestorId,
        department: input.department,
        supplier: input.supplier,
        requestDate: input.requestDate,
        status: 'Draft',
        lines: normalizedLines,
        totalAmount: calculateRequestTotal(normalizedLines),
        lastUpdated: new Date().toISOString(),
        auditTrail: [
          {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            actorName: input.requestorName,
            actorRole: 'Requestor',
            action: 'Draft created',
          },
        ],
      })

      return request
    }, 760)
  },

  async runWorkflowAction(requestId: string, input: WorkflowActionInput): Promise<PurchaseRequest> {
    return simulateLatency(() => {
      const currentRequest = findPurchaseRequestById(requestId)

      if (!currentRequest) {
        throw new MockApiError('The selected purchase request could not be found.')
      }

      validateWorkflowTransition(currentRequest, input)

      const updatedRequest = updatePurchaseRequestRecord(requestId, (request) => applyWorkflowTransition(request, input))

      if (!updatedRequest) {
        throw new MockApiError('The selected purchase request could not be updated.')
      }

      return updatedRequest
    }, 720)
  },
}
