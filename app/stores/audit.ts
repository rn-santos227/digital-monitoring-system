import { defineStore } from 'pinia'
import type { AuditLogListQuery, AuditState } from '~/types/domain/audit'
import { getAuditLogsEndpoint } from '~/utils/audit-endpoints'

const DEFAULT_AUDIT_QUERY: AuditLogListQuery = {
  page: 1,
  pageSize: 20,
}

const INITIAL_AUDIT_STATE: AuditState = {
  items: [],
  page: DEFAULT_AUDIT_QUERY.page,
  pageSize: DEFAULT_AUDIT_QUERY.pageSize,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  error: '',
}

const auditStoreOptions = {
  state: (): AuditState => INITIAL_AUDIT_STATE,

  getters: {
    hasAuditLogs: (state: AuditState) => state.items.length > 0,
  },

  actions: {
    async fetchAuditLogs(this: AuditState, query: Partial<AuditLogListQuery> = {}) {
      this.isLoading = true
      this.error = ''

      const requestQuery: AuditLogListQuery = {
        page: query.page ?? this.page,
        pageSize: query.pageSize ?? this.pageSize,
      }

      try {
        const response = await getAuditLogsEndpoint(requestQuery)
        this.items = response.items
        this.page = response.page
        this.pageSize = response.pageSize
        this.totalItems = response.totalItems
        this.totalPages = response.totalPages
      } catch (requestError) {
        this.items = []
        this.totalItems = 0
        this.totalPages = 0
        this.error = requestError instanceof Error ? requestError.message : 'Unable to fetch audit logs.'
        throw requestError
      } finally {
        this.isLoading = false
      }
    },
  },
}

export const useAuditStore = defineStore('audit', auditStoreOptions)
