import type { ISODate, ISODateTime, UUID } from '../shared'

export interface PersonnelPerformanceFeedbackRow {
  id: UUID
  personnel_id: UUID
  feedback: string
  review_date: ISODate
  rating: number | null
  author_user_id: UUID
  author_personnel_id: UUID
  author_name: string
  author_rank: string
  author_service_number: string
  author_title: string | null
  authorship_confirmed: true
  officiated_at: ISODateTime
}

export interface PersonnelPerformanceFeedbackInsert {
  personnel_id: UUID
  feedback: string
  review_date: ISODate
  rating?: number | null
  author_user_id: UUID
  authorship_confirmed: true
}

export type PersonnelPerformanceFeedbackUpdate = never
