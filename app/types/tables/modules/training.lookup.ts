import type { AuditColumns, AuditInsert, UUID } from '../shared'

export type TrainingCategoriesRow = AuditColumns & { id: UUID; code: string; name: string }
export type TrainingCategoriesInsert = AuditInsert & Omit<TrainingCategoriesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type TrainingCategoriesUpdate = Partial<TrainingCategoriesInsert>

export type TrainingStatusesRow = AuditColumns & { id: UUID; name: string }
export type TrainingStatusesInsert = AuditInsert & Omit<TrainingStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type TrainingStatusesUpdate = Partial<TrainingStatusesInsert>
