import { z } from 'zod'

const lineItemSchema = z.object({
  description: z.string().trim().min(3, 'Enter a line description with at least 3 characters.'),
  quantity: z.number({ error: 'Quantity is required.' }).min(1, 'Quantity must be at least 1.'),
  unitPrice: z.number({ error: 'Unit price is required.' }).min(0.01, 'Unit price must be greater than 0.'),
})

export const purchaseRequestFormSchema = z.object({
  requestorName: z.string().trim().min(2, 'Requestor name is required.'),
  requestorId: z.string().trim().min(2, 'Requestor ID is required.'),
  department: z.string().trim().min(2, 'Department is required.'),
  supplier: z.string().trim().min(2, 'Supplier is required.'),
  requestDate: z.string().trim().min(1, 'Request date is required.'),
  lines: z.array(lineItemSchema).min(1, 'Add at least one line item before saving the request.'),
})

export type PurchaseRequestFormValues = z.infer<typeof purchaseRequestFormSchema>

export const purchaseRequestFormDefaults: PurchaseRequestFormValues = {
  requestorName: '',
  requestorId: '',
  department: '',
  supplier: '',
  requestDate: new Date().toISOString().slice(0, 10),
  lines: [
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ],
}
