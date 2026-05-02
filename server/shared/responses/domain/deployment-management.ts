import type { 
  DeploymentRecordListItem,
  DeploymentSuggestionItem,
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
}

export interface DeploymentSuggestionsResponse {
  items: DeploymentSuggestionItem[]
}
