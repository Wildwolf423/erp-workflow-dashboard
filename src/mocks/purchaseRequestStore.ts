import { seedPurchaseRequests } from '@/mocks/data'
import type { PurchaseRequest } from '@/types/purchaseRequest'

let purchaseRequests = structuredClone(seedPurchaseRequests) as PurchaseRequest[]

export function getPurchaseRequestsSnapshot() {
  return structuredClone(purchaseRequests)
}

export function findPurchaseRequestById(requestId: string) {
  const request = purchaseRequests.find((item) => item.id === requestId)
  return request ? structuredClone(request) : undefined
}

export function createPurchaseRequestRecord(request: PurchaseRequest) {
  purchaseRequests = [structuredClone(request), ...purchaseRequests]
  return structuredClone(request)
}

export function updatePurchaseRequestRecord(requestId: string, updater: (request: PurchaseRequest) => PurchaseRequest) {
  const requestIndex = purchaseRequests.findIndex((item) => item.id === requestId)

  if (requestIndex === -1) {
    return undefined
  }

  const updatedRequest = updater(structuredClone(purchaseRequests[requestIndex]))
  purchaseRequests[requestIndex] = updatedRequest

  return structuredClone(updatedRequest)
}
