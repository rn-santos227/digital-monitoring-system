import type { Ref } from 'vue'
import type {
  TrainingCategorySearchQuery,
  TrainingManagementTabId,
  TrainingSearchQuery,
} from '~/types/domain/training'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const TRAINING_MANAGEMENT_TAB_IDS: readonly TrainingManagementTabId[] = ['records', 'trainings', 'categories']
const TRAINING_SEARCHABLE_FIELDS = ['trainingTitle', 'defaultRemarks'] as const
const TRAINING_CATEGORY_SEARCHABLE_FIELDS = ['code', 'name'] as const

export const useTrainingManagementPageHandlers = (
  activeTab: Ref<TrainingManagementTabId>,
  trainingFilters: Ref<Partial<TrainingSearchQuery>>,
  categoryFilters: Ref<Partial<TrainingCategorySearchQuery>>,
) => {
  const handleTabChange = (nextTab: string) => {
    if (TRAINING_MANAGEMENT_TAB_IDS.includes(nextTab as TrainingManagementTabId)) {
      activeTab.value = nextTab as TrainingManagementTabId
    }
  }

  const handleTrainingFilterApply = (value: Partial<TrainingSearchQuery>) => {
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
    const isFieldValid = !normalizedField || TRAINING_SEARCHABLE_FIELDS.includes(normalizedField as (typeof TRAINING_SEARCHABLE_FIELDS)[number])
    const fieldError = isFieldValid ? '' : 'Selected training field is invalid.'

    const errors = {
      ...commonValidation.errors,
      ...(fieldError ? { fields: fieldError } : {}),
    }

    const sanitizedFilters: Partial<TrainingSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
    }

    return {
      filters: sanitizedFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
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
    const isFieldValid = !normalizedField || TRAINING_CATEGORY_SEARCHABLE_FIELDS.includes(normalizedField as (typeof TRAINING_CATEGORY_SEARCHABLE_FIELDS)[number])
    const fieldError = isFieldValid ? '' : 'Selected category field is invalid.'

    const errors = {
      ...commonValidation.errors,
      ...(fieldError ? { fields: fieldError } : {}),
    }

    const sanitizedFilters: Partial<TrainingCategorySearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
    }

    return {
      filters: sanitizedFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleCategoryFilterReset = (): Partial<TrainingCategorySearchQuery> => {
    const resetFilters: Partial<TrainingCategorySearchQuery> = {}
    categoryFilters.value = resetFilters
    return resetFilters
  }

  return {
    handleTabChange,
    handleTrainingFilterApply,
    handleTrainingFilterReset,
    handleCategoryFilterApply,
    handleCategoryFilterReset,
  }
}
