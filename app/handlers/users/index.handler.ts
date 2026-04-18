import type { Ref } from 'vue'
import { USER_MANAGEMENT_TAB_IDS } from './constants'
import type { UserAccountsSearchQuery, UserManagementTabId, UserProfilesSearchQuery } from '~/types/domain/users'
import { validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const USER_PROFILE_SEARCHABLE_FIELDS = ['email', 'fullName'] as const
const ACCOUNT_TYPE_SEARCHABLE_FIELDS = ['code', 'name', 'description'] as const

export const useUsersPageHandlers = (
  activeTab: Ref<UserManagementTabId>,
  profileFilters: Ref<Partial<UserProfilesSearchQuery>>,
  accountFilters: Ref<Partial<UserAccountsSearchQuery>>
) => {
  const handleTabChange = (nextTab: string) => {
    if (USER_MANAGEMENT_TAB_IDS.includes(nextTab as UserManagementTabId)) {
      activeTab.value = nextTab as UserManagementTabId
    }
  }

  const handleProfileFilterApply = (value: Partial<UserProfilesSearchQuery>) => {
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
    const isFieldValid = !normalizedField || USER_PROFILE_SEARCHABLE_FIELDS.includes(normalizedField as (typeof USER_PROFILE_SEARCHABLE_FIELDS)[number])
    const fieldError = isFieldValid ? '' : 'Selected profile field is invalid.'

    const errors = {
      ...commonValidation.errors,
      ...(fieldError ? { fields: fieldError } : {}),
    }

    const sanitizedFilters: Partial<UserProfilesSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
      isActive: typeof value.isActive === 'boolean' ? value.isActive : undefined,
    }

    return {
      filters: sanitizedFilters,
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
    const isFieldValid = !normalizedField || ACCOUNT_TYPE_SEARCHABLE_FIELDS.includes(normalizedField as (typeof ACCOUNT_TYPE_SEARCHABLE_FIELDS)[number])
    const fieldError = isFieldValid ? '' : 'Selected account type field is invalid.'

    const statusValidation = validateField({
      field: 'isSystem',
      label: 'Account type status',
      value: typeof value.isSystem === 'boolean' ? String(value.isSystem) : '',
      maxLength: 5,
      pattern: /^(true|false)$/,
      patternMessage: 'Account type status must be either System or Custom.',
    })

    const errors = {
      ...commonValidation.errors,
      ...(fieldError ? { fields: fieldError } : {}),
      ...(statusValidation.error ? { isSystem: statusValidation.error } : {}),
    }

    const sanitizedFilters: Partial<UserAccountsSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: normalizedField || undefined,
      isSystem: typeof value.isSystem === 'boolean' ? value.isSystem : undefined,
    }

    return {
      filters: sanitizedFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleAccountFilterReset = (): Partial<UserAccountsSearchQuery> => {
    const resetFilters: Partial<UserAccountsSearchQuery> = {}
    accountFilters.value = resetFilters
    return resetFilters
  }

  return {
    handleTabChange,
    handleProfileFilterApply,
    handleProfileFilterReset,
    handleAccountFilterApply,
    handleAccountFilterReset,
  }
}
