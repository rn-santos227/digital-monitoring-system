export interface RankListItem {
  id: string
  code: string
  name: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface RankSuggestionItem {
  id: string
  code: string
  name: string
  sortOrder: number
}

export interface RankCreate {
  code: string
  name: string
  sort_order: number
}

export interface RankRow {
  id: string
  code: string
  name: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface RankSuggestionRow {
  id: string
  code: string
  name: string
  sort_order: number
}

export interface RankListResponse {
  items: RankListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface RankSuggestionResponse {
  items: RankSuggestionItem[]
}
