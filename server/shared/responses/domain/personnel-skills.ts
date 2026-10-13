import type { PersonnelSkillItem, PersonnelSkillTrainingRow } from '../../models'

export interface PersonnelSkillsResponse {
  items: PersonnelSkillItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface SavePersonnelSkillResponse {
  ok: true
  id: string
  item: PersonnelSkillItem
}

export interface PersonnelSkillTrainingOptionsResponse {
  items: PersonnelSkillTrainingRow[]
}
