import { API_LOADING_MESSAGES, PERSONNEL_API_ENDPOINTS } from '~/constants/api.constants'
import type { 
  CreateRankPayload,
  CreateRankResponse,
  RankListQuery, RankListResponse,
  RankSuggestionResponse
} from '~/types/domain/rank'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getRankSuggestionsEndpoint = async (query: { term?: string; pageSize?: number; selectedId?: string }): Promise<RankSuggestionResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<RankSuggestionResponse>(PERSONNEL_API_ENDPOINTS.rankSuggestions, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchRanks)
}

export const getRanksEndpoint = async (query: RankListQuery): Promise<RankListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<RankListResponse>(PERSONNEL_API_ENDPOINTS.ranks, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchRanks)
}

export const createRankEndpoint = async (payload: CreateRankPayload): Promise<CreateRankResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<CreateRankResponse>(PERSONNEL_API_ENDPOINTS.ranks, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createRank)
}

export const deleteRankEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(PERSONNEL_API_ENDPOINTS.rankById(id), {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteRank)
}
