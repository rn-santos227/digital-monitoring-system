import type {
  PersonnelMedicalReadinessInsert,
  PersonnelMedicalReadinessRow,
  PersonnelMedicalReadinessUpdate,
  PersonnelQualificationsInsert,
  PersonnelQualificationsRow,
  PersonnelQualificationsUpdate,
  PersonnelWeaponAssignmentsInsert,
  PersonnelWeaponAssignmentsRow,
  PersonnelWeaponAssignmentsUpdate,
  UUID,
} from '../database.tables'

export type PersonnelQualificationCreateInput = PersonnelQualificationsInsert
export type PersonnelQualificationUpdateInput = PersonnelQualificationsUpdate

export type PersonnelMedicalReadinessCreateInput = PersonnelMedicalReadinessInsert
export type PersonnelMedicalReadinessUpdateInput = PersonnelMedicalReadinessUpdate

export type PersonnelWeaponAssignmentCreateInput = PersonnelWeaponAssignmentsInsert
export type PersonnelWeaponAssignmentUpdateInput = PersonnelWeaponAssignmentsUpdate

export interface PersonnelQualificationSummary extends PersonnelQualificationsRow {
  personnel_code: string
  full_name: string
}

export interface PersonnelMedicalReadinessSummary extends PersonnelMedicalReadinessRow {
  personnel_code: string
  full_name: string
}

export interface PersonnelWeaponAssignmentSummary extends PersonnelWeaponAssignmentsRow {
  personnel_code: string
  full_name: string
  asset_tag: string
  equipment_name: string
}

export interface ReadinessFilters {
  personnel_id?: UUID
  fit_for_deployment?: boolean
}
