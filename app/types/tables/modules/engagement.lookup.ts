import type { AuditColumns, AuditInsert, UUID } from '../shared'

export type EngagementTypesRow = AuditColumns & { id: UUID; name: string }
export type EngagementTypesInsert = AuditInsert & Omit<EngagementTypesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EngagementTypesUpdate = Partial<EngagementTypesInsert>

export type EngagementStatusesRow = AuditColumns & { id: UUID; name: string }
export type EngagementStatusesInsert = AuditInsert & Omit<EngagementStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EngagementStatusesUpdate = Partial<EngagementStatusesInsert>
