import type {
  BattalionDetailItem,
  BattalionListItem,
  CompanyListItem,
  CompanyDetailItem,
  BattalionSuggestionItem,
  CompanySuggestionItem,
  UnitEquipmentAssetListItem,
  UnitListResponse,
  UnitPersonnelListItem,
  UnitSuggestionResponse,
} from '../../models'

export type BattalionListResponse = UnitListResponse<BattalionListItem>
export type CompanyListResponse = UnitListResponse<CompanyListItem>

export type BattalionDetailResponse = BattalionDetailItem
export type CompanyDetailResponse = CompanyDetailItem

export type BattalionSuggestionsResponse = UnitSuggestionResponse<BattalionSuggestionItem>
export type CompanySuggestionsResponse = UnitSuggestionResponse<CompanySuggestionItem>

export type BattalionCompanyListResponse = UnitListResponse<CompanyListItem>
export type BattalionPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
export type BattalionEquipmentAssetListResponse = UnitListResponse<UnitEquipmentAssetListItem>

export type CompanyPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
export type CompanyEquipmentAssetListResponse = UnitListResponse<UnitEquipmentAssetListItem>
