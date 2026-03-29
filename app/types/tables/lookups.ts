import type { AuditColumns, AuditInsert, UUID } from './shared'

export type LevelsRow = AuditColumns & { id: UUID; name: string }
export type LevelsInsert = AuditInsert & Omit<LevelsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type LevelsUpdate = Partial<LevelsInsert>

export type TrainingCategoriesRow = AuditColumns & { id: UUID; code: string; name: string }
export type TrainingCategoriesInsert = AuditInsert & Omit<TrainingCategoriesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type TrainingCategoriesUpdate = Partial<TrainingCategoriesInsert>

export type TrainingStatusesRow = AuditColumns & { id: UUID; name: string }
export type TrainingStatusesInsert = AuditInsert & Omit<TrainingStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type TrainingStatusesUpdate = Partial<TrainingStatusesInsert>

export type DeploymentStatusesRow = AuditColumns & { id: UUID; name: string }
export type DeploymentStatusesInsert = AuditInsert & Omit<DeploymentStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type DeploymentStatusesUpdate = Partial<DeploymentStatusesInsert>

export type EngagementTypesRow = AuditColumns & { id: UUID; name: string }
export type EngagementTypesInsert = AuditInsert & Omit<EngagementTypesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EngagementTypesUpdate = Partial<EngagementTypesInsert>

export type EngagementStatusesRow = AuditColumns & { id: UUID; name: string }
export type EngagementStatusesInsert = AuditInsert & Omit<EngagementStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EngagementStatusesUpdate = Partial<EngagementStatusesInsert>

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

export type IncidentTypesRow = AuditColumns & { id: UUID; code: string; name: string }
export type IncidentTypesInsert = AuditInsert & Omit<IncidentTypesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type IncidentTypesUpdate = Partial<IncidentTypesInsert>

export type InvestigationStatusesRow = AuditColumns & { id: UUID; name: string }
export type InvestigationStatusesInsert = AuditInsert & Omit<InvestigationStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type InvestigationStatusesUpdate = Partial<InvestigationStatusesInsert>
