import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import type {
  CreateEngagementPayload,
  CreateEngagementRecordPayload,
  EngagementManagementKpiCounts,
  EngagementManagementListItem,
  EngagementManagementSearchQuery,
  EngagementPersonnelListItem,
  EngagementTablePagination,
} from '~/types/domain/engagement'
import {
  createEngagementEndpoint,
  createEngagementRecordEndpoint,
  deleteEngagementEndpoint,
  deleteEngagementRecordEndpoint,
  getEngagementByIdEndpoint,
  getEngagementManagementKpisEndpoint,
  getEngagementRecordByIdEndpoint,
  getEngagementPersonnelEndpoint,
  getEngagementCalendarEndpoint,
  getEngagementRecordsEndpoint,
  getEngagementsEndpoint,
  searchEngagementRecordsEndpoint,
  searchEngagementsEndpoint,
  updateEngagementEndpoint,
  updateEngagementRecordEndpoint,
} from '~/utils/engagement-endpoints'
import type {
  CalendarEventsQuery,
  DomainCalendarState,
} from '~/types/domain/calendar'
import { ENGAGEMENT_CALENDAR_ERROR_MESSAGE } from '~/constants/page.constants'

const DEFAULT_PAGINATION: EngagementTablePagination = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_ENGAGEMENT_MANAGEMENT_KPIS: EngagementManagementKpiCounts = {
  totalEngagements: 0,
  totalEngagementRecords: 0,
}

interface EngagementsStoreSection {
  items: EngagementManagementListItem[]
  pagination: EngagementTablePagination
  isLoading: boolean
  error: string
}

interface EngagementsStoreState {
  engagements: EngagementsStoreSection
  records: EngagementsStoreSection
  kpis: EngagementManagementKpiCounts
  hasLoadedKpis: boolean
  selectedEngagement: EngagementManagementListItem | null
  engagementPersonnel: EngagementPersonnelListItem[]
  calendar: DomainCalendarState
}

export const useEngagementsStore = defineStore('engagements', {
  state: (): EngagementsStoreState => ({
    engagements: {
      items: [],
      pagination: { ...DEFAULT_PAGINATION },
      isLoading: false,
      error: '',
    },
    records: {
      items: [],
      pagination: { ...DEFAULT_PAGINATION },
      isLoading: false,
      error: '',
    },
    kpis: { ...DEFAULT_ENGAGEMENT_MANAGEMENT_KPIS },
    hasLoadedKpis: false,
    selectedEngagement: null,
    engagementPersonnel: [],
    calendar: {
      items: [],
      isLoading: false,
      error: '',
      lastQuery: null,
    },
  }),

  getters: {
    hasEngagements: (state) => state.engagements.items.length > 0,
    hasRecords: (state) => state.records.items.length > 0,
    engagementManagementKpis: (state) => state.kpis,
    engagementCalendarEvents: (state) => state.calendar.items,
  },

  actions: {
    async fetchEngagementCalendarEvents(
      this: EngagementsStoreState,
      query: CalendarEventsQuery,
    ) {
      this.calendar.isLoading = true
      this.calendar.error = ''
      this.calendar.lastQuery = { ...query }

      try {
        const response = await getEngagementCalendarEndpoint(query)
        this.calendar.items = response.items
        return response
      } catch (error) {
        this.calendar.items = []
        this.calendar.error = extractApiErrorMessage(
          error,
          ENGAGEMENT_CALENDAR_ERROR_MESSAGE,
        )
        throw error
      } finally {
        this.calendar.isLoading = false
      }
    },

    async fetchEngagementManagementKpisOnce(this: EngagementsStoreState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.engagements.error = ''

      try {
        this.kpis = await getEngagementManagementKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_ENGAGEMENT_MANAGEMENT_KPIS }
        this.hasLoadedKpis = false
        this.engagements.error = extractApiErrorMessage(
          error,
          'Unable to fetch engagement KPI counts.',
        )
        throw error
      }
    },

    async fetchEngagements(
      this: EngagementsStoreState,
      page = 1,
      filters: Partial<EngagementManagementSearchQuery> = {},
      pageSize?: number,
    ) {
      this.engagements.isLoading = true
      this.engagements.error = ''

      const resolvedPageSize = pageSize ?? this.engagements.pagination.pageSize
      const query: EngagementManagementSearchQuery = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        conditions: filters.conditions?.trim() || undefined,
        match: filters.match,
      }

      try {
        const response =
          query.term || query.conditions
            ? await searchEngagementsEndpoint(query)
            : await getEngagementsEndpoint(query)

        this.engagements.items = response.items
        this.engagements.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.engagements.items = []
        this.engagements.pagination = { ...DEFAULT_PAGINATION }
        this.engagements.error = extractApiErrorMessage(
          error,
          'Unable to fetch engagements.',
        )
      } finally {
        this.engagements.isLoading = false
      }
    },
    
    async createEngagement(
      this: EngagementsStoreState,
      payload: CreateEngagementPayload,
    ): Promise<{ id: string }> {
      this.engagements.error = ''

      try {
        const response = await createEngagementEndpoint(payload)
        this.engagements.items = [response.item, ...this.engagements.items]
        this.engagements.pagination.totalItems += 1
        this.engagements.pagination.totalPages = Math.max(
          1,
          Math.ceil(
            this.engagements.pagination.totalItems /
              this.engagements.pagination.pageSize,
          ),
        )

        if (this.hasLoadedKpis) {
          this.kpis = {
            ...this.kpis,
            totalEngagements: this.kpis.totalEngagements + 1,
          }
        }

        return { id: response.id }
      } catch (error) {
        this.engagements.error = extractApiErrorMessage(
          error,
          'Unable to create engagement.',
        )
        throw error
      }
    },

    async createEngagementRecord(
      this: EngagementsStoreState,
      payload: CreateEngagementRecordPayload,
    ): Promise<{ id: string }> {
      this.records.error = ''
      try {
        const response = await createEngagementRecordEndpoint(payload)
        this.records.items = [response.item, ...this.records.items]
        this.records.pagination.totalItems += 1
        this.records.pagination.totalPages = Math.max(
          1,
          Math.ceil(
            this.records.pagination.totalItems /
              this.records.pagination.pageSize,
          ),
        )
        if (this.hasLoadedKpis) {
          this.kpis = {
            ...this.kpis,
            totalEngagementRecords: this.kpis.totalEngagementRecords + 1,
          }
        }
        return { id: response.id }
      } catch (error) {
        this.records.error = extractApiErrorMessage(
          error,
          'Unable to create engagement record.',
        )
        throw error
      }
    },

    async updateEngagement(
      this: EngagementsStoreState,
      id: string,
      payload: CreateEngagementPayload,
    ): Promise<void> {
      this.engagements.error = ''

      try {
        const response = await updateEngagementEndpoint(id, payload)
        this.engagements.items = this.engagements.items.map((item) =>
          item.id === id ? response.item : item,
        )
        this.selectedEngagement = response.item
      } catch (error) {
       this.engagements.error = extractApiErrorMessage(
          error,
          'Unable to update engagement.',
        )
        throw error
      }
    },

    async deleteEngagement(
      this: EngagementsStoreState,
      id: string,
    ): Promise<void> {
      this.engagements.error = ''

      try {
        const deletedEngagement =
          this.engagements.items.find((item) => item.id === id) ?? null
        await deleteEngagementEndpoint(id)
        this.engagements.items = this.engagements.items.filter(
          (item) => item.id !== id,
        )
        this.engagements.pagination.totalItems = Math.max(
          0,
          this.engagements.pagination.totalItems - 1,
        )
        this.engagements.pagination.totalPages =
          this.engagements.pagination.totalItems === 0
            ? 0
            : Math.max(
                1,
                Math.ceil(
                  this.engagements.pagination.totalItems /
                    this.engagements.pagination.pageSize,
                ),
              )

        if (this.hasLoadedKpis && deletedEngagement) {
          this.kpis = {
            ...this.kpis,
            totalEngagements: Math.max(0, this.kpis.totalEngagements - 1),
          }
        }
      } catch (error) {
        this.engagements.error = extractApiErrorMessage(
          error,
          'Unable to delete engagement.',
        )
        throw error
      }
    },

    async getEngagementById(
      this: EngagementsStoreState,
      id: string,
    ): Promise<EngagementManagementListItem> {
      const item = await getEngagementByIdEndpoint(id)
      this.selectedEngagement = item
      return item
    },

    async fetchEngagementPersonnel(
      this: EngagementsStoreState,
      id: string,
    ): Promise<EngagementPersonnelListItem[]> {
      const response = await getEngagementPersonnelEndpoint(id)
      this.engagementPersonnel = response.items
      return response.items
    },

    async updateEngagementRecord(
      this: EngagementsStoreState,
      id: string,
      payload: CreateEngagementRecordPayload,
    ): Promise<void> {
      this.records.error = ''
      try {
        const response = await updateEngagementRecordEndpoint(id, payload)
        this.records.items = this.records.items.map((item) =>
          item.id === id ? response.item : item,
        )
      } catch (error) {
        this.records.error = extractApiErrorMessage(
          error,
          'Unable to update engagement record.',
        )
        throw error
      }
    },

    async deleteEngagementRecord(
      this: EngagementsStoreState,
      id: string,
    ): Promise<void> {
      this.records.error = ''
      try {
        const previousLength = this.records.items.length
        await deleteEngagementRecordEndpoint(id)
        this.records.items = this.records.items.filter((item) => item.id !== id)
        const deletedItemCount = previousLength - this.records.items.length
        if (deletedItemCount > 0) {
          this.records.pagination.totalItems = Math.max(
            0,
            this.records.pagination.totalItems - deletedItemCount,
          )
          this.records.pagination.totalPages =
            this.records.pagination.totalItems === 0
              ? 0
              : Math.max(
                  1,
                  Math.ceil(
                    this.records.pagination.totalItems /
                      this.records.pagination.pageSize,
                  ),
                )
        }
        if (this.hasLoadedKpis && deletedItemCount > 0) {
          this.kpis = {
            ...this.kpis,
            totalEngagementRecords: Math.max(
              0,
              this.kpis.totalEngagementRecords - deletedItemCount,
            ),
          }
        }
      } catch (error) {
        this.records.error = extractApiErrorMessage(
          error,
          'Unable to delete engagement record.',
        )
        throw error
      }
    },

    async getEngagementRecordById(
      this: EngagementsStoreState,
      id: string,
    ): Promise<EngagementManagementListItem> {
      return await getEngagementRecordByIdEndpoint(id)
    },

    async fetchEngagementRecords(
      this: EngagementsStoreState,
      page = 1,
      filters: Partial<EngagementManagementSearchQuery> = {},
      pageSize?: number,
    ) {
      this.records.isLoading = true
      this.records.error = ''

      const resolvedPageSize = pageSize ?? this.records.pagination.pageSize
      const query: EngagementManagementSearchQuery = {
        page,
        pageSize: resolvedPageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        conditions: filters.conditions?.trim() || undefined,
        match: filters.match,
      }

      try {
        const response =
          query.term || query.conditions
            ? await searchEngagementRecordsEndpoint(query)
            : await getEngagementRecordsEndpoint(query)

        this.records.items = response.items
        this.records.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.records.items = []
        this.records.pagination = { ...DEFAULT_PAGINATION }
        this.records.error = extractApiErrorMessage(error, 'Unable to fetch engagement records.')
      } finally {
        this.records.isLoading = false
      }
    },
  },
})
