import type { Ref } from 'vue'
import type { UserAccountsSearchQuery, UserProfilesSearchQuery } from '~/types/domain/users'
import { validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const USER_PROFILE_SEARCHABLE_FIELDS = ['email', 'fullName'] as const
const ACCOUNT_TYPE_SEARCHABLE_FIELDS = ['code', 'name', 'description'] as const

export const useUsersSearchHandlers = (
  profileFilters: Ref<Partial<UserProfilesSearchQuery>>,
  accountFilters: Ref<Partial<UserAccountsSearchQuery>>,
) => {
  const handleProfileFilterApply = (value: Partial<UserProfilesSearchQuery>) => {
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
    const isFieldValid = !normalizedField || USER_PROFILE_SEARCHABLE_FIELDS.includes(normalizedField as (typeof USER_PROFILE_SEARCHABLE_FIELDS)[number])
    const errors = { ...commonValidation.errors, ...(!isFieldValid ? { fields: 'Selected profile field is invalid.' } : {}) }

    return {
      filters: { term: commonValidation.values.term || undefined, fields: normalizedField || undefined, isActive: typeof value.isActive === 'boolean' ? value.isActive : undefined },
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleProfileFilterReset = (): Partial<UserProfilesSearchQuery> => {
    const resetFilters: Partial<UserProfilesSearchQuery> = {}
    profileFilters.value = resetFilters
    return resetFilters
  }

  const handleAccountFilterApply = (value: Partial<UserAccountsSearchQuery>) => {
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
    const isFieldValid = !normalizedField || ACCOUNT_TYPE_SEARCHABLE_FIELDS.includes(normalizedField as (typeof ACCOUNT_TYPE_SEARCHABLE_FIELDS)[number])

    const statusValidation = validateField({ field: 'isSystem', label: 'Account type status', value: typeof value.isSystem === 'boolean' ? String(value.isSystem) : '', maxLength: 5, pattern: /^(true|false)$/, patternMessage: 'Account type status must be either System or Custom.' })

    const errors = {
      ...commonValidation.errors,
      ...(!isFieldValid ? { fields: 'Selected account type field is invalid.' } : {}),
      ...(statusValidation.error ? { isSystem: statusValidation.error } : {}),
    }

    return {
      filters: { term: commonValidation.values.term || undefined, fields: normalizedField || undefined, isSystem: typeof value.isSystem === 'boolean' ? value.isSystem : undefined },
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleAccountFilterReset = (): Partial<UserAccountsSearchQuery> => {
    const resetFilters: Partial<UserAccountsSearchQuery> = {}
    accountFilters.value = resetFilters
    return resetFilters
  }

  return { handleProfileFilterApply, handleProfileFilterReset, handleAccountFilterApply, handleAccountFilterReset }
}
