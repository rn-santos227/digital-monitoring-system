import type { Ref } from 'vue'
import type { EngagementManagementSearchQuery } from '~/types/domain/engagement'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const SEARCHABLE_FIELDS = ['engagementTitle', 'recordNo', 'personnelName'] as const

export const useEngagementSearchHandlers = (
  filtersRef: Ref<Partial<EngagementManagementSearchQuery>>,
) => {
  const handleEngagementFilterApply = (value: Partial<EngagementManagementSearchQuery>) => {
    const validation = validateFields([
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

    const normalizedField = validation.values.fields
    const isFieldValid = !normalizedField
      || SEARCHABLE_FIELDS.includes(normalizedField as (typeof SEARCHABLE_FIELDS)[number])
    const errors = {
      ...validation.errors,
      ...(!isFieldValid ? { fields: 'Selected engagement field is invalid.' } : {}),
    }

    const filters: Partial<EngagementManagementSearchQuery> = {
      term: validation.values.term || undefined,
      fields: normalizedField || undefined,
    }

    filtersRef.value = filters

    return {
      filters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleEngagementFilterReset = () => {
    const filters: Partial<EngagementManagementSearchQuery> = {}
    filtersRef.value = filters
    return filters
  }

  return {
    handleEngagementFilterApply,
    handleEngagementFilterReset,
  }
}
