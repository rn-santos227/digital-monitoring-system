import {
  API_LOADING_MESSAGES,
  ENGAGEMENT_MANAGEMENT_API_ENDPOINTS,
} from '~/constants/api.constants'
import type {
  EngagementManagementListItem,
  EngagementManagementListResponse,
  EngagementManagementSearchQuery,
} from '~/types/domain/engagement'
import { withApiLoading } from '~/utils/api-request'

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
