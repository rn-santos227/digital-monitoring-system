export type { ISODate, ISODateTime, TableShape, UUID } from './tables/shared'

export type {
  CompaniesInsert,
  CompaniesRow,
  CompaniesUpdate,
  EmploymentStatusesInsert,
  EmploymentStatusesRow,
  EmploymentStatusesUpdate,
  BattalionsInsert,
  BattalionsRow,
  BattalionsUpdate,
  PersonnelInsert,
  PersonnelRow,
  PersonnelUpdate,
  RanksInsert,
  RanksRow,
  RanksUpdate,
  ServiceStatusesInsert,
  ServiceStatusesRow,
  ServiceStatusesUpdate,
} from './tables/master'

export type {
  AssetStatusesInsert,
  AssetStatusesRow,
  AssetStatusesUpdate,
  ConditionStatusesInsert,
  ConditionStatusesRow,
  ConditionStatusesUpdate,
  DeploymentStatusesInsert,
  DeploymentStatusesRow,
  DeploymentStatusesUpdate,
  EngagementStatusesInsert,
  EngagementStatusesRow,
  EngagementStatusesUpdate,
  EngagementTypesInsert,
  EngagementTypesRow,
  EngagementTypesUpdate,
  IncidentTypesInsert,
  IncidentTypesRow,
  IncidentTypesUpdate,
  InvestigationStatusesInsert,
  InvestigationStatusesRow,
  InvestigationStatusesUpdate,
  IssuanceStatusesInsert,
  IssuanceStatusesRow,
  IssuanceStatusesUpdate,
  LevelsInsert,
  LevelsRow,
  LevelsUpdate,
  MaintenanceTypesInsert,
  MaintenanceTypesRow,
  MaintenanceTypesUpdate,
  ServiceabilityStatusesInsert,
  ServiceabilityStatusesRow,
  ServiceabilityStatusesUpdate,
  TrainingCategoriesInsert,
  TrainingCategoriesRow,
  TrainingCategoriesUpdate,
  TrainingStatusesInsert,
  TrainingStatusesRow,
  TrainingStatusesUpdate,
} from './tables/lookups'

export type {
  DeploymentRecordsInsert,
  DeploymentRecordsRow,
  DeploymentRecordsUpdate,
  EngagementRecordsInsert,
  EngagementRecordsRow,
  EngagementRecordsUpdate,
  EquipmentAssetsInsert,
  EquipmentAssetsRow,
  EquipmentAssetsUpdate,
  EquipmentCategoriesInsert,
  EquipmentCategoriesRow,
  EquipmentCategoriesUpdate,
  EquipmentIncidentsInsert,
  EquipmentIncidentsRow,
  EquipmentIncidentsUpdate,
  EquipmentIssuancesInsert,
  EquipmentIssuancesRow,
  EquipmentIssuancesUpdate,
  EquipmentItemsInsert,
  EquipmentItemsRow,
  EquipmentItemsUpdate,
  EquipmentMaintenanceRecordsInsert,
  EquipmentMaintenanceRecordsRow,
  EquipmentMaintenanceRecordsUpdate,
  PersonnelMedicalReadinessInsert,
  PersonnelMedicalReadinessRow,
  PersonnelMedicalReadinessUpdate,
  PersonnelQualificationsInsert,
  PersonnelQualificationsRow,
  PersonnelQualificationsUpdate,
  PersonnelWeaponAssignmentsInsert,
  PersonnelWeaponAssignmentsRow,
  PersonnelWeaponAssignmentsUpdate,
  TrainingRecordsInsert,
  TrainingRecordsRow,
  TrainingRecordsUpdate,
} from './tables/domains'

import type { TableShape } from './tables/shared'
import type {
  CompaniesInsert,
  CompaniesRow,
  CompaniesUpdate,
  EmploymentStatusesInsert,
  EmploymentStatusesRow,
  EmploymentStatusesUpdate,
  PersonnelInsert,
  PersonnelRow,
  PersonnelUpdate,
  BattalionsInsert,
  BattalionsRow,
  BattalionsUpdate,
  RanksInsert,
  RanksRow,
  RanksUpdate,
  ServiceStatusesInsert,
  ServiceStatusesRow,
  ServiceStatusesUpdate,
} from './tables/master'
import type {
  AssetStatusesInsert,
  AssetStatusesRow,
  AssetStatusesUpdate,
  ConditionStatusesInsert,
  ConditionStatusesRow,
  ConditionStatusesUpdate,
  DeploymentStatusesInsert,
  DeploymentStatusesRow,
  DeploymentStatusesUpdate,
  EngagementStatusesInsert,
  EngagementStatusesRow,
  EngagementStatusesUpdate,
  EngagementTypesInsert,
  EngagementTypesRow,
  EngagementTypesUpdate,
  IncidentTypesInsert,
  IncidentTypesRow,
  IncidentTypesUpdate,
  InvestigationStatusesInsert,
  InvestigationStatusesRow,
  InvestigationStatusesUpdate,
  IssuanceStatusesInsert,
  IssuanceStatusesRow,
  IssuanceStatusesUpdate,
  LevelsInsert,
  LevelsRow,
  LevelsUpdate,
  MaintenanceTypesInsert,
  MaintenanceTypesRow,
  MaintenanceTypesUpdate,
  ServiceabilityStatusesInsert,
  ServiceabilityStatusesRow,
  ServiceabilityStatusesUpdate,
  TrainingCategoriesInsert,
  TrainingCategoriesRow,
  TrainingCategoriesUpdate,
  TrainingStatusesInsert,
  TrainingStatusesRow,
  TrainingStatusesUpdate,
} from './tables/lookups'
import type {
  DeploymentRecordsInsert,
  DeploymentRecordsRow,
  DeploymentRecordsUpdate,
  EngagementRecordsInsert,
  EngagementRecordsRow,
  EngagementRecordsUpdate,
  EquipmentAssetsInsert,
  EquipmentAssetsRow,
  EquipmentAssetsUpdate,
  EquipmentCategoriesInsert,
  EquipmentCategoriesRow,
  EquipmentCategoriesUpdate,
  EquipmentIncidentsInsert,
  EquipmentIncidentsRow,
  EquipmentIncidentsUpdate,
  EquipmentIssuancesInsert,
  EquipmentIssuancesRow,
  EquipmentIssuancesUpdate,
  EquipmentItemsInsert,
  EquipmentItemsRow,
  EquipmentItemsUpdate,
  EquipmentMaintenanceRecordsInsert,
  EquipmentMaintenanceRecordsRow,
  EquipmentMaintenanceRecordsUpdate,
  PersonnelMedicalReadinessInsert,
  PersonnelMedicalReadinessRow,
  PersonnelMedicalReadinessUpdate,
  PersonnelQualificationsInsert,
  PersonnelQualificationsRow,
  PersonnelQualificationsUpdate,
  PersonnelWeaponAssignmentsInsert,
  PersonnelWeaponAssignmentsRow,
  PersonnelWeaponAssignmentsUpdate,
  TrainingRecordsInsert,
  TrainingRecordsRow,
  TrainingRecordsUpdate,
} from './tables/domains'

export interface DatabaseTables {
  ranks: TableShape<RanksRow, RanksInsert, RanksUpdate>
  companies: TableShape<CompaniesRow, CompaniesInsert, CompaniesUpdate>
  battalions: TableShape<BattalionsRow, BattalionsInsert, BattalionsUpdate>
  employment_statuses: TableShape<EmploymentStatusesRow, EmploymentStatusesInsert, EmploymentStatusesUpdate>
  service_statuses: TableShape<ServiceStatusesRow, ServiceStatusesInsert, ServiceStatusesUpdate>
  personnel: TableShape<PersonnelRow, PersonnelInsert, PersonnelUpdate>
  levels: TableShape<LevelsRow, LevelsInsert, LevelsUpdate>
  training_categories: TableShape<TrainingCategoriesRow, TrainingCategoriesInsert, TrainingCategoriesUpdate>
  training_statuses: TableShape<TrainingStatusesRow, TrainingStatusesInsert, TrainingStatusesUpdate>
  deployment_statuses: TableShape<DeploymentStatusesRow, DeploymentStatusesInsert, DeploymentStatusesUpdate>
  engagement_types: TableShape<EngagementTypesRow, EngagementTypesInsert, EngagementTypesUpdate>
  engagement_statuses: TableShape<EngagementStatusesRow, EngagementStatusesInsert, EngagementStatusesUpdate>
  condition_statuses: TableShape<ConditionStatusesRow, ConditionStatusesInsert, ConditionStatusesUpdate>
  serviceability_statuses: TableShape<ServiceabilityStatusesRow, ServiceabilityStatusesInsert, ServiceabilityStatusesUpdate>
  asset_statuses: TableShape<AssetStatusesRow, AssetStatusesInsert, AssetStatusesUpdate>
  issuance_statuses: TableShape<IssuanceStatusesRow, IssuanceStatusesInsert, IssuanceStatusesUpdate>
  maintenance_types: TableShape<MaintenanceTypesRow, MaintenanceTypesInsert, MaintenanceTypesUpdate>
  incident_types: TableShape<IncidentTypesRow, IncidentTypesInsert, IncidentTypesUpdate>
  investigation_statuses: TableShape<InvestigationStatusesRow, InvestigationStatusesInsert, InvestigationStatusesUpdate>
  training_records: TableShape<TrainingRecordsRow, TrainingRecordsInsert, TrainingRecordsUpdate>
  deployment_records: TableShape<DeploymentRecordsRow, DeploymentRecordsInsert, DeploymentRecordsUpdate>
  engagement_records: TableShape<EngagementRecordsRow, EngagementRecordsInsert, EngagementRecordsUpdate>
  equipment_categories: TableShape<EquipmentCategoriesRow, EquipmentCategoriesInsert, EquipmentCategoriesUpdate>
  equipment_items: TableShape<EquipmentItemsRow, EquipmentItemsInsert, EquipmentItemsUpdate>
  equipment_assets: TableShape<EquipmentAssetsRow, EquipmentAssetsInsert, EquipmentAssetsUpdate>
  equipment_issuances: TableShape<EquipmentIssuancesRow, EquipmentIssuancesInsert, EquipmentIssuancesUpdate>
  equipment_maintenance_records: TableShape<EquipmentMaintenanceRecordsRow, EquipmentMaintenanceRecordsInsert, EquipmentMaintenanceRecordsUpdate>
  equipment_incidents: TableShape<EquipmentIncidentsRow, EquipmentIncidentsInsert, EquipmentIncidentsUpdate>
  personnel_qualifications: TableShape<PersonnelQualificationsRow, PersonnelQualificationsInsert, PersonnelQualificationsUpdate>
  personnel_medical_readiness: TableShape<PersonnelMedicalReadinessRow, PersonnelMedicalReadinessInsert, PersonnelMedicalReadinessUpdate>
  personnel_weapon_assignments: TableShape<PersonnelWeaponAssignmentsRow, PersonnelWeaponAssignmentsInsert, PersonnelWeaponAssignmentsUpdate>
}
