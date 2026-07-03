import {
  API_LOADING_MESSAGES,
  ENGAGEMENT_MANAGEMENT_API_ENDPOINTS,
} from '~/constants/api.constants'
import type { CalendarEventsQuery, CalendarEventsResponse } from '~/types/domain/calendar'
import type {
  CreateEngagementPayload,
  CreateEngagementApiResponse,
  CreateEngagementRecordApiResponse,
  CreateEngagementRecordPayload,
  EngagementManagementKpiCounts,
  EngagementManagementListItem,
  EngagementManagementListResponse,
  EngagementManagementSearchQuery,
  EngagementPersonnelListItem,
} from '~/types/domain/engagement'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

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

export const getEngagementManagementKpisEndpoint = async (): Promise<EngagementManagementKpiCounts> => {
  return await withApiLoading(async () => {
    return await $fetch<EngagementManagementKpiCounts>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.kpis, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEngagementManagementKpis)
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

export const createEngagementRecordEndpoint = async (
  payload: CreateEngagementRecordPayload,
): Promise<CreateEngagementRecordApiResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEngagementRecordApiResponse>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementRecords, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createEngagementRecord)
}

export const updateEngagementEndpoint = async (id: string, payload: CreateEngagementPayload): Promise<CreateEngagementApiResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEngagementApiResponse>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateEngagement)
}

export const updateEngagementRecordEndpoint = async (
  id: string,
  payload: CreateEngagementRecordPayload,
): Promise<CreateEngagementRecordApiResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateEngagementRecordApiResponse>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementRecordById(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateEngagementRecord)
}

export const deleteEngagementEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteEngagement)
}

export const deleteEngagementRecordEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementRecordById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteEngagementRecord)
}

export const getEngagementPersonnelEndpoint = async (
  id: string,
): Promise<EngagementManagementListResponse<EngagementPersonnelListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<EngagementManagementListResponse<EngagementPersonnelListItem>>(
      ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementPersonnel(id),
      {
        method: 'GET',
        headers: createSessionHeaders(),
      },
    )
  }, API_LOADING_MESSAGES.fetchEngagementPersonnel)
}

export const getEngagementByIdEndpoint = async (id: string): Promise<EngagementManagementListItem> => {
  return await withApiLoading(async () => {
    return await $fetch(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEngagements)
}

export const getEngagementRecordByIdEndpoint = async (id: string): Promise<EngagementManagementListItem> => {
  return await withApiLoading(async () => {
    return await $fetch(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementRecordById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchEngagementRecords)
}

export const getEngagementCalendarEndpoint = async (query: CalendarEventsQuery): Promise<CalendarEventsResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CalendarEventsResponse>(ENGAGEMENT_MANAGEMENT_API_ENDPOINTS.engagementsCalendar, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchEngagementCalendar)
}
