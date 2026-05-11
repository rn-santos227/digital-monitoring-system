import type { RankListItem, RankListResponse, RankSuggestionResponse } from '../../models'

export interface CreateRankApiResponse {
  ok: true
  id: string
  item: RankListItem
}

export type RankListApiResponse = RankListResponse
export type RankSuggestionApiResponse = RankSuggestionResponse
