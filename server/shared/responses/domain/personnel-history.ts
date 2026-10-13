import type { PersonnelHistoryItem } from '../../models'

export interface PersonnelHistoryResponse {
  items: PersonnelHistoryItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface SavePersonnelHistoryResponse {
  ok: true
  id: string
  item: PersonnelHistoryItem
}
