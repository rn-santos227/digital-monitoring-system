import type { Ref } from 'vue'
import type { TrainingCategorySearchQuery, TrainingRecordSearchQuery, TrainingSearchQuery } from '~/types/domain/training'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const TRAINING_RECORD_SEARCHABLE_FIELDS = ['recordNo', 'trainingTitle', 'certificateNo', 'remarks'] as const
const TRAINING_SEARCHABLE_FIELDS = ['trainingTitle', 'defaultRemarks'] as const
const TRAINING_CATEGORY_SEARCHABLE_FIELDS = ['code', 'name'] as const

export const useTrainingSearchHandlers = (
  recordsFilters: Ref<Partial<TrainingRecordSearchQuery>>,
  trainingFilters: Ref<Partial<TrainingSearchQuery>>,
  categoryFilters: Ref<Partial<TrainingCategorySearchQuery>>,
) => {
  const handleRecordsFilterApply = (value: Partial<TrainingRecordSearchQuery>) => {
    const commonValidation = validateFields([
      {
        field: 'term',
        label: 'Search term',
        value: value.term ?? '',
        maxLength: 120,
        pattern: REGEX_PATTERNS.alphaNumericSpace,
        patternMessage: 'Search term allows letters, numbers, spaces, periods, underscores, and hyphens only.'
      },
      { 
        field: 'fields',
        label: 'Search field',
        value: value.fields ?? '',
        maxLength: 64
      },
    ])
    const normalizedField = commonValidation.values.fields
    const isFieldValid = !normalizedField || TRAINING_RECORD_SEARCHABLE_FIELDS.includes(normalizedField as (typeof TRAINING_RECORD_SEARCHABLE_FIELDS)[number])
    const errors = { ...commonValidation.errors, ...(!isFieldValid ? { fields: 'Selected training record field is invalid.' } : {}) }
    return { filters: { term: commonValidation.values.term || undefined, fields: normalizedField || undefined }, errors, isValid: Object.keys(errors).length === 0 }
  }

  const handleRecordsFilterReset = (): Partial<TrainingRecordSearchQuery> => {
    const resetFilters: Partial<TrainingRecordSearchQuery> = {}
    recordsFilters.value = resetFilters
    return resetFilters
  }

  const handleTrainingFilterApply = (value: Partial<TrainingSearchQuery>) => {
    const commonValidation = validateFields([
      { 
        field: 'term',
        label: 'Search term',
        value: value.term ?? '',
        maxLength: 120,
        pattern: REGEX_PATTERNS.alphaNumericSpace,
        patternMessage: 'Search term allows letters, numbers, spaces, periods, underscores, and hyphens only.'
      },
      { 
        field: 'fields',
        label: 'Search field',
        value: value.fields ?? '',
        maxLength: 64
      },
    ])
    const normalizedField = commonValidation.values.fields
    const isFieldValid = !normalizedField || TRAINING_SEARCHABLE_FIELDS.includes(normalizedField as (typeof TRAINING_SEARCHABLE_FIELDS)[number])
    const errors = { ...commonValidation.errors, ...(!isFieldValid ? { fields: 'Selected training field is invalid.' } : {}) }
    return { filters: { term: commonValidation.values.term || undefined, fields: normalizedField || undefined }, errors, isValid: Object.keys(errors).length === 0 }
  }

  const handleTrainingFilterReset = (): Partial<TrainingSearchQuery> => {
    const resetFilters: Partial<TrainingSearchQuery> = {}
    trainingFilters.value = resetFilters
    return resetFilters
  }

  const handleCategoryFilterApply = (value: Partial<TrainingCategorySearchQuery>) => {
    const commonValidation = validateFields([
      {
        field: 'term',
        label: 'Search term',
        value: value.term ?? '',
        maxLength: 120,
        pattern: REGEX_PATTERNS.alphaNumericSpace,
        patternMessage: 'Search term allows letters, numbers, spaces, periods, underscores, and hyphens only.'
      },
      {
        field: 'fields',
        label: 'Search field',
        value: value.fields ?? '',
        maxLength: 64
      },
    ])
    const normalizedField = commonValidation.values.fields
    const isFieldValid = !normalizedField || TRAINING_CATEGORY_SEARCHABLE_FIELDS.includes(normalizedField as (typeof TRAINING_CATEGORY_SEARCHABLE_FIELDS)[number])
    const errors = { ...commonValidation.errors, ...(!isFieldValid ? { fields: 'Selected category field is invalid.' } : {}) }
    return { filters: { term: commonValidation.values.term || undefined, fields: normalizedField || undefined }, errors, isValid: Object.keys(errors).length === 0 }
  }

  const handleCategoryFilterReset = (): Partial<TrainingCategorySearchQuery> => {
    const resetFilters: Partial<TrainingCategorySearchQuery> = {}
    categoryFilters.value = resetFilters
    return resetFilters
  }

  return { handleRecordsFilterApply, handleRecordsFilterReset, handleTrainingFilterApply, handleTrainingFilterReset, handleCategoryFilterApply, handleCategoryFilterReset }
}
