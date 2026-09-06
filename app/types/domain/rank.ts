import type { AdvancedSearchCondition } from '~/constants/ui.constants'

export interface RankSuggestionItem {
  id: string
  code: string
  name: string
  sortOrder: number
}

export interface RankSuggestionResponse {
  items: RankSuggestionItem[]
}

export interface RankListItem {
  id: string
  code: string
  name: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface RankListResponse {
  items: RankListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface RankListQuery {
  page?: number
  pageSize?: number
  search?: string
  term?: string
  fields?: string
  conditions?: string
  match?: 'any' | 'all'
}

export type RankSearchCondition = AdvancedSearchCondition

export interface CreateRankPayload {
  code: string
  name: string
  sortOrder: number
}

export interface CreateRankResponse {
  ok: boolean
  id: string
  item: RankListItem
}

export type RankBulkUpdateValues = Partial<{
  sort_order: number
}>

export interface RankTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface RankState {
  items: RankListItem[]
  pagination: RankTablePagination
  isLoading: boolean
  error: string
  searchTerm: string
}
