import type { AuditColumns, AuditInsert, UUID } from '../shared'

export type ConditionStatusesRow = AuditColumns & { id: UUID; name: string }
export type ConditionStatusesInsert = AuditInsert & Omit<ConditionStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type ConditionStatusesUpdate = Partial<ConditionStatusesInsert>

export type ServiceabilityStatusesRow = AuditColumns & { id: UUID; name: string }
export type ServiceabilityStatusesInsert = AuditInsert & Omit<ServiceabilityStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type ServiceabilityStatusesUpdate = Partial<ServiceabilityStatusesInsert>

export type AssetStatusesRow = AuditColumns & { id: UUID; name: string }
export type AssetStatusesInsert = AuditInsert & Omit<AssetStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type AssetStatusesUpdate = Partial<AssetStatusesInsert>

export type IssuanceStatusesRow = AuditColumns & { id: UUID; name: string }
export type IssuanceStatusesInsert = AuditInsert & Omit<IssuanceStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type IssuanceStatusesUpdate = Partial<IssuanceStatusesInsert>

export type MaintenanceTypesRow = AuditColumns & { id: UUID; name: string }
export type MaintenanceTypesInsert = AuditInsert & Omit<MaintenanceTypesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type MaintenanceTypesUpdate = Partial<MaintenanceTypesInsert>
