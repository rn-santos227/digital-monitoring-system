import type { EquipmentAssignmentValueItem, EquipmentAssignmentValueSummary } from '../../models'

export interface EquipmentAccountingResponse {
  summary: EquipmentAssignmentValueSummary
  items: EquipmentAssignmentValueItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
