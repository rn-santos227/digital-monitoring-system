import type {
  BattalionDetailItem,
  BattalionListItem,
  CompanyListItem,
  CompanyDetailItem,
  BattalionSuggestionItem,
  CompanySuggestionItem,
  UnitEquipmentAssetListItem,
  UnitManagementKpiCounts,
  UnitListResponse,
  UnitPersonnelListItem,
  UnitSuggestionResponse,
} from '../../models'

export type BattalionListResponse = UnitListResponse<BattalionListItem>
export type CompanyListResponse = UnitListResponse<CompanyListItem>
export type UnitManagementKpiApiResponse = UnitManagementKpiCounts

export type BattalionDetailResponse = BattalionDetailItem
export type CompanyDetailResponse = CompanyDetailItem

export type BattalionSuggestionsResponse = UnitSuggestionResponse<BattalionSuggestionItem>
export type CompanySuggestionsResponse = UnitSuggestionResponse<CompanySuggestionItem>

export type BattalionCompanyListResponse = UnitListResponse<CompanyListItem>
export type BattalionPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
export type BattalionEquipmentAssetListResponse = UnitListResponse<UnitEquipmentAssetListItem>

export type CompanyPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
export type CompanyEquipmentAssetListResponse = UnitListResponse<UnitEquipmentAssetListItem>

export interface CreateBattalionResponse {
  ok: true
  id: string
  item: BattalionListItem
}

export interface CreateCompanyResponse {
  ok: true
  id: string
  item: CompanyListItem
}
