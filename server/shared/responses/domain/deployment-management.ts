import type { 
  DeploymentRecordListItem,
  DeploymentSuggestionItem,
  DeploymentSelectRow
} from '../../models'

export interface DeploymentRecordListResponse {
  items: DeploymentRecordListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface DeploymentListResponse {
  items: DeploymentSelectRow[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface DeploymentRecordDetailResponse extends DeploymentRecordListItem {}

export interface CreateDeploymentRecordResponse {
  ok: true
  id: string
}

export interface DeploymentSuggestionsResponse {
  items: DeploymentSuggestionItem[]
}
