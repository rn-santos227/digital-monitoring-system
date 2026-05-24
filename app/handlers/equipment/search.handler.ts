import type { Ref } from 'vue'
import type { EquipmentCategorySearchQuery } from '~/types/domain/equipment'
import { validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const EQUIPMENT_CATEGORY_SEARCHABLE_FIELDS = ['code', 'name'] as const

export const useEquipmentCategorySearchHandlers = (
  filters: Ref<Partial<EquipmentCategorySearchQuery>>,
) => {
  const handleFilterApply = (value: Partial<EquipmentCategorySearchQuery>) => {
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
    const isFieldValid = !normalizedField || EQUIPMENT_CATEGORY_SEARCHABLE_FIELDS.includes(normalizedField as (typeof EQUIPMENT_CATEGORY_SEARCHABLE_FIELDS)[number])

    const statusValidation = validateField({
      field: 'isActive',
      label: 'Equipment category status',
      value: typeof value.isActive === 'boolean' ? String(value.isActive) : '',
      maxLength: 5,
      pattern: /^(true|false)$/,
      patternMessage: 'Equipment category status must be either Active or Inactive.',
    })

    const errors = {
      ...commonValidation.errors,
      ...(!isFieldValid ? { fields: 'Selected equipment category field is invalid.' } : {}),
      ...(statusValidation.error ? { isActive: statusValidation.error } : {}),
    }

    const nextFilters: Partial<EquipmentCategorySearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
      isActive: typeof value.isActive === 'boolean' ? value.isActive : undefined,
    }

    filters.value = nextFilters

    return {
      filters: nextFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleFilterReset = (): Partial<EquipmentCategorySearchQuery> => {
    const resetFilters: Partial<EquipmentCategorySearchQuery> = {}
    filters.value = resetFilters
    return resetFilters
  }

  return {
    handleFilterApply,
    handleFilterReset,
  }
}
