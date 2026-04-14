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

}
