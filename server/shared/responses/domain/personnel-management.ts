import type { PersonnelRelationshipKey } from '../../models'

export interface PersonnelListItemCompact {
  id: string
  personnelCode: string
  serviceNumber: string
  email: string
  fullName: string
  rankName: string
  companyName: string | null
  battalionName: string | null
  serviceStatus: string
}

export interface PersonnelListCompactResponse {
  items: PersonnelListItemCompact[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelDetailResponse {
  id: string
  personnelCode: string
  serviceNumber: string
  email: string
  lastName: string
  firstName: string
  middleName: string | null
  sex: 'Male' | 'Female'
  birthdate: string | null
  rankId: string
  rankCode: string
  rankName: string
  companyId: string | null
  companyCode: string | null
  companyName: string | null
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  employmentStatusId: string
  employmentStatus: string
  serviceStatusId: string
  serviceStatus: string
  contactNumber: string | null
  position: string | null
  dateEnlisted: string | null
  createdAt: string
  updatedAt: string
  age: number | null
}

export interface PersonnelBatchUploadResponse {
  ok: boolean
  insertedCount: number
}

export interface CreatePersonnelResponse {
  ok: boolean
  id: string
  item: PersonnelListItemCompact
}

export interface PersonnelRelationshipCountsResponse {
  breakdown: PersonnelRelationshipBreakdownItem[]
  trainingRecords: number
  deploymentRecords: number
  deploymentSupervisions: number
  engagementRecords: number
  assignedEquipmentAssets: number
  equipmentIssuancesReceived: number
  equipmentIssuancesIssued: number
  qualificationRecords: number
  medicalReadinessRecords: number
  weaponAssignments: number
  totalReferences: number
  hasReferences: boolean
}

export interface PersonnelRelationshipBreakdownItem {
  key: PersonnelRelationshipKey
  table: string
  column: string
  domain: string
  relationship: string
  count: number
  isReferenced: boolean
}

export interface PersonnelTrainingRecordListItem {
  id: string
  title: string
  category: string | null
  status: string
  startDate: string | null
  endDate: string | null
  validUntil: string | null
  remarks: string | null
}

export interface PersonnelTrainingRecordListResponse {
  items: PersonnelTrainingRecordListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelDeploymentRecordListItem {
  id: string
  deploymentArea: string
  operationName: string | null
  location: string | null
  assignmentRole: string | null
  status: string
  startDate: string
  endDate: string | null
}

export interface PersonnelDeploymentRecordListResponse {
  items: PersonnelDeploymentRecordListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelEngagementRecordListItem {
  id: string
  title: string
  type: string
  status: string
  startDate: string | null
  endDate: string | null
  remarks: string | null
}

export interface PersonnelEngagementRecordListResponse {
  items: PersonnelEngagementRecordListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelEquipmentIssuanceListItem {
  id: string
  issueNo: string
  assetTag: string
  equipmentItemName: string
  status: string
  issueDate: string
  expectedReturnDate: string | null
  actualReturnDate: string | null
  issuePurpose: string | null
}

export interface PersonnelEquipmentIssuanceListResponse {
  items: PersonnelEquipmentIssuanceListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelSuggestionItem {
  id: string
  personnelCode: string
  serviceNumber: string
  email: string
  fullName: string
  rankName: string
  companyName: string | null
  battalionName: string | null
  serviceStatus: string
  suggestedEmail: string | null
}

export interface PersonnelSuggestionsResponse {
  items: PersonnelSuggestionItem[]
}
