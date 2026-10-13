import type { EquipmentAccountingSubject } from '../../models'

export interface EquipmentAccountingQuery {
  subject: EquipmentAccountingSubject
  subjectId: string
  page?: number
  pageSize?: number
}
