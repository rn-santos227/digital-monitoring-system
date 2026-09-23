import type { Ref } from 'vue'
import type { EquipmentIncidentSearchQuery } from '~/types/domain/incident'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export const useIncidentSearchHandlers = (
  filters: Ref<Partial<EquipmentIncidentSearchQuery>>,
) => {
  const handleFilterApply = (value: Partial<EquipmentIncidentSearchQuery>) => {
    if (value.conditions) {
      const nextFilters: Partial<EquipmentIncidentSearchQuery> = {

      }
    }

    const validation = validateFields([
      {
        field: 'term',
        label: 'Search term',
        value: value.term ?? '',
        maxLength: 120,
        pattern: REGEX_PATTERNS.alphaNumericSpace,
        patternMessage: 'Search term allows letters, numbers, spaces, periods, underscores, and hyphens only.',
      },
      { field: 'dateFrom', label: 'Incident date from', value: value.dateFrom ?? '', maxLength: 10 },
      { field: 'dateTo', label: 'Incident date to', value: value.dateTo ?? '', maxLength: 10 },
    ])

    const nextFilters: Partial<EquipmentIncidentSearchQuery> = {
      term: validation.values.term || undefined,
      dateFrom: validation.values.dateFrom || undefined,
      dateTo: validation.values.dateTo || undefined,
    }

    filters.value = nextFilters

    return {
      filters: nextFilters,
      errors: validation.errors,
      isValid: Object.keys(validation.errors).length === 0,
    }
  }

  const handleFilterReset = (): Partial<EquipmentIncidentSearchQuery> => {
    const resetFilters: Partial<EquipmentIncidentSearchQuery> = {}
    filters.value = resetFilters
    return resetFilters
  }

  return { handleFilterApply, handleFilterReset }
}
