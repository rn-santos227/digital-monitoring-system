import type { Ref } from 'vue'
import type { DataTableAction } from '~/constants/ui.constants'
import type { AuditLogSearchQuery, AuditLogSortKey, AuditLogTableRow } from '~/types/domain/audit'

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

  const handleFilterApply = (value: Partial<AuditLogSearchQuery>): Partial<AuditLogSearchQuery> => {
    return {
      term: value.term?.trim() || undefined,
      fields: value.fields?.trim() || undefined,
      userName: value.userName?.trim() || undefined,
      startDate: value.startDate?.trim() || undefined,
      endDate: value.endDate?.trim() || undefined,
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
