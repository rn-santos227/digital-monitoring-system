import type { AuditColumns, AuditInsert, UUID } from '../shared'

export type LevelsRow = AuditColumns & { id: UUID; name: string }
export type LevelsInsert = AuditInsert & Omit<LevelsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type LevelsUpdate = Partial<LevelsInsert>

export type DeploymentStatusesRow = AuditColumns & { id: UUID; name: string }
export type DeploymentStatusesInsert = AuditInsert & Omit<DeploymentStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type DeploymentStatusesUpdate = Partial<DeploymentStatusesInsert>
