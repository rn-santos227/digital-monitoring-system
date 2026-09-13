import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createTrainingCategoryEndpoint,
  createTrainingRecordEndpoint,
  createTrainingEndpoint,
  deleteTrainingCategoryEndpoint,
  deleteTrainingRecordEndpoint,
  deleteTrainingEndpoint,
  getTrainingByIdEndpoint,
  getTrainingCategoryByIdEndpoint,
  getTrainingManagementKpisEndpoint,
  getTrainingRecordByIdEndpoint,
  getTrainingCalendarEndpoint,
  getTrainingCategoriesEndpoint,
  getTrainingRecordsEndpoint,
  getTrainingsEndpoint,
  searchTrainingRecordsEndpoint,
  searchTrainingCategoriesEndpoint,
  searchTrainingsEndpoint,
  updateTrainingCategoryEndpoint,
} from '~/utils/training-endpoints'
import type {
  CreateTrainingCategoryPayload,
  CreateTrainingPayload,
  CreateTrainingRecordPayload,
  TrainingCategoriesState,
  TrainingCategoryListItem,
  TrainingCategorySearchQuery,
  TrainingEndpointQuery,
  TrainingListItem,
  TrainingManagementKpiCounts,
  TrainingRecordSearchQuery,
  TrainingRecordsState,
  TrainingsState,
  TrainingSearchQuery,
  TrainingTablePagination,
  UpdateTrainingCategoryPayload,
  UpdateTrainingRecordPayload,
  UpdateTrainingPayload,
} from '~/types/domain/training'
import type { CalendarEventsQuery, DomainCalendarState } from '~/types/domain/calendar'
import { TRAINING_CALENDAR_ERROR_MESSAGE } from '~/constants/page.constants'

const DEFAULT_PAGINATION: TrainingTablePagination = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_TRAINING_MANAGEMENT_KPIS: TrainingManagementKpiCounts = {
  totalRecords: 0,
  totalTrainings: 0,
  totalCategories: 0,
  unusedCategories: 0,
}

interface TrainingsStoreState {
  trainings: TrainingsState
  categories: TrainingCategoriesState
  records: TrainingRecordsState
  kpis: TrainingManagementKpiCounts
  hasLoadedKpis: boolean
  calendar: DomainCalendarState
}

const INITIAL_TRAININGS_STORE_STATE: TrainingsStoreState = {
  trainings: {
    items: [],
    pagination: { ...DEFAULT_PAGINATION },
    isLoading: false,
    error: '',
  },
  categories: {
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
  kpis: { ...DEFAULT_TRAINING_MANAGEMENT_KPIS },
  hasLoadedKpis: false,
  calendar: {
    items: [],
    isLoading: false,
    error: '',
    lastQuery: null,
  },
}

const updateTrainingKpis = (
  kpis: TrainingManagementKpiCounts,
  updates: Partial<TrainingManagementKpiCounts>,
): TrainingManagementKpiCounts => ({
  totalRecords: Math.max(0, updates.totalRecords ?? kpis.totalRecords),
  totalTrainings: Math.max(0, updates.totalTrainings ?? kpis.totalTrainings),
  totalCategories: Math.max(0, updates.totalCategories ?? kpis.totalCategories),
  unusedCategories: Math.max(0, updates.unusedCategories ?? kpis.unusedCategories),
})

const trainingsStoreOptions = {
  state: (): TrainingsStoreState => ({
    ...INITIAL_TRAININGS_STORE_STATE,
    trainings: { ...INITIAL_TRAININGS_STORE_STATE.trainings, pagination: { ...DEFAULT_PAGINATION } },
    categories: { ...INITIAL_TRAININGS_STORE_STATE.categories, pagination: { ...DEFAULT_PAGINATION } },
    records: { ...INITIAL_TRAININGS_STORE_STATE.records, pagination: { ...DEFAULT_PAGINATION } },
    kpis: { ...DEFAULT_TRAINING_MANAGEMENT_KPIS },
    calendar: { ...INITIAL_TRAININGS_STORE_STATE.calendar, items: [], lastQuery: null },
  }),

  getters: {
    hasTrainings: (state: TrainingsStoreState) => state.trainings.items.length > 0,
    hasTrainingCategories: (state: TrainingsStoreState) => state.categories.items.length > 0,
    hasTrainingRecords: (state: TrainingsStoreState) => state.records.items.length > 0,
    trainingManagementKpis: (state: TrainingsStoreState) => state.kpis,
    trainingCalendarEvents: (state: TrainingsStoreState) => state.calendar.items,
  },

  actions: {
    async fetchTrainingCalendarEvents(this: TrainingsStoreState, query: CalendarEventsQuery) {
      this.calendar.isLoading = true
      this.calendar.error = ''
      this.calendar.lastQuery = { ...query }

      try {
        const response = await getTrainingCalendarEndpoint(query)
        this.calendar.items = response.items
        return response
      } catch (error) {
        this.calendar.items = []
        this.calendar.error = extractApiErrorMessage(error, TRAINING_CALENDAR_ERROR_MESSAGE)
        throw error
      } finally {
        this.calendar.isLoading = false
      }
    },

    async fetchTrainingManagementKpisOnce(this: TrainingsStoreState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.trainings.error = ''

      try {
        this.kpis = await getTrainingManagementKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_TRAINING_MANAGEMENT_KPIS }
        this.hasLoadedKpis = false
        this.trainings.error = extractApiErrorMessage(error, 'Unable to fetch training KPI counts.')
        throw error
      }
    },

    async fetchTrainings(this: TrainingsStoreState, page = 1, filters: Partial<TrainingSearchQuery> = {}, pageSize = this.trainings.pagination.pageSize) {
      this.trainings.isLoading = true
      this.trainings.error = ''

      const requestQuery: TrainingSearchQuery = {
        page,
        pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        conditions: filters.conditions?.trim() || undefined,
        match: filters.match,
        trainingCategoryId: filters.trainingCategoryId?.trim() || undefined,
        statusId: filters.statusId?.trim() || undefined,
      }

      const hasSearchFilters = Boolean(
        requestQuery.term
        || requestQuery.conditions
        || requestQuery.trainingCategoryId
        || requestQuery.statusId
      )

      try {
        const response = hasSearchFilters
          ? await searchTrainingsEndpoint(requestQuery)
          : await getTrainingsEndpoint({ page, pageSize })

        this.trainings.items = response.items.map((item): TrainingListItem => ({
          id: item.id,
          trainingTitle: item.trainingTitle,
          trainingCategoryId: item.trainingCategoryId,
          trainingCategoryName: item.trainingCategoryName,
          levelId: item.levelId,
          levelName: item.levelName,
          statusId: item.statusId,
          statusName: item.statusName,
          startDate: item.startDate,
          endDate: item.endDate,
          defaultRemarks: item.defaultRemarks,
        }))

        this.trainings.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.trainings.items = []
        this.trainings.pagination = { ...DEFAULT_PAGINATION }
        this.trainings.error = extractApiErrorMessage(error, 'Unable to fetch trainings.')
        throw error
      } finally {
        this.trainings.isLoading = false
      }
    },

    async fetchTrainingCategories(this: TrainingsStoreState, page = 1, filters: Partial<TrainingCategorySearchQuery> = {}, pageSize = this.categories.pagination.pageSize) {
      this.categories.isLoading = true
      this.categories.error = ''

      const requestQuery: TrainingCategorySearchQuery = {
        page,
        pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
      }

      const hasSearchFilters = Boolean(requestQuery.term)

      try {
        const response = hasSearchFilters
          ? await searchTrainingCategoriesEndpoint(requestQuery)
          : await getTrainingCategoriesEndpoint({ page, pageSize })

        this.categories.items = response.items.map((item): TrainingCategoryListItem => ({
          id: item.id,
          code: item.code,
          name: item.name,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))

        this.categories.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.categories.items = []
        this.categories.pagination = { ...DEFAULT_PAGINATION }
        this.categories.error = extractApiErrorMessage(error, 'Unable to fetch training categories.')
        throw error
      } finally {
        this.categories.isLoading = false
      }
    },

    async fetchTrainingRecords(this: TrainingsStoreState, page = 1, filters: Partial<TrainingRecordSearchQuery> = {}, pageSize = this.records.pagination.pageSize) {
      this.records.isLoading = true
      this.records.error = ''

      const query: TrainingEndpointQuery = { page, pageSize, search: filters.term ?? '' }

      try {
        const response = filters.term
          ? await searchTrainingRecordsEndpoint({ page, pageSize, term: filters.term, fields: filters.fields })
          : await getTrainingRecordsEndpoint(query)

        this.records.items = response.items
        this.records.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.records.items = []
        this.records.pagination = { page, pageSize, totalItems: 0, totalPages: 0 }
        this.records.error = extractApiErrorMessage(error, 'Failed to fetch training records.')
        throw error
      } finally {
        this.records.isLoading = false
      }
    },

    async createTraining(this: TrainingsStoreState, payload: CreateTrainingPayload): Promise<{ id: string }> {
      this.trainings.error = ''

      try {
        const response = await createTrainingEndpoint(payload)
        const wasCategoryUnused = response.item.trainingCategoryId
          ? !this.trainings.items.some(item => item.trainingCategoryId === response.item.trainingCategoryId)
          : false

        this.trainings.items = [
          ...this.trainings.items,
          response.item,
        ]
        this.trainings.pagination.totalItems += 1
        this.trainings.pagination.totalPages = Math.max(1, Math.ceil(this.trainings.pagination.totalItems / this.trainings.pagination.pageSize))

        if (this.hasLoadedKpis) {
          this.kpis = updateTrainingKpis(this.kpis, {
            totalTrainings: this.kpis.totalTrainings + 1,
            unusedCategories: wasCategoryUnused
              ? this.kpis.unusedCategories - 1
              : this.kpis.unusedCategories,
          })
        }

        return { id: response.id }
      } catch (error) {
        this.trainings.error = extractApiErrorMessage(error, 'Unable to create training.')
        throw error
      }
    },

    async createTrainingCategory(this: TrainingsStoreState, payload: CreateTrainingCategoryPayload): Promise<{ id: string }> {
      this.categories.error = ''

      try {
        const response = await createTrainingCategoryEndpoint(payload)
        this.categories.items = [
          ...this.categories.items,
          response.item,
        ]
        this.categories.pagination.totalItems += 1
        this.categories.pagination.totalPages = Math.max(1, Math.ceil(this.categories.pagination.totalItems / this.categories.pagination.pageSize))

        if (this.hasLoadedKpis) {
          this.kpis = updateTrainingKpis(this.kpis, {
            totalCategories: this.kpis.totalCategories + 1,
            unusedCategories: this.kpis.unusedCategories + 1,
          })
        }

        return { id: response.id }
      } catch (error) {
        this.categories.error = extractApiErrorMessage(error, 'Unable to create training category.')
        throw error
      }
    },

    async createTrainingRecord(this: TrainingsStoreState, payload: CreateTrainingRecordPayload): Promise<{ id: string }> {
      this.records.error = ''
      try {
        const response = await createTrainingRecordEndpoint(payload)
        this.records.items = [
          ...this.records.items,
          response.item
        ]
        this.records.pagination.totalItems += 1
        this.records.pagination.totalPages = Math.max(1, Math.ceil(this.records.pagination.totalItems / this.records.pagination.pageSize))

        if (this.hasLoadedKpis) {
          this.kpis = updateTrainingKpis(this.kpis, {
            totalRecords: this.kpis.totalRecords + 1,
          })
        }

        return { id: response.id }
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to create training record.')
        throw error
      }
    },

    async getTrainingById(this: TrainingsStoreState, id: string) {
      return await getTrainingByIdEndpoint(id)
    },

    async getTrainingCategoryById(this: TrainingsStoreState, id: string) {
      return await getTrainingCategoryByIdEndpoint(id)
    },

    async updateTraining(this: TrainingsStoreState, id: string, payload: UpdateTrainingPayload) {
      this.trainings.error = ''

      try {
        this.trainings.items = this.trainings.items.map((item) => {
          if (item.id !== id) {
            return item
          }
          return {
            ...item,
            trainingTitle: payload.trainingTitle ?? item.trainingTitle,
            trainingCategoryId: payload.trainingCategoryId ?? item.trainingCategoryId,
            statusId: payload.statusId ?? item.statusId,
            levelId: payload.levelId ?? item.levelId,
            startDate: payload.startDate ?? item.startDate,
            endDate: payload.endDate ?? item.endDate,
            defaultRemarks: payload.defaultRemarks ?? item.defaultRemarks,
          }
        })
      } catch (error) {
        this.trainings.error = extractApiErrorMessage(error, 'Unable to update training.')
        throw error
      }
    },

    async updateTrainingCategory(this: TrainingsStoreState, id: string, payload: UpdateTrainingCategoryPayload) {
      this.categories.error = ''

      try {
        await updateTrainingCategoryEndpoint(id, payload)
        this.categories.items = this.categories.items.map((item) => {
          if (item.id !== id) {
            return item
          }
          return { ...item, code: payload.code ?? item.code, name: payload.name ?? item.name, updatedAt: new Date().toISOString() }
        })
      } catch (error) {
        this.categories.error = extractApiErrorMessage(error, 'Unable to update training category.')
        throw error
      }
    },

    async updateTrainingRecord(this: TrainingsStoreState, id: string, payload: UpdateTrainingRecordPayload) {
      this.records.error = ''
      try {
        await updateTrainingRecordEndpoint(id, payload)
        const updatedTrainingRecord = await getTrainingRecordByIdEndpoint(id)
        this.records.items = this.records.items.map(item => item.id === id ? updatedTrainingRecord : item)
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to update training record.')
        throw error
      }
    },

    async deleteTraining(this: TrainingsStoreState, id: string) {
      this.trainings.error = ''

      try {
        const deletedTraining = this.trainings.items.find(item => item.id === id) ?? null
        await deleteTrainingEndpoint(id)
        this.trainings.items = this.trainings.items.filter(item => item.id !== id)
        this.trainings.pagination.totalItems = Math.max(0, this.trainings.pagination.totalItems - 1)
        this.trainings.pagination.totalPages = this.trainings.pagination.totalItems === 0
          ? 0
          : Math.max(1, Math.ceil(this.trainings.pagination.totalItems / this.trainings.pagination.pageSize))

        if (this.hasLoadedKpis) {
          const remainingCategoryUse = deletedTraining?.trainingCategoryId
            ? this.trainings.items.some(item => item.trainingCategoryId === deletedTraining.trainingCategoryId)
            : true

          this.kpis = updateTrainingKpis(this.kpis, {
            totalTrainings: this.kpis.totalTrainings - 1,
            unusedCategories: deletedTraining?.trainingCategoryId && !remainingCategoryUse
              ? this.kpis.unusedCategories + 1
              : this.kpis.unusedCategories,
          })
        }
      } catch (error) {
        this.trainings.error = extractApiErrorMessage(error, 'Unable to delete training.')
        throw error
      }
    },

    async deleteTrainingCategory(this: TrainingsStoreState, id: string) {
      this.categories.error = ''

      try {
        const deletedCategory = this.categories.items.find(item => item.id === id) ?? null
        await deleteTrainingCategoryEndpoint(id)
        this.categories.items = this.categories.items.filter(item => item.id !== id)
        this.categories.pagination.totalItems = Math.max(0, this.categories.pagination.totalItems - 1)
        this.categories.pagination.totalPages = this.categories.pagination.totalItems === 0
          ? 0
          : Math.max(1, Math.ceil(this.categories.pagination.totalItems / this.categories.pagination.pageSize))

        if (this.hasLoadedKpis && deletedCategory) {
          this.kpis = updateTrainingKpis(this.kpis, {
            totalCategories: this.kpis.totalCategories - 1,
            unusedCategories: this.kpis.unusedCategories - 1,
          })
        }
      } catch (error) {
        this.categories.error = extractApiErrorMessage(error, 'Unable to delete training category.')
        throw error
      }
    },

    async deleteTrainingRecord(this: TrainingsStoreState, id: string) {
      this.records.error = ''
      try {
        const deletedRecord = this.records.items.find(item => item.id === id) ?? null
        await deleteTrainingRecordEndpoint(id)
        this.records.items = this.records.items.filter(item => item.id !== id)
        this.records.pagination.totalItems = Math.max(0, this.records.pagination.totalItems - 1)
        this.records.pagination.totalPages = this.records.pagination.totalItems === 0 ? 0 : Math.max(1, Math.ceil(this.records.pagination.totalItems / this.records.pagination.pageSize))

        if (this.hasLoadedKpis && deletedRecord) {
          this.kpis = updateTrainingKpis(this.kpis, {
            totalRecords: this.kpis.totalRecords - 1,
          })
        }
      } catch (error) {
        this.records.error = extractApiErrorMessage(error, 'Unable to delete training record.')
        throw error
      }
    },
  },
}

export const useTrainingsStore = defineStore('trainings', trainingsStoreOptions)
