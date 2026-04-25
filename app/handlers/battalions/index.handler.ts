import type { Ref } from 'vue'
import type { BattalionSearchQuery } from '~/types/domain/units'
import { validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const BATTALION_SEARCHABLE_FIELDS = ['code', 'name'] as const

export const BATTALION_ACTION_KEYS = Object.freeze({
  edit: 'edit-battalion',
  delete: 'delete-battalion',
})

interface BattalionActionPayload {
  actionKey: string
  row: Record<string, unknown>
}

interface UseBattalionActionHandlerOptions {
  onEditBattalionAction: (row: Record<string, unknown>) => Promise<boolean>
  onDeleteBattalionAction: (row: Record<string, unknown>) => Promise<boolean>
  canHandleUpdateBattalionAction: (actionKey: string) => boolean
  canHandleDeleteBattalionAction: (actionKey: string) => boolean
}

export const useBattalionActionHandler = ({
  onEditBattalionAction,
  onDeleteBattalionAction,
  canHandleUpdateBattalionAction,
  canHandleDeleteBattalionAction,
}: UseBattalionActionHandlerOptions) => {
  const onBattalionAction = async (payload: BattalionActionPayload) => {
    if (canHandleUpdateBattalionAction(payload.actionKey)) {
      await onEditBattalionAction(payload.row)
      return
    }

    if (canHandleDeleteBattalionAction(payload.actionKey)) {
      await onDeleteBattalionAction(payload.row)
    }
  }

  return {
    onBattalionAction,
  }
}

export const useBattalionFilterHandlers = (filters: Ref<Partial<BattalionSearchQuery>>) => {
  const handleFilterApply = (value: Partial<BattalionSearchQuery>) => {
    const commonValidation = validateFields([
      {
        field: 'term',
        label: 'Search term',
        value: value.term ?? '',
        maxLength: 120,
        pattern: REGEX_PATTERNS.alphaNumericSpace,
        patternMessage: 'Search term allows letters, numbers, spaces, periods, underscores, and hyphens only.',
      },
      {
        field: 'fields',
        label: 'Search field',
        value: value.fields ?? '',
        maxLength: 64,
      },
    ])

    const normalizedField = commonValidation.values.fields
    const isFieldValid = !normalizedField || BATTALION_SEARCHABLE_FIELDS.includes(normalizedField as (typeof BATTALION_SEARCHABLE_FIELDS)[number])
    const fieldError = isFieldValid ? '' : 'Selected battalion field is invalid.'

    const statusValidation = validateField({
      field: 'isActive',
      label: 'Battalion status',
      value: typeof value.isActive === 'boolean' ? String(value.isActive) : '',
      maxLength: 5,
      pattern: /^(true|false)$/,
      patternMessage: 'Battalion status must be either Active or Inactive.',
    })

    const errors = {
      ...commonValidation.errors,
      ...(fieldError ? { fields: fieldError } : {}),
      ...(statusValidation.error ? { isActive: statusValidation.error } : {}),
    }

    const sanitizedFilters: Partial<BattalionSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
      isActive: typeof value.isActive === 'boolean' ? value.isActive : undefined,
    }

    return {
      filters: sanitizedFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleFilterReset = (): Partial<BattalionSearchQuery> => {
    const resetFilters: Partial<BattalionSearchQuery> = {}
    filters.value = resetFilters
    return resetFilters
  }

  return {
    handleFilterApply,
    handleFilterReset,
  }
}
