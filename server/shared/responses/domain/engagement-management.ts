import type {
  UnitListResponse,
  UnitPersonnelListItem,
  EngagementTypeListItem,
  EngagementTypeSuggestionItem,
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
export interface EngagementRecordDetailResponse extends EngagementRecordListItem {}

export interface CreateEngagementRecordResponse {
  ok: true
  id: string
}

export type EngagementPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
