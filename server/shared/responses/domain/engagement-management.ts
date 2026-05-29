import type {
  UnitListResponse,
  UnitPersonnelListItem,
  EngagementTypeListItem,
  EngagementTypeSuggestionItem,
  EngagementManagementKpiCounts,
  EngagementManagementListResponse,
  EngagementListItem,
  EngagementRecordListItem,
  EngagementSuggestionItem,
  EngagementManagementSuggestionResponse,
} from '../../models'

export type EngagementTypeListResponse = EngagementManagementListResponse<EngagementTypeListItem>
export type EngagementListResponse = EngagementManagementListResponse<EngagementListItem>
export type EngagementTypeSuggestionsResponse = EngagementManagementSuggestionResponse<EngagementTypeSuggestionItem>
export type EngagementSuggestionsResponse = EngagementManagementSuggestionResponse<EngagementSuggestionItem>
export type EngagementRecordListResponse = EngagementManagementListResponse<EngagementRecordListItem>
export type EngagementManagementKpiApiResponse = EngagementManagementKpiCounts
export interface EngagementRecordDetailResponse extends EngagementRecordListItem {}

export interface CreateEngagementResponse {
  ok: true
  id: string
  item: EngagementListItem
}

export interface CreateEngagementRecordResponse {
  ok: true
  id: string
  item: EngagementRecordListItem
}

export type EngagementPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
