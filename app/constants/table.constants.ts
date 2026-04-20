import type { DataTableAction, DataTableColumn } from '~/constants/ui.constants'

export const AUDIT_TABLE_TITLE = 'Recent Audit Logs'
export const AUDIT_TABLE_SEARCH_PLACEHOLDER = 'Search audit logs'
export const AUDIT_TABLE_EMPTY_MESSAGE = 'No audit log entries found.'

export const AUDIT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'createdAt', label: 'Timestamp', sortable: true },
  { key: 'actor', label: 'Actor', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'tableName', label: 'Entity', sortable: true },
  { key: 'recordId', label: 'Record ID', sortable: true },
  { key: 'ipAddress', label: 'IP Address', sortable: true },
  { key: 'statusCode', label: 'Status Code', sortable: true },
])

export const AUDIT_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view',
    tooltip: 'View audit log',
    iconName: 'eye',
    variant: 'info'
  }
])

export const PERSONNEL_TABLE_TITLE = 'Personnel Records'
export const PERSONNEL_TABLE_EMPTY_MESSAGE = 'No personnel records found.'
export const PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'

export const PERSONNEL_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view-personnel-profile',
    tooltip: 'View personnel profile',
    iconName: 'eye',
    variant: 'info',
  },
])

export const PERSONNEL_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'fullName', label: 'Personnel', sortable: true },
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'serviceNumber', label: 'Service Number', sortable: true },
  { key: 'rankName', label: 'Rank', sortable: true },
  { key: 'assignment', label: 'Assignment', sortable: false },
  { key: 'serviceStatus', label: 'Service Status', sortable: true },
])

export const PERSONNEL_TRAINING_TABLE_TITLE = 'Training Records'
export const PERSONNEL_TRAINING_TABLE_EMPTY_MESSAGE = 'No training records available.'
export const PERSONNEL_TRAINING_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'courseName', label: 'Course', sortable: true },
  { key: 'provider', label: 'Provider', sortable: true },
  { key: 'completedAt', label: 'Completed Date', sortable: true },
  { key: 'remarks', label: 'Remarks', sortable: false },
])

export const PERSONNEL_DEPLOYMENT_TABLE_TITLE = 'Deployment Records'
export const PERSONNEL_DEPLOYMENT_TABLE_EMPTY_MESSAGE = 'No deployment records available.'
export const PERSONNEL_DEPLOYMENT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'location', label: 'Location', sortable: true },
  { key: 'operationName', label: 'Operation', sortable: true },
  { key: 'startedAt', label: 'Start Date', sortable: true },
  { key: 'endedAt', label: 'End Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
])

export const PERSONNEL_ENGAGEMENT_TABLE_TITLE = 'Engagement Records'
export const PERSONNEL_ENGAGEMENT_TABLE_EMPTY_MESSAGE = 'No engagement records available.'
export const PERSONNEL_ENGAGEMENT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'eventType', label: 'Event Type', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'recordedAt', label: 'Recorded Date', sortable: true },
  { key: 'outcome', label: 'Outcome', sortable: true },
])

export const PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_TITLE = 'Equipment Assignments'
export const PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE = 'No equipment assignments available.'
export const PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'assetCode', label: 'Asset Code', sortable: true },
  { key: 'itemName', label: 'Item', sortable: true },
  { key: 'issuedAt', label: 'Issued Date', sortable: true },
  { key: 'returnedAt', label: 'Returned Date', sortable: true },
  { key: 'assignmentStatus', label: 'Assignment Status', sortable: true },
])
