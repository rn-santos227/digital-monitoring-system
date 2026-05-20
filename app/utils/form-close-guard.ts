import type { DialogInput } from '~/composables/useDialog'

type FormFieldValue = string | number | boolean | null | undefined | unknown[]

type RequestCloseForRequiredFieldsInput = {
  formValues: Record<string, FormFieldValue>
  requiredKeys?: string[]
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

const hasFieldContent = (value: FormFieldValue): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (typeof value === 'number') {
    return true
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return Boolean(value)
}

