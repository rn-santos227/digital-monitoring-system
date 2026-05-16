import type {
  DeploymentRecordListItem,
  DeploymentSuggestionItem,
  UnitListResponse,
  UnitPersonnelListItem,
} from '../../models'

export interface DeploymentRecordListResponse {
  items: DeploymentRecordListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface DeploymentListResponse {
  items: DeploymentSuggestionItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface DeploymentRecordDetailResponse extends DeploymentRecordListItem {}

export interface CreateDeploymentRecordResponse {
  ok: true
  id: string
  item: DeploymentRecordListItem
}

export interface DeploymentSuggestionsResponse {
  items: DeploymentSuggestionItem[]
}

export type DeploymentPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
