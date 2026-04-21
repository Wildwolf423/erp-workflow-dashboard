import { useMemo } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SelectInput, TextInput } from '@/components/ui/FormFields'
import { formatCurrency } from '@/lib/format'
import {
  purchaseRequestFormDefaults,
  purchaseRequestFormSchema,
  type PurchaseRequestFormValues,
} from '@/features/purchaseRequests/schemas/purchaseRequestFormSchema'

type PurchaseRequestFormProps = {
  initialValues?: Partial<PurchaseRequestFormValues>
  isSubmitting?: boolean
  submitError?: string
  onSubmit: (values: PurchaseRequestFormValues) => void
}

const departmentOptions = [
  'Procurement',
  'Finance',
  'Operations',
  'Field Services',
  'Human Resources',
  'IT Services',
]

export function PurchaseRequestForm({ initialValues, isSubmitting, submitError, onSubmit }: PurchaseRequestFormProps) {
  const defaultValues = useMemo(
    () => ({
      ...purchaseRequestFormDefaults,
      ...initialValues,
      lines: initialValues?.lines ?? purchaseRequestFormDefaults.lines,
    }),
    [initialValues],
  )

  const form = useForm<PurchaseRequestFormValues>({
    resolver: zodResolver(purchaseRequestFormSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  })

  const watchedLines = useWatch({
    control: form.control,
    name: 'lines',
  })

  const totalAmount = useMemo(() => {
    return watchedLines.reduce((sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0), 0)
  }, [watchedLines])

  const hasVisibleErrors = form.formState.submitCount > 0 && !form.formState.isValid
  const fieldErrorCount = Object.keys(form.formState.errors).length

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {submitError ? (
        <Card className="border border-rose-200 bg-rose-50 p-5">
          <h2 className="text-sm font-semibold text-rose-900">Unable to save draft</h2>
          <p className="mt-2 text-sm leading-6 text-rose-800">{submitError}</p>
        </Card>
      ) : null}

      {hasVisibleErrors ? (
        <Card className="border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">Please review the highlighted fields</h2>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            {fieldErrorCount} validation issue{fieldErrorCount === 1 ? '' : 's'} must be resolved before the draft can be saved.
          </p>
        </Card>
      ) : null}

      <Card className="p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <TextInput label="Requestor name" required hint="Person creating the request." error={form.formState.errors.requestorName?.message} {...form.register('requestorName')} />
          <TextInput label="Requestor ID" required hint="Reference identifier used by the ERP system." error={form.formState.errors.requestorId?.message} {...form.register('requestorId')} />
          <SelectInput label="Department" required error={form.formState.errors.department?.message} {...form.register('department')}>
            <option value="">Select department</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </SelectInput>
          <TextInput label="Supplier" required hint="Vendor or service provider name." error={form.formState.errors.supplier?.message} className="md:col-span-2" {...form.register('supplier')} />
          <TextInput label="Request date" required type="date" error={form.formState.errors.requestDate?.message} {...form.register('requestDate')} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Line items</h2>
            <p className="mt-1 text-sm text-slate-500">Add the goods or services that should be reviewed and approved.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({
                description: '',
                quantity: 1,
                unitPrice: 0,
              })
            }
          >
            Add line
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {fields.map((field, index) => {
            const lineError = form.formState.errors.lines?.[index]
            const lineTotal = (Number(watchedLines[index]?.quantity) || 0) * (Number(watchedLines[index]?.unitPrice) || 0)

            return (
              <div key={field.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-4 lg:grid-cols-[2.2fr,0.8fr,1fr,auto]">
                  <TextInput
                    label={`Line item ${index + 1}`}
                    required
                    hint="Item, service, or expense description."
                    error={lineError?.description?.message}
                    placeholder="Describe the requested good or service"
                    {...form.register(`lines.${index}.description`)}
                  />
                  <TextInput
                    label="Quantity"
                    type="number"
                    min={1}
                    required
                    error={lineError?.quantity?.message}
                    {...form.register(`lines.${index}.quantity`, { valueAsNumber: true })}
                  />
                  <TextInput
                    label="Unit price"
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    error={lineError?.unitPrice?.message}
                    {...form.register(`lines.${index}.unitPrice`, { valueAsNumber: true })}
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-rose-600 hover:bg-rose-50"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  Line total: <span className="text-slate-950">{formatCurrency(lineTotal)}</span>
                </p>
              </div>
            )
          })}
        </div>

        {form.formState.errors.lines?.message ? (
          <p className="mt-3 text-sm font-medium text-rose-600">{form.formState.errors.lines.message}</p>
        ) : null}
      </Card>

      <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Calculated total</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{formatCurrency(totalAmount)}</p>
          <p className="mt-2 text-sm text-slate-500">
            Drafts are saved with the current line structure and can be submitted for approval later.
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving draft...' : 'Create purchase request'}
        </Button>
      </Card>
    </form>
  )
}
