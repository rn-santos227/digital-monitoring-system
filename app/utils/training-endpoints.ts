import { API_LOADING_MESSAGES, TRAINING_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  TrainingCategoryEndpointQuery,
  TrainingCategoryListItem,
  TrainingCategorySearchQuery,
  TrainingEndpointQuery,
  TrainingListItem,
  TrainingManagementListResponse,
  TrainingSearchQuery,
} from '~/types/domain/training'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getTrainingsEndpoint = async (query: TrainingEndpointQuery): Promise<TrainingManagementListResponse<TrainingListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingManagementListResponse<TrainingListItem>>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainings, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchTrainings)
}

export const searchTrainingsEndpoint = async (query: TrainingSearchQuery): Promise<TrainingManagementListResponse<TrainingListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingManagementListResponse<TrainingListItem>>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchTrainings)
}

export const getTrainingCategoriesEndpoint = async (query: TrainingCategoryEndpointQuery): Promise<TrainingManagementListResponse<TrainingCategoryListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingManagementListResponse<TrainingCategoryListItem>>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingCategories, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchTrainingCategories)
}

export const searchTrainingCategoriesEndpoint = async (query: TrainingCategorySearchQuery): Promise<TrainingManagementListResponse<TrainingCategoryListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingManagementListResponse<TrainingCategoryListItem>>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingCategoriesSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchTrainingCategories)
}
