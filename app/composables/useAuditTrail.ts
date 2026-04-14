import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuditStore } from '~/stores/audit'
import { mapAuditLogItemToTableRow } from '~/utils/audit'
import type { AuditLogSortKey } from '~/types/domain/audit'

export const useAuditTrail = () => {
  const auditStore = useAuditStore()
  const { items, page, totalPages, isLoading, error } = storeToRefs(auditStore)

  const searchQuery = ref('')
  const sortKey = ref<AuditLogSortKey>('createdAt')
  const sortDirection = ref<'asc' | 'desc'>('desc')

  const tableRows = computed(() => {
    const normalizedQuery = searchQuery.value.trim().toLowerCase()
    const mappedRows = items.value.map(mapAuditLogItemToTableRow)

    const filteredRows = !normalizedQuery
      ? mappedRows
      : mappedRows.filter((row) => [row.actor, row.action, row.tableName, row.recordId, row.createdAt]
        .some((field) => field.toLowerCase().includes(normalizedQuery)))

    return [...filteredRows].sort((leftRow, rightRow) => {
      const leftValue = leftRow[sortKey.value] ?? ''
      const rightValue = rightRow[sortKey.value] ?? ''

      if (leftValue === rightValue) {
        return 0
      }

      if (sortDirection.value === 'asc') {
        return leftValue > rightValue ? 1 : -1
      }

      return leftValue < rightValue ? 1 : -1
    })
  })

  const tableEmptyMessage = computed(() => {
    if (error.value) {
      return error.value
    }

    return 'No audit log entries found.'
  })

  const loadAuditLogs = async (nextPage = page.value) => {
    try {
      await auditStore.fetchAuditLogs({ page: nextPage })
    } catch {
      // Error state is set in the store and exposed to the page.
    }
  }

  watch(page, (nextPage, previousPage) => {
    if (nextPage === previousPage) {
      return
    }

    void loadAuditLogs(nextPage)
  })

  onMounted(() => {
    void loadAuditLogs(1)
  })

  return {
    searchQuery,
    sortKey,
    sortDirection,
    tableRows,
    tableEmptyMessage,
    currentPage: page,
    totalPages,
    isLoading,
    loadAuditLogs,
  }
}
