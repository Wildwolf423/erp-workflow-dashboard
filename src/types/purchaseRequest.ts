export type PurchaseRequestStatus =
  | 'Draft'
  | 'PendingApproval'
  | 'Approved'
  | 'Rejected'
  | 'Posted'

export type ActorRole = 'Requestor' | 'Approver' | 'Operations'

export type WorkflowActionType = 'Submit' | 'Approve' | 'Reject' | 'Post'

export type AppUser = {
  id: string
  name: string
  role: ActorRole
  department: string
}

export type PurchaseRequestLine = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type AuditLogEntry = {
  id: string
  timestamp: string
  actorName: string
  actorRole: ActorRole
  action: string
  note?: string
}

export type PurchaseRequest = {
  id: string
  requestNumber: string
  requestorName: string
  requestorId: string
  department: string
  supplier: string
  requestDate: string
  status: PurchaseRequestStatus
  lines: PurchaseRequestLine[]
  totalAmount: number
  lastUpdated: string
  auditTrail: AuditLogEntry[]
}

export type DashboardSummary = {
  totalRequests: number
  pendingApproval: number
  approved: number
  rejected: number
  posted: number
  draft: number
  recentRequests: PurchaseRequest[]
  statusBreakdown: {
    status: PurchaseRequestStatus
    count: number
  }[]
}

export type PurchaseRequestFilters = {
  search?: string
  status?: PurchaseRequestStatus | 'All'
  sortBy?: 'requestDate' | 'totalAmount'
  sortDirection?: 'asc' | 'desc'
}

export type CreatePurchaseRequestInput = {
  requestorName: string
  requestorId: string
  department: string
  supplier: string
  requestDate: string
  lines: {
    description: string
    quantity: number
    unitPrice: number
  }[]
}

export type WorkflowActionInput = {
  action: WorkflowActionType
  actorId: string
  actorName: string
  actorRole: ActorRole
  note?: string
}
