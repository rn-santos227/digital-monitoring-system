import type { Ref } from 'vue'
import type { 
  EquipmentAssetSearchQuery,
  EquipmentCategorySearchQuery,
  EquipmentItemSearchQuery
} from '~/types/domain/equipment'
import { validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const EQUIPMENT_CATEGORY_SEARCHABLE_FIELDS = ['code', 'name'] as const
const EQUIPMENT_ITEM_SEARCHABLE_FIELDS = ['equipmentCode', 'name', 'model', 'manufacturer'] as const
const EQUIPMENT_ASSET_SEARCHABLE_FIELDS = ['assetTag', 'equipmentItemCode', 'equipmentItemName', 'serialNo'] as const

export const useEquipmentSearchHandlers = (
  filters: Ref<Partial<EquipmentItemSearchQuery> | Partial<EquipmentAssetSearchQuery>>,
) => {
  const handleFilterApply = (value: Partial<EquipmentItemSearchQuery> | Partial<EquipmentAssetSearchQuery>) => {
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
    const isItemFieldValid = EQUIPMENT_ITEM_SEARCHABLE_FIELDS.includes(normalizedField as (typeof EQUIPMENT_ITEM_SEARCHABLE_FIELDS)[number])
    const isAssetFieldValid = EQUIPMENT_ASSET_SEARCHABLE_FIELDS.includes(normalizedField as (typeof EQUIPMENT_ASSET_SEARCHABLE_FIELDS)[number])
    const isFieldValid = !normalizedField || isItemFieldValid || isAssetFieldValid

    const errors = {
      ...commonValidation.errors,
      ...(!isFieldValid ? { fields: 'Selected equipment item field is invalid.' } : {}),
    }

    const nextFilters: Partial<EquipmentItemSearchQuery> | Partial<EquipmentAssetSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
    }

    filters.value = nextFilters

    return {
      filters: nextFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleFilterReset = (): Partial<EquipmentItemSearchQuery> | Partial<EquipmentAssetSearchQuery> => {
    const resetFilters: Partial<EquipmentItemSearchQuery> = {}
    filters.value = resetFilters
    return resetFilters
  }

  return {
    handleFilterApply,
    handleFilterReset,
  }
}

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

export const useEquipmentItemSearchHandlers = useEquipmentSearchHandlers
