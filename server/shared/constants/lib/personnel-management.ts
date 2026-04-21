import type { PersonnelRelationshipReferenceDefinition } from '../../models'

export const PERSONNEL_MODULES = {
  personnelManagement: 'personnel',
} as const

export const PERSONNEL_PERMISSION_GROUPS = {
  personnelManagement: [
    'personnel.view',
    'personnel.create',
    'personnel.update',
    'personnel.delete',
  ],
} as const

export const PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS = [
  {
    key: 'trainingRecords',
    table: 'training_records',
    column: 'personnel_id',
    domain: 'training records',
    relationship: 'personnel participant',
  },
  {
    key: 'deploymentRecords',
    table: 'deployment_records',
    column: 'personnel_id',
    domain: 'deployment records',
    relationship: 'deployed personnel',
  },
  {
    key: 'deploymentSupervisions',
    table: 'deployment_records',
    column: 'supervisor_id',
    domain: 'deployment records',
    relationship: 'deployment supervisor',
  },
  {
    key: 'engagementRecords',
    table: 'engagement_records',
    column: 'personnel_id',
    domain: 'engagement records',
    relationship: 'engaged personnel',
  },
  {
    key: 'assignedEquipmentAssets',
    table: 'equipment_assets',
    column: 'assigned_personnel_id',
    domain: 'equipment assets',
    relationship: 'direct assignee',
  },
  {
    key: 'equipmentIssuancesReceived',
    table: 'equipment_issuances',
    column: 'issued_to_personnel_id',
    domain: 'equipment issuances',
    relationship: 'issuance recipient',
  },
  {
    key: 'equipmentIssuancesIssued',
    table: 'equipment_issuances',
    column: 'issued_by_personnel_id',
    domain: 'equipment issuances',
    relationship: 'issuing personnel',
  },
  {
    key: 'qualificationRecords',
    table: 'personnel_qualifications',
    column: 'personnel_id',
    domain: 'qualification records',
    relationship: 'qualified personnel',
  },
  {
    key: 'medicalReadinessRecords',
    table: 'personnel_medical_readiness',
    column: 'personnel_id',
    domain: 'medical readiness records',
    relationship: 'assessed personnel',
  },
  {
    key: 'weaponAssignments',
    table: 'personnel_weapon_assignments',
    column: 'personnel_id',
    domain: 'weapon assignments',
    relationship: 'assigned personnel',
  },
] as const satisfies readonly PersonnelRelationshipReferenceDefinition[]
