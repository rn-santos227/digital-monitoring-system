import {
  API_LOADING_MESSAGES,
  ENGAGEMENT_MANAGEMENT_API_ENDPOINTS,
} from '~/constants/api.constants'
import type {
  EngagementManagementListItem,
  EngagementManagementListResponse,
  EngagementManagementSearchQuery,
  CreateEngagementPayload,
  CreateEngagementApiResponse,
} from '~/types/domain/engagement'
import { withApiLoading } from '~/utils/api-request'

export const getEngagementsEndpoint = async (
  query: EngagementManagementSearchQuery,
): Promise<EngagementManagementListResponse<EngagementManagementListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<EngagementManagementListResponse<EngagementManagementListItem>>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagements, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEngagements)
}

export const searchEngagementsEndpoint = async (
  query: EngagementManagementSearchQuery,
): Promise<EngagementManagementListResponse<EngagementManagementListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEngagements)
}

export const getEngagementRecordsEndpoint = async (
  query: EngagementManagementSearchQuery,
): Promise<EngagementManagementListResponse<EngagementManagementListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementRecords, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEngagementRecords)
}

export const searchEngagementRecordsEndpoint = async (
  query: EngagementManagementSearchQuery,
): Promise<EngagementManagementListResponse<EngagementManagementListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementRecordsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEngagementRecords)
}

export const createEngagementEndpoint = async (payload: CreateEngagementPayload): Promise<CreateEngagementApiResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEngagementApiResponse>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagements, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createEngagement)
}

export const getEngagementByIdEndpoint = async (id: string): Promise<EngagementManagementListItem> => {
  return await withApiLoading(async () => {
    return await $fetch(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEngagements)
}
