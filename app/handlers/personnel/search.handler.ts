import type { Ref } from 'vue'
import { PERSONNEL_SEARCHABLE_FIELDS } from './constants'
import type { PersonnelSearchQuery } from '~/types/domain/personnel'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export const usePersonnelSearchHandlers = (filters: Ref<Partial<PersonnelSearchQuery>>) => {
  const handleFilterApply = (value: Partial<PersonnelSearchQuery>) => {
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
    const isFieldValid = !normalizedField || PERSONNEL_SEARCHABLE_FIELDS.includes(normalizedField)
    const fieldError = isFieldValid ? '' : 'Selected personnel field is invalid.'

    const errors = {
      ...commonValidation.errors,
      ...(fieldError ? { fields: fieldError } : {}),
    }

    const sanitizedFilters: Partial<PersonnelSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
    }

    return {
      filters: sanitizedFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleFilterReset = (): Partial<PersonnelSearchQuery> => {
    const resetFilters: Partial<PersonnelSearchQuery> = {}
    filters.value = resetFilters
    return resetFilters
  }

  return {
    handleFilterApply,
    handleFilterReset,
  }
}
