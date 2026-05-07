import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  createTrainingCategoryEndpoint,
  createTrainingRecordEndpoint,
  createTrainingEndpoint,
  deleteTrainingCategoryEndpoint,
  deleteTrainingRecordEndpoint,
  deleteTrainingEndpoint,
  getTrainingByIdEndpoint,
  getTrainingCategoryByIdEndpoint,
  getTrainingRecordByIdEndpoint,
  getTrainingCategoriesEndpoint,
  getTrainingRecordsEndpoint,
  getTrainingsEndpoint,
  searchTrainingRecordsEndpoint,
  searchTrainingCategoriesEndpoint,
  searchTrainingsEndpoint,
  updateTrainingCategoryEndpoint,
  updateTrainingEndpoint,
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
  TrainingRecordListItem,
  TrainingRecordSearchQuery,
  TrainingRecordsState,
  TrainingsState,
  TrainingSearchQuery,
  TrainingTablePagination,
  UpdateTrainingCategoryPayload,
  UpdateTrainingRecordPayload,
  UpdateTrainingPayload,
} from '~/types/domain/training'

const DEFAULT_PAGINATION: TrainingTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

interface TrainingsStoreState {
  trainings: TrainingsState
  categories: TrainingCategoriesState
  trainingRecords: TrainingRecordsState
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
  trainingRecords: {
    items: [],
    pagination: { ...DEFAULT_PAGINATION },
    isLoading: false,
    error: '',
  },
}

const trainingsStoreOptions = {
  state: (): TrainingsStoreState => ({
    ...INITIAL_TRAININGS_STORE_STATE,
    trainings: { ...INITIAL_TRAININGS_STORE_STATE.trainings, pagination: { ...DEFAULT_PAGINATION } },
    categories: { ...INITIAL_TRAININGS_STORE_STATE.categories, pagination: { ...DEFAULT_PAGINATION } },
    trainingRecords: { ...INITIAL_TRAININGS_STORE_STATE.trainingRecords, pagination: { ...DEFAULT_PAGINATION } },
  }),

  getters: {
    hasTrainings: (state: TrainingsStoreState) => state.trainings.items.length > 0,
    hasTrainingCategories: (state: TrainingsStoreState) => state.categories.items.length > 0,
    hasTrainingRecords: (state: TrainingsStoreState) => state.trainingRecords.items.length > 0,
  },

  actions: {
    async fetchTrainings(this: TrainingsStoreState, page = 1, filters: Partial<TrainingSearchQuery> = {}, pageSize = this.trainings.pagination.pageSize) {
      this.trainings.isLoading = true
      this.trainings.error = ''

      const requestQuery: TrainingSearchQuery = {
        page,
        pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        trainingCategoryId: filters.trainingCategoryId?.trim() || undefined,
        statusId: filters.statusId?.trim() || undefined,
      }

      const hasSearchFilters = Boolean(
        requestQuery.term
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

    async fetchTrainingRecords(this: TrainingsStoreState, page = 1, filters: Partial<TrainingRecordSearchQuery> = {}, pageSize = this.trainingRecords.pagination.pageSize) {
      this.trainingRecords.isLoading = true
      this.trainingRecords.error = ''

      const query: TrainingEndpointQuery = { page, pageSize, search: filters.term ?? '' }

      try {
        const response = filters.term
          ? await searchTrainingRecordsEndpoint({ page, pageSize, term: filters.term, fields: filters.fields })
          : await getTrainingRecordsEndpoint(query)

        this.trainingRecords.items = response.items
        this.trainingRecords.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.trainingRecords.items = []
        this.trainingRecords.pagination = { page, pageSize, totalItems: 0, totalPages: 0 }
        this.trainingRecords.error = extractApiErrorMessage(error, 'Failed to fetch training records.')
        throw error
      } finally {
        this.trainingRecords.isLoading = false
      }
    },

    async createTraining(this: TrainingsStoreState, payload: CreateTrainingPayload): Promise<{ id: string }> {
      this.trainings.error = ''

      try {
        const response = await createTrainingEndpoint(payload)
        const createdTraining = await getTrainingByIdEndpoint(response.id)
        this.trainings.items = [
          ...this.trainings.items,
          createdTraining,
        ]
        this.trainings.pagination.totalItems += 1
        this.trainings.pagination.totalPages = Math.max(1, Math.ceil(this.trainings.pagination.totalItems / this.trainings.pagination.pageSize))
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
        const createdTrainingCategory = await getTrainingCategoryByIdEndpoint(response.id)
        this.categories.items = [
          ...this.categories.items,
          createdTrainingCategory,
        ]
        this.categories.pagination.totalItems += 1
        this.categories.pagination.totalPages = Math.max(1, Math.ceil(this.categories.pagination.totalItems / this.categories.pagination.pageSize))
        return { id: response.id }
      } catch (error) {
        this.categories.error = extractApiErrorMessage(error, 'Unable to create training category.')
        throw error
      }
    },

    async createTrainingRecord(this: TrainingsStoreState, payload: CreateTrainingRecordPayload): Promise<{ id: string }> {
      this.trainingRecords.error = ''
      try {
        const response = await createTrainingRecordEndpoint(payload)
        const createdTrainingRecord = await getTrainingRecordByIdEndpoint(response.id)
        this.trainingRecords.items = [...this.trainingRecords.items, createdTrainingRecord]
        this.trainingRecords.pagination.totalItems += 1
        this.trainingRecords.pagination.totalPages = Math.max(1, Math.ceil(this.trainingRecords.pagination.totalItems / this.trainingRecords.pagination.pageSize))
        return { id: response.id }
      } catch (error) {
        this.trainingRecords.error = extractApiErrorMessage(error, 'Unable to create training record.')
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

    async deleteTraining(this: TrainingsStoreState, id: string) {
      this.trainings.error = ''

      try {
        this.trainings.items = this.trainings.items.filter(item => item.id !== id)
        this.trainings.pagination.totalItems = Math.max(0, this.trainings.pagination.totalItems - 1)
        this.trainings.pagination.totalPages = this.trainings.pagination.totalItems === 0
          ? 0
          : Math.max(1, Math.ceil(this.trainings.pagination.totalItems / this.trainings.pagination.pageSize))
      } catch (error) {
        this.trainings.error = extractApiErrorMessage(error, 'Unable to delete training.')
        throw error
      }
    },

    async deleteTrainingCategory(
      this: TrainingsStoreState & {
        fetchTrainingCategories: (page?: number, filters?: Partial<TrainingCategorySearchQuery>) => Promise<void>
      },
      id: string,
    ) {
      this.categories.error = ''

      try {
        await deleteTrainingCategoryEndpoint(id)
        await this.fetchTrainingCategories(1)
      } catch (error) {
        this.categories.error = extractApiErrorMessage(error, 'Unable to delete training category.')
        throw error
      }
    },
  },
}

export const useTrainingsStore = defineStore('trainings', trainingsStoreOptions)
