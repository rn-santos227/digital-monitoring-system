import { defineStore } from 'pinia'
import type { AuditLogListQuery, AuditLogSearchQuery, AuditState } from '~/types/domain/audit'
import { getAuditLogByIdEndpoint, getAuditLogsEndpoint, searchAuditLogsEndpoint } from '~/utils/audit-endpoints'

const DEFAULT_AUDIT_QUERY: AuditLogListQuery = {
  page: 1,
  pageSize: 20,
}

const INITIAL_AUDIT_STATE: AuditState = {
  items: [],
  selectedAuditLog: null,
  page: DEFAULT_AUDIT_QUERY.page,
  pageSize: DEFAULT_AUDIT_QUERY.pageSize,
  totalItems: 0,
  totalPages: 0,
  isLoading: false,
  isDetailLoading: false,
  error: '',
  detailError: '',
}

const auditStoreOptions = {
  state: (): AuditState => INITIAL_AUDIT_STATE,

  getters: {
    hasAuditLogs: (state: AuditState) => state.items.length > 0,
    hasSelectedAuditLog: (state: AuditState) => Boolean(state.selectedAuditLog),
  },

  actions: {
    async fetchAuditLogs(this: AuditState, query: Partial<AuditLogSearchQuery> = {}) {
      this.isLoading = true
      this.error = ''

      const requestQuery: AuditLogSearchQuery = {
        page: query.page ?? this.page,
        pageSize: query.pageSize ?? this.pageSize,
        term: query.term?.trim() || undefined,
        fields: query.fields?.trim() || undefined,
        userName: query.userName?.trim() || undefined,
        startDate: query.startDate?.trim() || undefined,
        endDate: query.endDate?.trim() || undefined,
      }

      const hasSearchFilters = Boolean(
        requestQuery.term || requestQuery.userName || requestQuery.startDate || requestQuery.endDate
      )

      try {
        const response = hasSearchFilters
          ? await searchAuditLogsEndpoint(requestQuery)
          : await getAuditLogsEndpoint(requestQuery as AuditLogListQuery)
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

    async fetchAuditLogById(this: AuditState, id: string) {
      this.isDetailLoading = true
      this.detailError = ''
      this.selectedAuditLog = null

      try {
        this.selectedAuditLog = await getAuditLogByIdEndpoint(id)
      } catch (requestError) {
        this.detailError = requestError instanceof Error ? requestError.message : 'Unable to fetch audit log details.'
        throw requestError
      } finally {
        this.isDetailLoading = false
      }
    },

    clearSelectedAuditLog(this: AuditState) {
      this.selectedAuditLog = null
      this.detailError = ''
    },
  },
}

export const useAuditStore = defineStore('audit', auditStoreOptions)
