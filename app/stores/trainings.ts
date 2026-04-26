import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  getTrainingCategoriesEndpoint,
  getTrainingsEndpoint,
  searchTrainingCategoriesEndpoint,
  searchTrainingsEndpoint,
} from '~/utils/training-endpoints'
import type {
  TrainingCategoriesState,
  TrainingCategoryListItem,
  TrainingCategorySearchQuery,
  TrainingListItem,
  TrainingsState,
  TrainingSearchQuery,
  TrainingTablePagination,
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
}

const trainingsStoreOptions = {
  state: (): TrainingsStoreState => ({
    ...INITIAL_TRAININGS_STORE_STATE,
    trainings: { ...INITIAL_TRAININGS_STORE_STATE.trainings, pagination: { ...DEFAULT_PAGINATION } },
    categories: { ...INITIAL_TRAININGS_STORE_STATE.categories, pagination: { ...DEFAULT_PAGINATION } },
  }),

  getters: {
    hasTrainings: (state: TrainingsStoreState) => state.trainings.items.length > 0,
    hasTrainingCategories: (state: TrainingsStoreState) => state.categories.items.length > 0,
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
          trainingCategoryName: item.trainingCategoryName,
          levelName: item.levelName,
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
  },
}

export const useTrainingsStore = defineStore('trainings', trainingsStoreOptions)
