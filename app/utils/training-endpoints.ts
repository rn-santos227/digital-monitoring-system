import { API_LOADING_MESSAGES, TRAINING_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateTrainingCategoryPayload,
  CreateTrainingPayload,
  TrainingRecordListItem,
  TrainingRecordSearchQuery,
  TrainingCategoryEndpointQuery,
  TrainingCategoryListItem,
  TrainingCategorySearchQuery,
  TrainingEndpointQuery,
  TrainingListItem,
  TrainingManagementListResponse,
  TrainingSuggestionItem,
  TrainingSuggestionResponse,
  TrainingSearchQuery,
  UpdateTrainingCategoryPayload,
  UpdateTrainingPayload,
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

export const createTrainingEndpoint = async (payload: CreateTrainingPayload): Promise<{ ok: boolean; id: string }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean; id: string }>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainings, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createTraining)
}

export const createTrainingCategoryEndpoint = async (payload: CreateTrainingCategoryPayload): Promise<{ ok: boolean; id: string }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean; id: string }>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingCategories, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createTrainingCategory)
}


export const getTrainingByIdEndpoint = async (id: string): Promise<TrainingListItem> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingListItem>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchTrainings)
}

export const updateTrainingEndpoint = async (id: string, payload: UpdateTrainingPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateTraining)
}

export const deleteTrainingEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteTraining)
}

export const getTrainingCategoryByIdEndpoint = async (id: string): Promise<TrainingCategoryListItem> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingCategoryListItem>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingCategoryById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchTrainingCategories)
}

export const updateTrainingCategoryEndpoint = async (id: string, payload: UpdateTrainingCategoryPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingCategoryById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateTrainingCategory)
}

export const deleteTrainingCategoryEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingCategoryById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteTrainingCategory)
}

export const getTrainingPersonnelEndpoint = async (
  trainingId: string,
  pageSize = 25,
): Promise<TrainingManagementListResponse<TrainingRecordListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingManagementListResponse<TrainingRecordListItem>>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingRecordsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query: {
        trainingId,
        page: 1,
        pageSize,
      },
    })
  }, API_LOADING_MESSAGES.fetchTrainingPersonnel)
}

export const getTrainingSuggestionsEndpoint = async (
  query: { term?: string; pageSize?: number; selectedId?: string }
): Promise<TrainingSuggestionResponse<TrainingSuggestionItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<TrainingSuggestionResponse<TrainingSuggestionItem>>(TRAINING_MANAGEMENT_API_ENDPOINTS.trainingsSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchTrainingSuggestions)
}

