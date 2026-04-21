export const queryKeys = {
  dashboard: ['dashboard'] as const,
  purchaseRequests: (filtersKey: string) => ['purchase-requests', filtersKey] as const,
  purchaseRequest: (requestId: string) => ['purchase-request', requestId] as const,
}
