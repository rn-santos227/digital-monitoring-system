import type { AuditColumns, AuditInsert, UUID } from '../shared'

export type IncidentTypesRow = AuditColumns & { id: UUID; code: string; name: string }
export type IncidentTypesInsert = AuditInsert & Omit<IncidentTypesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type IncidentTypesUpdate = Partial<IncidentTypesInsert>

export type InvestigationStatusesRow = AuditColumns & { id: UUID; name: string }
export type InvestigationStatusesInsert = AuditInsert & Omit<InvestigationStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type InvestigationStatusesUpdate = Partial<InvestigationStatusesInsert>
