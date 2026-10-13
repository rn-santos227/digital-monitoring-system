import type { PersonnelFeedbackItem } from '../../models'

export interface PersonnelFeedbackResponse {
  items: PersonnelFeedbackItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreatePersonnelFeedbackResponse {
  ok: true
  id: string
  item: PersonnelFeedbackItem
}
