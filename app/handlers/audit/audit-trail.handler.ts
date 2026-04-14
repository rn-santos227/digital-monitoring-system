import type { Ref } from 'vue'
import type { DataTableAction } from '~/constants/ui.constants'
import type { AuditLogSortKey, AuditLogTableRow } from '~/types/domain/audit'

export type AuditSortDirection = 'asc' | 'desc'

const AUDIT_SORT_KEYS: readonly AuditLogSortKey[] = ['createdAt', 'actor', 'tableName', 'recordId']

export const useAuditTrailPageHandlers = (
  sortKey: Ref<AuditLogSortKey>,
  sortDirection: Ref<AuditSortDirection>,
  searchQuery: Ref<string>
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

  const handleAction = (_payload: { actionKey: DataTableAction['key']; row: AuditLogTableRow }) => {
    // Intentional no-op: audit trail currently supports only a view button in the table actions.
  }

  return {
    handleSort,
    handleSearch,
    handleAction,
  }
}
