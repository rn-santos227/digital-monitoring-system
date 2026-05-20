import type { DialogInput } from '~/composables/useDialog'

type FormFieldValue = string | number | boolean | null | undefined | unknown[]

type FormShape = Record<string, FormFieldValue>

type RequestCloseForRequiredFieldsInput<TFormValues extends object> = {
  formValues: TFormValues
  requiredKeys?: string[]
  shouldConfirmWhenEmpty?: boolean
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

type RequestCloseForChangedValuesInput<TFormValues extends object, TOriginalValues extends object> = {
  formValues: TFormValues
  originalValues: TOriginalValues
  keysToCompare?: string[]
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

const toFormShape = (values: object): FormShape => {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value as FormFieldValue]),
  ) as FormShape
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

export const requestCloseForRequiredFields = async <TFormValues extends object>({
  formValues,
  requiredKeys,
  shouldConfirmWhenEmpty = true,
  showDialog,
}: RequestCloseForRequiredFieldsInput<TFormValues>): Promise<boolean> => {
  const normalizedFormValues = toFormShape(formValues)
  const keysToCheck = requiredKeys?.length ? requiredKeys : Object.keys(normalizedFormValues)

  const hasContent = keysToCheck.some((key) => hasFieldContent(normalizedFormValues[key] ?? null))

  if (!hasContent && !shouldConfirmWhenEmpty) {
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

    return left.every((value, index) => value === (right[index] ?? undefined))
  }

  return left === right
}

export const requestCloseForChangedValues = async <TFormValues extends object, TOriginalValues extends object>({
  formValues,
  originalValues,
  keysToCompare,
  showDialog,
}: RequestCloseForChangedValuesInput<TFormValues, TOriginalValues>): Promise<boolean> => {
  const normalizedFormValues = toFormShape(formValues)
  const normalizedOriginalValues = toFormShape(originalValues)
  const resolvedKeys = keysToCompare?.length
    ? keysToCompare
    : Array.from(new Set([...Object.keys(normalizedFormValues), ...Object.keys(normalizedOriginalValues)]))

  const hasChanges = resolvedKeys.some((key) => !areValuesEqual(
    normalizedFormValues[key] ?? null,
    normalizedOriginalValues[key] ?? null,
  ))

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

export const resetFormValues = <TTargetValues extends object, TOriginalValues extends object>(
  targetFormValues: TTargetValues,
  originalValues: TOriginalValues,
): void => {
  const normalizedOriginalValues = toFormShape(originalValues)
  Object.keys(normalizedOriginalValues).forEach((key) => {
    const nextValue = normalizedOriginalValues[key] ?? null
    ;(targetFormValues as Record<string, FormFieldValue>)[key] = Array.isArray(nextValue) ? [...nextValue] : nextValue
  })
}
