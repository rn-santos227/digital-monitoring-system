export interface PersonnelListItem {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  sex: 'Male' | 'Female'
  rankName: string
  companyName: string | null
  battalionName: string | null
  employmentStatus: string
  serviceStatus: string
  createdAt: string
  updatedAt: string
}

export interface PersonnelListResponse {
  items: PersonnelListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelCreate {
  personnelCode?: string
  serviceNumber?: string
  lastName?: string
  firstName?: string
  email?: string
  middleName?: string | null
  sex?: 'Male' | 'Female'
  birthdate?: string | null
  rankId?: string
  companyId?: string | null
  battalionId?: string | null
  employmentStatusId?: string
  serviceStatusId?: string
  contactNumber?: string | null
  position?: string | null
  dateEnlisted?: string | null
}

export interface PersonnelUpdate {
  personnelCode?: string
  serviceNumber?: string
  email?: string
  lastName?: string
  firstName?: string
  middleName?: string | null
  sex?: 'Male' | 'Female'
  birthdate?: string | null
  rankId?: string
  companyId?: string | null
  battalionId?: string | null
  employmentStatusId?: string
  serviceStatusId?: string
  contactNumber?: string | null
  position?: string | null
  dateEnlisted?: string | null
}

export interface PersonnelProfileBaseRow {
  id: string
  personnel_code: string
  service_number: string
  email?: string
  full_name?: string
  rank_name: string
  company_name: string | null
  battalion_name: string | null
  service_status: string
}

export interface PersonnelProfileListRow extends PersonnelProfileBaseRow {
  full_name: string
  sex: 'Male' | 'Female'
  employment_status: string
  created_at: string
  updated_at: string
}

export interface PersonnelProfileCompactRow extends PersonnelProfileBaseRow {
  full_name: string
}

export interface PersonnelProfileDetailRow extends PersonnelProfileBaseRow {
  last_name: string
  first_name: string
  middle_name: string | null
  sex: 'Male' | 'Female'
  rank_id: string
  rank_code: string
  company_id: string | null
  company_code: string | null
  battalion_id: string | null
  battalion_code: string | null
  employment_status_id: string
  employment_status: string
  service_status_id: string
  contact_number: string | null
  position: string | null
  birthdate: string | null
  date_enlisted: string | null
  created_at: string
  updated_at: string
}

export type PersonnelRelationshipKey =
  | 'trainingRecords'
  | 'deploymentRecords'
  | 'deploymentSupervisions'
  | 'engagementRecords'
  | 'assignedEquipmentAssets'
  | 'equipmentIssuancesReceived'
  | 'equipmentIssuancesIssued'
  | 'qualificationRecords'
  | 'medicalReadinessRecords'
  | 'weaponAssignments'

export interface PersonnelRelationshipReferenceDefinition {
  key: PersonnelRelationshipKey
  table: string
  column: string
  domain: string
  relationship: string
}

export interface PersonnelRelationshipCount {
  key: PersonnelRelationshipKey
  table: string
  column: string
  domain: string
  relationship: string
  count: number
}

export interface PersonnelLinkedReferenceRow {
  name?: string | null
}

export interface PersonnelTrainingRecordListRow {
  id: string
  training_title: string
  start_date: string | null
  end_date: string | null
  valid_until: string | null
  remarks: string | null
  training_category: PersonnelLinkedReferenceRow | PersonnelLinkedReferenceRow[] | null
  training_status: PersonnelLinkedReferenceRow | PersonnelLinkedReferenceRow[] | null
}

export interface PersonnelDeploymentRecordListRow {
  id: string
  deployment_area: string
  operation_name: string | null
  location: string | null
  assignment_role: string | null
  start_date: string
  end_date: string | null
  deployment_status: PersonnelLinkedReferenceRow | PersonnelLinkedReferenceRow[] | null
}

export interface PersonnelEngagementRecordListRow {
  id: string
  engagement_title: string
  start_date: string | null
  end_date: string | null
  remarks: string | null
  engagement_type: PersonnelLinkedReferenceRow | PersonnelLinkedReferenceRow[] | null
  engagement_status: PersonnelLinkedReferenceRow | PersonnelLinkedReferenceRow[] | null
}

export interface PersonnelEquipmentAssetItemRow {
  name?: string | null
}

export interface PersonnelEquipmentAssetRow {
  asset_tag?: string | null
  equipment_item?: PersonnelEquipmentAssetItemRow | PersonnelEquipmentAssetItemRow[] | null
}


export interface PersonnelEquipmentIssuanceListRow {
  id: string
  issue_no: string
  issue_date: string
  expected_return_date: string | null
  actual_return_date: string | null
  issue_purpose: string | null
  issuance_status: PersonnelLinkedReferenceRow | PersonnelLinkedReferenceRow[] | null
  equipment_asset: PersonnelEquipmentAssetRow | PersonnelEquipmentAssetRow[] | null
}
