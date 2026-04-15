import type { Ref } from 'vue'
import type { DataTableAction } from '~/constants/ui.constants'
import type { AuditLogSearchQuery, AuditLogSortKey, AuditLogTableRow } from '~/types/domain/audit'
import { validateDateRangeFields, validateField, validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

export type AuditSortDirection = 'asc' | 'desc'

const AUDIT_SORT_KEYS: readonly AuditLogSortKey[] = ['createdAt', 'actor', 'action', 'tableName', 'recordId', 'ipAddress', 'statusCode']

export const useAuditTrailPageHandlers = (
  sortKey: Ref<AuditLogSortKey>,
  sortDirection: Ref<AuditSortDirection>,
  searchQuery: Ref<string>,
  activeAuditLogId: Ref<string>,
  isAuditModalOpen: Ref<boolean>
) => {
  const handleSort = (key: string) => {
    if (!AUDIT_SORT_KEYS.includes(key as AuditLogSortKey)) {
      return
    }

    const validatedKey = key as AuditLogSortKey

    if (sortKey.value === validatedKey) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      return
    }

    sortKey.value = validatedKey
    sortDirection.value = 'asc'
  }

  const handleSearch = (value: string) => {
    searchQuery.value = value
  }

  const handleAction = (payload: { actionKey: DataTableAction['key']; row: AuditLogTableRow }) => {
    if (payload.actionKey !== 'view') {
      return
    }

    activeAuditLogId.value = payload.row.id
    isAuditModalOpen.value = true
  }

  const handleModalClose = () => {
    activeAuditLogId.value = ''
    isAuditModalOpen.value = false
  }

  const handleFilterApply = (value: Partial<AuditLogSearchQuery>) => {
    const commonValidation = validateFields([
      {
        field: 'term',
        label: 'Search term',
        value: value.term ?? '',
        maxLength: 120,
      },
      {
        field: 'fields',
        label: 'Search field',
        value: value.fields ?? '',
        maxLength: 64,
      },
    ])

    const actorNameValidation = validateField({
      field: 'userName',
      label: 'Actor name',
      value: value.userName ?? '',
      maxLength: 80,
      pattern: REGEX_PATTERNS.alphaNumericSpace,
      patternMessage: 'Actor name allows letters, numbers, spaces, periods, underscores, and hyphens only.',
    })

    const dateRangeErrors = validateDateRangeFields(value.startDate ?? '', value.endDate ?? '')

    const errors = {
      ...commonValidation.errors,
      ...(actorNameValidation.error ? { userName: actorNameValidation.error } : {}),
      ...dateRangeErrors,
    }

    const sanitizedFilters: Partial<AuditLogSearchQuery> = {
      term: commonValidation.values.term || undefined,
      fields: commonValidation.values.fields || undefined,
      userName: actorNameValidation.value || undefined,
      startDate: (value.startDate ?? '').trim() || undefined,
      endDate: (value.endDate ?? '').trim() || undefined,
    }

    return {
      filters: sanitizedFilters,
      errors,
      isValid: Object.keys(errors).length === 0,
    }
  }

  const handleFilterReset = (): Partial<AuditLogSearchQuery> => ({})

  return {
    handleSort,
    handleSearch,
    handleAction,
    handleFilterApply,
    handleFilterReset,
    handleModalClose,
  }
}
