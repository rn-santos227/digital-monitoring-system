import type { CreateTrainingCategoryPayload, CreateTrainingPayload } from '~/types/domain/training'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export const validateCreateTrainingCategoryForm = (form: { code: string; name: string }) => {
  const result = validateFields([
    {
      field: 'code',
      label: 'Category code',
      value: form.code,
      required: true,
      maxLength: 32,
      pattern: REGEX_PATTERNS.categoryCode,
      patternMessage: 'Category code allows letters, numbers, underscores, and hyphens only.',
    },
    {
      field: 'name',
      label: 'Category name',
      value: form.name,
      required: true,
      maxLength: 120,
    },
  ])

  const normalizedCategoryCode = result.values.code ?? ''
  const normalizedCategoryName = result.values.name ?? ''

  const payload: CreateTrainingCategoryPayload | null = Object.keys(result.errors).length === 0
    ? {
      code: normalizedCategoryCode.toUpperCase(),
      name: normalizedCategoryName,
    }
    : null

  return {
    errors: result.errors,
    payload,
  }
}

export const validateCreateTrainingForm = (form: {
  trainingTitle: string
  trainingCategoryId: string
  statusId: string
  levelId: string
  startDate: string
  endDate: string
  defaultRemarks: string
}) => {
  const result = validateFields([
    {
      field: 'trainingTitle',
      label: 'Training title',
      value: form.trainingTitle,
      required: true,
      maxLength: 160,
    },
    {
      field: 'trainingCategoryId',
      label: 'Training category ID',
      value: form.trainingCategoryId,
      maxLength: 80,
      pattern: REGEX_PATTERNS.uuid,
      patternMessage: 'Training category ID must be a valid UUID.',
    },
    {
      field: 'statusId',
      label: 'Training status ID',
      value: form.statusId,
      required: true,
      maxLength: 80,
      pattern: REGEX_PATTERNS.uuid,
      patternMessage: 'Training status ID must be a valid UUID.',
    },
    {
      field: 'levelId',
      label: 'Level ID',
      value: form.levelId,
      maxLength: 80,
      pattern: REGEX_PATTERNS.uuid,
      patternMessage: 'Level ID must be a valid UUID.',
    },
    {
      field: 'defaultRemarks',
      label: 'Default remarks',
      value: form.defaultRemarks,
      maxLength: 500,
    },
  ])

  const errors = { ...result.errors } as Record<string, string>

  if (form.startDate && form.endDate && new Date(form.endDate).getTime() < new Date(form.startDate).getTime()) {
    errors.endDate = 'End date must be on or after start date.'
  }

  const normalizedTrainingTitle = result.values.trainingTitle ?? ''
  const normalizedTrainingCategoryId = result.values.trainingCategoryId ?? ''
  const normalizedTrainingStatusId = result.values.statusId ?? ''
  const normalizedTrainingLevelId = result.values.levelId ?? ''
  const normalizedTrainingRemarks = result.values.defaultRemarks ?? ''

  const payload: CreateTrainingPayload | null = Object.keys(errors).length === 0
    ? {
      trainingTitle: normalizedTrainingTitle,
      trainingCategoryId: normalizedTrainingCategoryId || null,
      statusId: normalizedTrainingStatusId,
      levelId: normalizedTrainingLevelId || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      defaultRemarks: normalizedTrainingRemarks || null,
    }
    : null

  return {
    errors,
    payload,
  }
}
