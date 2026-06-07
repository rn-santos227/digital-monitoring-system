import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { DataTableAction } from '~/constants/ui.constants'
import { useAuditSearchHandlers } from './search.handler'
import type { AuditLogSearchQuery, AuditLogSortKey, AuditLogTableRow } from '~/types/domain/audit'
import type { FieldValidationMap } from '~/utils/field-validation'

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

  const { handleSearch, handleFilterApply, handleFilterReset } = useAuditSearchHandlers(searchQuery)
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

  return {
    handleSort,
    handleSearch,
    handleAction,
    handleFilterApply,
    handleFilterReset,
    handleModalClose,
  }
}

interface UseAuditFilterListHandlersOptions {
  currentPage: Ref<number>
  filters: Ref<Partial<AuditLogSearchQuery>>
  validationErrors: Ref<FieldValidationMap>
  loadAuditLogs: (
    page?: number,
    filters?: Partial<AuditLogSearchQuery>,
    pageSize?: number,
  ) => Promise<unknown>
  handleFilterApply: (value: Partial<AuditLogSearchQuery>) => {
    filters: Partial<AuditLogSearchQuery>
    errors: FieldValidationMap
    isValid: boolean
  }
  handleFilterReset: () => Partial<AuditLogSearchQuery>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

export const useAuditFilterListHandlers = ({
  currentPage,
  filters,
  validationErrors,
  loadAuditLogs,
  handleFilterApply,
  handleFilterReset,
  showDialog,
}: UseAuditFilterListHandlersOptions) => {
  const handleApplyFilters = async (value: Partial<AuditLogSearchQuery>) => {
    const result = handleFilterApply(value)
    validationErrors.value = result.errors

    if (!result.isValid) {
      await showDialog({
        type: 'error',
        title: 'Invalid filter input',
        message: 'Please correct the highlighted fields before applying filters.',
        confirmLabel: 'OK',
      })
      return
    }

    currentPage.value = 1
    await loadAuditLogs(1, result.filters)
  }

  const handleResetFilters = async () => {
    const resetFilterValues = handleFilterReset()
    validationErrors.value = {}
    currentPage.value = 1
    await loadAuditLogs(1, resetFilterValues)
  }

  const onPageSizeChange = (pageSize: number) => {
    currentPage.value = 1
    void loadAuditLogs(1, filters.value, pageSize)
  }

  return {
    handleApplyFilters,
    handleResetFilters,
    onPageSizeChange,
  }
}
