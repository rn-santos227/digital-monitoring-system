import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuditLogListItem, AuditLogListQuery } from '~/types/domain/audit'
import { getAuditLogsEndpoint } from '~/utils/audit-endpoints'

const DEFAULT_AUDIT_QUERY: AuditLogListQuery = {
  page: 1,
  pageSize: 20,
}

export const useAuditStore = defineStore('audit', () => {
  const items = ref<AuditLogListItem[]>([])
  const page = ref(DEFAULT_AUDIT_QUERY.page)
  const pageSize = ref(DEFAULT_AUDIT_QUERY.pageSize)
  const totalItems = ref(0)
  const totalPages = ref(0)
  const isLoading = ref(false)
  const error = ref('')


})
