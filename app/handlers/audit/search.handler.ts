import type { Ref } from 'vue'
import type { AuditLogSearchQuery } from '~/types/domain/audit'
import { validateDateRangeFields, validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export const useAuditSearchHandlers = (searchQuery: Ref<string>) => {
  const handleSearch = (value: string) => {
    searchQuery.value = value
  }

  const handleFilterApply = (value: Partial<AuditLogSearchQuery>) => {
    const commonValidation = validateFields([
      { field: 'term', label: 'Search term', value: value.term ?? '', maxLength: 120 },
      { field: 'fields', label: 'Search field', value: value.fields ?? '', maxLength: 64 },
    ])

    const actorNameValidation = validateField({
      field: 'userName',
      label: 'Actor name',
      value: value.userName ?? '',
      maxLength: 80,
      pattern: REGEX_PATTERNS.alphaNumericSpace,
      patternMessage: 'Actor name allows letters, numbers, spaces, periods, underscores, and hyphens only.',
    })

    const dateRangeErrors = validateDateRangeFields(value.startDate ?? '', value.endDate ?? '')

    const errors = {
      ...commonValidation.errors,
      ...(actorNameValidation.error ? { userName: actorNameValidation.error } : {}),
      ...dateRangeErrors,
    }

    const sanitizedFilters: Partial<AuditLogSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: commonValidation.values.fields || undefined,
      userName: actorNameValidation.value || undefined,
      startDate: (value.startDate ?? '').trim() || undefined,
      endDate: (value.endDate ?? '').trim() || undefined,
    }

    return { filters: sanitizedFilters, errors, isValid: Object.keys(errors).length === 0 }
  }

  const handleFilterReset = (): Partial<AuditLogSearchQuery> => ({})

  return { handleSearch, handleFilterApply, handleFilterReset }
}
