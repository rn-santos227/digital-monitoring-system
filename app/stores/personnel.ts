import { defineStore } from 'pinia'
import type {
  CreatePersonnelPayload,
  UpdatePersonnelPayload,
  PersonnelDetail,
  PersonnelEndpointQuery,
  PersonnelListCompactItem,
  PersonnelSearchQuery,
  PersonnelState,
  PersonnelTablePagination,
} from '~/types/domain/personnel'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  createPersonnelEndpoint,
  deletePersonnelEndpoint,
  getPersonnelByIdEndpoint,
  getPersonnelEndpoint,
  searchPersonnelEndpoint,
  updatePersonnelEndpoint,
} from '~/utils/personnel-endpoints'

const DEFAULT_PAGINATION: PersonnelTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

const INITIAL_PERSONNEL_STATE: PersonnelState = {
  items: [],
  pagination: { ...DEFAULT_PAGINATION },
  isLoading: false,
  error: '',
}

const personnelStoreOptions = {
  state: (): PersonnelState => ({
    ...INITIAL_PERSONNEL_STATE,
    pagination: { ...DEFAULT_PAGINATION },
  }),

  getters: {
    hasPersonnelItems: (state: PersonnelState) => state.items.length > 0,
  },

  actions: {
    async fetchPersonnel(this: PersonnelState, page = 1, filters: Partial<PersonnelSearchQuery> = {}) {
      this.isLoading = true
      this.error = ''

      const requestQuery: PersonnelSearchQuery = {
        page,
        pageSize: this.pagination.pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
      }

      const hasSearchFilters = Boolean(requestQuery.term)

      try {
        if (hasSearchFilters) {
          const response = await searchPersonnelEndpoint(requestQuery)
          this.items = response.items.map((item): PersonnelListCompactItem => ({
            id: item.id,
            personnelCode: item.personnelCode,
            serviceNumber: item.serviceNumber,
            fullName: item.fullName,
            rankName: item.rankName,
            companyName: item.companyName,
            battalionName: item.battalionName,
            serviceStatus: item.serviceStatus,
          }))
          this.pagination = {
            page: response.page,
            pageSize: response.pageSize,
            totalItems: response.totalItems,
            totalPages: response.totalPages,
          }
          return
        }

        const response = await getPersonnelEndpoint(requestQuery as PersonnelEndpointQuery)
        this.items = response.items.map((item): PersonnelListCompactItem => ({
          id: item.id,
          personnelCode: item.personnelCode,
          serviceNumber: item.serviceNumber,
          fullName: item.fullName,
          rankName: item.rankName,
          companyName: item.companyName,
          battalionName: item.battalionName,
          serviceStatus: item.serviceStatus,
        }))
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.items = []
        this.pagination = { ...DEFAULT_PAGINATION }
        this.error = extractApiErrorMessage(error, 'Unable to fetch personnel records.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createPersonnel(this: PersonnelState, payload: CreatePersonnelPayload) {
      this.isLoading = true
      this.error = ''

      try {
        return await createPersonnelEndpoint(payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create personnel record.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchPersonnelById(this: PersonnelState, id: string): Promise<PersonnelDetail> {
      this.isLoading = true
      this.error = ''

      try {
        return await getPersonnelByIdEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to fetch personnel profile details.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updatePersonnel(this: PersonnelState, id: string, payload: UpdatePersonnelPayload) {
      this.isLoading = true
      this.error = ''

      try {
        return await updatePersonnelEndpoint(id, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update personnel record.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deletePersonnel(this: PersonnelState, id: string) {
      this.isLoading = true
      this.error = ''

      try {
        return await deletePersonnelEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete personnel record.')
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
}

export const usePersonnelStore = defineStore('personnel', personnelStoreOptions)
