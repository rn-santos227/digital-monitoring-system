import type {
  CreateEquipmentCategoryPayload,
  UpdateEquipmentCategoryPayload,
} from '~/types/domain/equipment'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export const validateCreateEquipmentCategoryForm = (form: {
  code: string
  name: string
  isActive: boolean
}) => {
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

  const payload: CreateEquipmentCategoryPayload | null = Object.keys(result.errors).length === 0
    ? {
      code: (result.values.code ?? '').toUpperCase(),
      name: result.values.name ?? '',
      isActive: form.isActive,
    }
    : null

  return {
    errors: result.errors,
    payload,
  }
}

export const validateUpdateEquipmentCategoryForm = validateCreateEquipmentCategoryForm as (form: {
  code: string
  name: string
  isActive: boolean
}) => {
  errors: Record<string, string>
  payload: UpdateEquipmentCategoryPayload | null
}
