import type { DialogInput } from '~/composables/useDialog'

type FormFieldValue = string | number | boolean | null | undefined | unknown[]

type RequestCloseForRequiredFieldsInput = {
  formValues: Record<string, FormFieldValue>
  requiredKeys?: string[]
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

type RequestCloseForChangedValuesInput = {
  formValues: Record<string, FormFieldValue>
  originalValues: Record<string, FormFieldValue>
  keysToCompare?: string[]
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

const areValuesEqual = (left: FormFieldValue, right: FormFieldValue): boolean => {
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false
    }

    return left.every((value, index) => value === right[index])
  }

  return left === right
}

export const requestCloseForChangedValues = async ({
  formValues,
  originalValues,
  keysToCompare,
  showDialog,
}: RequestCloseForChangedValuesInput): Promise<boolean> => {
  const resolvedKeys = keysToCompare?.length
    ? keysToCompare
    : Array.from(new Set([...Object.keys(formValues), ...Object.keys(originalValues)]))

  const hasChanges = resolvedKeys.some((key) => !areValuesEqual(formValues[key], originalValues[key]))

  if (!hasChanges) {
    return true
  }

  const result = await showDialog({
    type: 'question',
    title: 'Discard unsaved form changes?',
    message: 'Form values were changed from the original values. Closing now will discard your current updates.',
    confirmLabel: 'Discard',
    cancelLabel: 'Continue editing',
  })

  return result.confirmed
}

export const resetFormValues = (
  targetFormValues: Record<string, FormFieldValue>,
  originalValues: Record<string, FormFieldValue>,
): void => {
  Object.keys(originalValues).forEach((key) => {
    const nextValue = originalValues[key]
    targetFormValues[key] = Array.isArray(nextValue) ? [...nextValue] : nextValue
  })
}
