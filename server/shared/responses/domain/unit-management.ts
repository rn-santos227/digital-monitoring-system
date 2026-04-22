import type {
  BattalionListItem,
  BattalionSuggestionItem,
  CompanyListItem,
  CompanySuggestionItem,
  UnitListResponse,
  UnitSuggestionResponse,
} from '../../models'

export type BattalionListResponse = UnitListResponse<BattalionListItem>
export type CompanyListResponse = UnitListResponse<CompanyListItem>

export type BattalionDetailResponse = BattalionListItem
export type CompanyDetailResponse = CompanyListItem

export type BattalionSuggestionsResponse = UnitSuggestionResponse<BattalionSuggestionItem>
export type CompanySuggestionsResponse = UnitSuggestionResponse<CompanySuggestionItem>
