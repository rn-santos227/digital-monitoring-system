import type { Ref } from 'vue'
import type { CompanySearchQuery } from '~/types/domain/units'
import { validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const COMPANY_SEARCHABLE_FIELDS = ['code', 'name'] as const

export const COMPANY_ACTION_KEYS = Object.freeze({
  view: 'view-company',
  edit: 'edit-company',
  delete: 'delete-company',
})

interface CompanyActionPayload {
  actionKey: string
  row: Record<string, unknown>
}

interface UseCompanyActionHandlerOptions {
  onViewCompanyAction: (row: Record<string, unknown>) => Promise<boolean>
  onEditCompanyAction: (row: Record<string, unknown>) => Promise<boolean>
  onDeleteCompanyAction: (row: Record<string, unknown>) => Promise<boolean>
  canHandleViewCompanyAction: (actionKey: string) => boolean
  canHandleUpdateCompanyAction: (actionKey: string) => boolean
  canHandleDeleteCompanyAction: (actionKey: string) => boolean
}

export const useCompanyActionHandler = ({
  onViewCompanyAction,
  onEditCompanyAction,
  onDeleteCompanyAction,
  canHandleViewCompanyAction,
  canHandleUpdateCompanyAction,
  canHandleDeleteCompanyAction,
}: UseCompanyActionHandlerOptions) => {
  const onCompanyAction = async (payload: CompanyActionPayload) => {
    if (canHandleViewCompanyAction(payload.actionKey)) {
      await onViewCompanyAction(payload.row)
      return
    }

    if (canHandleUpdateCompanyAction(payload.actionKey)) {
      await onEditCompanyAction(payload.row)
      return
    }

    if (canHandleDeleteCompanyAction(payload.actionKey)) {
      await onDeleteCompanyAction(payload.row)
    }
  }

  return {
    onCompanyAction,
  }
}

export const useCompanyFilterHandlers = (filters: Ref<Partial<CompanySearchQuery>>) => {
  const handleFilterApply = (value: Partial<CompanySearchQuery>) => {
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
      {
        field: 'battalionId',
        label: 'Battalion id',
        value: value.battalionId ?? '',
        maxLength: 64,
        pattern: REGEX_PATTERNS.uuid,
        patternMessage: 'Battalion id must be a valid UUID.',
      },
    ])

    const normalizedField = commonValidation.values.fields
    const isFieldValid = !normalizedField || COMPANY_SEARCHABLE_FIELDS.includes(normalizedField as (typeof COMPANY_SEARCHABLE_FIELDS)[number])
    const fieldError = isFieldValid ? '' : 'Selected company field is invalid.'

    const statusValidation = validateField({
      field: 'isActive',
      label: 'Company status',
      value: typeof value.isActive === 'boolean' ? String(value.isActive) : '',
      maxLength: 5,
      pattern: /^(true|false)$/,
      patternMessage: 'Company status must be either Active or Inactive.',
    })

    const errors = {
      ...commonValidation.errors,
      ...(fieldError ? { fields: fieldError } : {}),
      ...(statusValidation.error ? { isActive: statusValidation.error } : {}),
    }

    const sanitizedFilters: Partial<CompanySearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
      isActive: typeof value.isActive === 'boolean' ? value.isActive : undefined,
      battalionId: commonValidation.values.battalionId || undefined,
    }

    return {
      filters: sanitizedFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleFilterReset = (): Partial<CompanySearchQuery> => {
    const resetFilters: Partial<CompanySearchQuery> = {}
    filters.value = resetFilters
    return resetFilters
  }

  return {
    handleFilterApply,
    handleFilterReset,
  }
}
