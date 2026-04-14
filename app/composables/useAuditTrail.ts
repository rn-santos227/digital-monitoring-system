import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuditStore } from '~/stores/audit'
import { mapAuditLogItemToTableRow } from '~/utils/audit'

export const useAuditTrail = () => {
  const auditStore = useAuditStore()
  const { items, page, totalPages, isLoading, error } = storeToRefs(auditStore)

  const searchQuery = ref('')
  const sortKey = ref('createdAt')
  const sortDirection = ref<'asc' | 'desc'>('desc')

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
}
