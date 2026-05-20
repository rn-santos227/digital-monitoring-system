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

export const requestCloseForRequiredFields = async ({
  formValues,
  requiredKeys,
  showDialog,
}: RequestCloseForRequiredFieldsInput): Promise<boolean> => {
  const keysToCheck = requiredKeys?.length ? requiredKeys : Object.keys(formValues)

  const hasContent = keysToCheck.some((key) => hasFieldContent(formValues[key]))

  if (!hasContent) {
    return true
  }

  const result = await showDialog({
    type: 'question',
    title: 'Discard unsaved form changes?',
    message: 'Some required fields already contain values. Closing now will discard your current inputs.',
    confirmLabel: 'Discard',
    cancelLabel: 'Continue editing',
  })

  return result.confirmed
}
