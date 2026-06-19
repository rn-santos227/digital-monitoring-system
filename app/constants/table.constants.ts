import type { DataTableAction, DataTableColumn } from '~/constants/ui.constants'
export const TABLE_PAGE_SIZE_OPTIONS = Object.freeze([10, 25, 50, 100] as const)

export const AUDIT_TABLE_TITLE = 'Recent Audit Logs'
export const AUDIT_TABLE_SEARCH_PLACEHOLDER = 'Search audit logs'
export const AUDIT_TABLE_EMPTY_MESSAGE = 'No audit log entries found.'

export const AUDIT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'createdAt', dataType: 'date', label: 'Timestamp', sortable: true },
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
  {
    key: 'edit-personnel',
    tooltip: 'Edit personnel record',
    iconName: 'pencil-square',
    variant: 'warning',
  },
  {
    key: 'delete-personnel',
    tooltip: 'Delete personnel record',
    iconName: 'trash',
    variant: 'danger',
  },
])

export const PERSONNEL_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'fullName', label: 'Personnel', sortable: true },
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'serviceNumber', label: 'Serial Number', sortable: true },
  { key: 'rankName', label: 'Rank', sortable: true },
  { key: 'assignment', label: 'Assignment', sortable: false },
  { key: 'serviceStatus', label: 'Service Status', sortable: true },
])

export const RANK_TABLE_EMPTY_MESSAGE = 'No rank records found.'
export const RANK_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'sortOrder', label: 'Sort Order', sortable: true },
])

export const RANK_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'delete-rank',
    tooltip: 'Delete rank',
    iconName: 'trash',
    variant: 'danger',
  },
])

export const SERVICE_STATUS_PERSONNEL_TABLE_SEARCH_PLACEHOLDER = 'Search personnel by name, operation, area, or code'
export const SERVICE_STATUS_PERSONNEL_TABLE_EMPTY_MESSAGE = 'No personnel location records found.'
export const SERVICE_STATUS_PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const SERVICE_STATUS_PERSONNEL_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view-personnel',
    tooltip: 'View personnel profile',
    iconName: 'eye',
    variant: 'info',
  },
  {
    key: 'assign-deployment',
    tooltip: 'Assign deployment',
    iconName: 'map',
    variant: 'success',
  },
  {
    key: 'assign-engagement',
    tooltip: 'Assign engagement',
    iconName: 'shield-exclamation',
    variant: 'success',
  },
  {
    key: 'assign-training',
    tooltip: 'Assign training',
    iconName: 'academic-cap',
    variant: 'success',
  },
])
export const SERVICE_STATUS_PERSONNEL_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'personnelName', label: 'Personnel', sortable: false },
  { key: 'operationName', label: 'Operation', sortable: false },
  { key: 'deploymentArea', label: 'Area', sortable: false },
  { key: 'coordinates', label: 'Coordinates', sortable: false },
])

export const PERSONNEL_TRAINING_TABLE_TITLE = 'Training Records'
export const PERSONNEL_TRAINING_TABLE_EMPTY_MESSAGE = 'No training records available.'
export const PERSONNEL_TRAINING_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'courseName', label: 'Course', sortable: true },
  { key: 'provider', label: 'Provider', sortable: true },
  { key: 'completedAt', dataType: 'date', label: 'Completed Date', sortable: true },
  { key: 'remarks', label: 'Remarks', sortable: false },
])

export const PERSONNEL_DEPLOYMENT_TABLE_TITLE = 'Deployment Records'
export const PERSONNEL_DEPLOYMENT_TABLE_EMPTY_MESSAGE = 'No deployment records available.'
export const PERSONNEL_DEPLOYMENT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'location', label: 'Location', sortable: true },
  { key: 'operationName', label: 'Operation', sortable: true },
  { key: 'startedAt', dataType: 'date', label: 'Start Date', sortable: true },
  { key: 'endedAt', dataType: 'date', label: 'End Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
])

export const PERSONNEL_ENGAGEMENT_TABLE_TITLE = 'Engagement Records'
export const PERSONNEL_ENGAGEMENT_TABLE_EMPTY_MESSAGE = 'No engagement records available.'
export const PERSONNEL_ENGAGEMENT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'eventType', label: 'Event Type', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'recordedAt', dataType: 'date', label: 'Recorded Date', sortable: true },
  { key: 'outcome', label: 'Outcome', sortable: true },
])

export const PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_TITLE = 'Equipment Assignments'
export const PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE = 'No equipment assignments available.'
export const PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'assetCode', label: 'Asset Code', sortable: true },
  { key: 'itemName', label: 'Item', sortable: true },
  { key: 'issuedAt', dataType: 'date', label: 'Issued Date', sortable: true },
  { key: 'returnedAt', dataType: 'date', label: 'Returned Date', sortable: true },
  { key: 'assignmentStatus', label: 'Assignment Status', sortable: true },
])

export const USERS_PROFILE_TABLE_TITLE = 'User Profiles'
export const USERS_ACCOUNT_TABLE_TITLE = 'User Accounts'
export const USERS_PROFILE_TABLE_EMPTY_MESSAGE = 'No user profile records found.'
export const USERS_ACCOUNT_TABLE_EMPTY_MESSAGE = 'No user account records found.'
export const USERS_PROFILE_TABLE_SEARCH_PLACEHOLDER = 'Search user profiles'
export const USERS_ACCOUNT_TABLE_SEARCH_PLACEHOLDER = 'Search user accounts'
export const USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'

export const USERS_PROFILE_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'fullName', label: 'Full Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'accountTypes', label: 'Account Types', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastLoginAt', dataType: 'date', label: 'Last Login', sortable: true },
])

export const USERS_PROFILE_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view-user-profile',
    tooltip: 'View user profile',
    iconName: 'eye',
    variant: 'info',
  },
  {
    key: 'edit-user-profile',
    tooltip: 'Edit user profile',
    iconName: 'pencil-square',
    variant: 'warning',
  },
  {
    key: 'change-user-password',
    tooltip: 'Change password',
    iconName: 'cog',
    variant: 'warning',
  },
  {
    key: 'toggle-user-activation',
    tooltip: 'Activate or deactivate user',
    iconName: 'arrow-path',
    variant: 'warning',
  },
  {
    key: 'delete-user-profile',
    tooltip: 'Delete user profile',
    iconName: 'trash',
    variant: 'danger',
  },
])

export const USERS_ACCOUNT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'systemType', label: 'Type', sortable: true },
])

export const USERS_ACCOUNT_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'edit-account-type',
    tooltip: 'Edit account type',
    iconName: 'pencil-square',
    variant: 'warning',
  },
  {
    key: 'delete-account-type',
    tooltip: 'Delete account type',
    iconName: 'trash',
    variant: 'danger',
  },
])

export const BATTALIONS_TABLE_TITLE = 'Battalions'
export const BATTALIONS_TABLE_EMPTY_MESSAGE = 'No battalion records found.'
export const BATTALIONS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'companyCount', label: 'Companies', sortable: true },
])

export const BATTALIONS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const BATTALIONS_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view-battalion',
    tooltip: 'View battalion',
    iconName: 'eye',
    variant: 'info',
  },
  {
    key: 'assign-battalion',
    tooltip: 'Assign personnel',
    iconName: 'user-plus',
    variant: 'info',
  },
  {
    key: 'edit-battalion',
    tooltip: 'Edit battalion',
    iconName: 'pencil-square',
    variant: 'warning',
  },
  {
    key: 'delete-battalion',
    tooltip: 'Delete battalion',
    iconName: 'trash',
    variant: 'danger',
  },
])

export const COMPANIES_TABLE_TITLE = 'Companies'
export const COMPANIES_TABLE_EMPTY_MESSAGE = 'No company records found.'

export const COMPANIES_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const COMPANIES_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view-company',
    tooltip: 'View company',
    iconName: 'eye',
    variant: 'info',
  },
  {
    key: 'assign-company',
    tooltip: 'Assign personnel',
    iconName: 'user-plus',
    variant: 'info',
  },
  {
    key: 'edit-company',
    tooltip: 'Edit company',
    iconName: 'pencil-square',
    variant: 'warning',
  },
  {
    key: 'delete-company',
    tooltip: 'Delete company',
    iconName: 'trash',
    variant: 'danger',
  },
])

export const COMPANIES_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'battalion', label: 'Battalion', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
])

export const UNITS_PERSONNEL_TABLE_TITLE = 'Assigned Personnel'
export const UNITS_PERSONNEL_TABLE_EMPTY_MESSAGE = 'No personnel records found.'
export const UNITS_PERSONNEL_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'serviceNumber', label: 'Serial Number', sortable: true },
  { key: 'fullName', label: 'Name', sortable: true },
  { key: 'rankName', label: 'Rank', sortable: true },
  { key: 'serviceStatus', label: 'Service Status', sortable: true },
])

export const ENGAGEMENT_PERSONNEL_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'serviceNumber', label: 'Serial Number', sortable: true },
  { key: 'fullName', label: 'Name', sortable: true },
  { key: 'rankName', label: 'Rank', sortable: true },
  { key: 'serviceStatus', label: 'Service Status', sortable: true },
])

export const UNITS_EQUIPMENT_ASSIGNMENT_TABLE_TITLE = 'Equipment Assets'
export const UNITS_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE = 'No equipment assignments found.'
export const UNITS_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'assetTag', label: 'Asset Tag', sortable: true },
  { key: 'equipmentCode', label: 'Equipment Code', sortable: true },
  { key: 'itemName', label: 'Equipment Item', sortable: true },
  { key: 'assignedPersonnel', label: 'Assigned Personnel', sortable: false },
  { key: 'assetStatus', label: 'Asset Status', sortable: true },
])

export const UNITS_COMPANIES_TABLE_TITLE = 'Attached Companies'
export const UNITS_COMPANIES_TABLE_EMPTY_MESSAGE = 'No company records found.'
export const UNITS_COMPANIES_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
])

export const TRAINING_RECORDS_TABLE_TITLE = 'Training Records'
export const TRAINING_RECORDS_TABLE_EMPTY_MESSAGE = 'No training records found.'
export const TRAINING_RECORDS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const TRAINING_RECORDS_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-training-record', tooltip: 'View training record', iconName: 'eye', variant: 'info' },
  { key: 'edit-training-record', tooltip: 'Update training record', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-training-record', tooltip: 'Delete training record', iconName: 'trash', variant: 'danger' },
])

export const TRAINING_RECORDS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'recordNo', label: 'Record No.', sortable: true },
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'personnelName', label: 'Personnel', sortable: true },
  { key: 'trainingTitle', label: 'Training', sortable: true },
  { key: 'trainingCategoryName', label: 'Category', sortable: true },
  { key: 'statusName', label: 'Status', sortable: true },
  { key: 'certificateNo', label: 'Certificate No.', sortable: true },
  { key: 'validUntil', label: 'Valid Until', sortable: true },
])

export const TRAININGS_TABLE_TITLE = 'Trainings'
export const TRAININGS_TABLE_EMPTY_MESSAGE = 'No training records found.'
export const TRAININGS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const TRAININGS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'trainingTitle', label: 'Training', sortable: true },
  { key: 'trainingCategoryName', label: 'Category', sortable: true },
  { key: 'levelName', label: 'Level', sortable: true },
  { key: 'statusName', label: 'Status', sortable: true },
  { key: 'startDate', dataType: 'date', label: 'Start Date', sortable: true },
  { key: 'endDate', dataType: 'date', label: 'End Date', sortable: true },
])
export const TRAININGS_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-training', tooltip: 'View training', iconName: 'eye', variant: 'info' },
  { key: 'edit-training', tooltip: 'Update training', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-training', tooltip: 'Delete training', iconName: 'trash', variant: 'danger' },
])

export const TRAINING_CATEGORIES_TABLE_TITLE = 'Training Categories'
export const TRAINING_CATEGORIES_TABLE_EMPTY_MESSAGE = 'No training categories found.'
export const TRAINING_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const TRAINING_CATEGORIES_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'updatedAt', dataType: 'date', label: 'Updated At', sortable: true },
])
export const TRAINING_CATEGORIES_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'edit-training-category', tooltip: 'Update training category', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-training-category', tooltip: 'Delete training category', iconName: 'trash', variant: 'danger' },
])

export const TRAINING_PERSONNEL_TABLE_TITLE = 'Assigned Personnel'
export const TRAINING_PERSONNEL_TABLE_EMPTY_MESSAGE = 'No personnel are assigned to this training.'
export const TRAINING_PERSONNEL_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'personnelName', label: 'Personnel', sortable: true },
  { key: 'recordNo', label: 'Training Record No.', sortable: true },
  { key: 'certificateNo', label: 'Certificate No.', sortable: true },
  { key: 'remarks', label: 'Remarks', sortable: false },
])

export const DEPLOYMENTS_TABLE_TITLE = 'Deployments'
export const DEPLOYMENTS_TABLE_EMPTY_MESSAGE = 'No deployment records found.'
export const DEPLOYMENTS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const DEPLOYMENTS_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-deployment', tooltip: 'View deployment', iconName: 'eye', variant: 'info' },
  { key: 'edit-deployment-details', tooltip: 'Update deployment details', iconName: 'pencil-square', variant: 'warning' },
  { key: 'edit-deployment-location', tooltip: 'Update deployment location', iconName: 'map-pin', variant: 'warning' },
  { key: 'delete-deployment', tooltip: 'Delete deployment', iconName: 'trash', variant: 'danger' },
])
export const DEPLOYMENTS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'operationName', label: 'Operation', sortable: true },
  { key: 'deploymentArea', label: 'Deployment Area', sortable: true },
  { key: 'startDate', dataType: 'date', label: 'Start Date', sortable: true },
  { key: 'endDate', dataType: 'date', label: 'End Date', sortable: true },
  { key: 'statusName', label: 'Status', sortable: true },
])

export const DEPLOYMENT_RECORDS_TABLE_TITLE = 'Deployment Records'
export const DEPLOYMENT_RECORDS_TABLE_EMPTY_MESSAGE = 'No deployment records found.'
export const DEPLOYMENT_RECORDS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'recordNo', label: 'Record No.', sortable: true },
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'personnelName', label: 'Personnel', sortable: true },
  { key: 'operationName', label: 'Operation', sortable: true },
  { key: 'deploymentArea', label: 'Deployment Area', sortable: true },
  { key: 'assignmentRole', label: 'Assignment Role', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'startDate', dataType: 'date', label: 'Start Date', sortable: true },
  { key: 'endDate', dataType: 'date', label: 'End Date', sortable: true },
  { key: 'statusName', label: 'Status', sortable: true },
])

export const DEPLOYMENT_PERSONNEL_TABLE_TITLE = 'Assigned Personnel'
export const DEPLOYMENT_PERSONNEL_TABLE_EMPTY_MESSAGE = 'No personnel are assigned to this deployment.'
export const DEPLOYMENT_PERSONNEL_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'fullName', label: 'Personnel', sortable: true },
  { key: 'rankName', label: 'Rank', sortable: true },
  { key: 'serviceStatus', label: 'Service Status', sortable: true },
])

export const ENGAGEMENTS_TABLE_TITLE = 'Engagements'
export const ENGAGEMENTS_TABLE_EMPTY_MESSAGE = 'No engagements found.'
export const ENGAGEMENTS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const ENGAGEMENTS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'engagementTitle', label: 'Engagement Title', sortable: true },
  { key: 'engagementCategoryName', label: 'Category', sortable: true },
  { key: 'levelName', label: 'Level', sortable: true },
  { key: 'statusName', label: 'Status', sortable: true },
  { key: 'startDate', dataType: 'date', label: 'Start Date', sortable: true },
  { key: 'endDate', dataType: 'date', label: 'End Date', sortable: true },
])

export const ENGAGEMENT_RECORDS_TABLE_TITLE = 'Engagement Records'
export const ENGAGEMENT_RECORDS_TABLE_EMPTY_MESSAGE = 'No engagement records found.'
export const ENGAGEMENT_RECORDS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const ENGAGEMENT_RECORDS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'recordNo', label: 'Record No', sortable: true },
  { key: 'personnelName', label: 'Personnel', sortable: true },
  { key: 'engagementTitle', label: 'Engagement Title', sortable: true },
  { key: 'engagementCategoryName', label: 'Category', sortable: true },
  { key: 'levelName', label: 'Level', sortable: true },
  { key: 'statusName', label: 'Status', sortable: true },
  { key: 'startDate', dataType: 'date', label: 'Start Date', sortable: true },
  { key: 'endDate', dataType: 'date', label: 'End Date', sortable: true },
])

export const SERVICE_STATUS_PERSONNEL_TABLE_TITLE = 'Personnel Location Feed'
export const SERVICE_STATUS_PERSONNEL_TABLE_SUBTITLE = 'Read-only feed from personnel deployment coordinates.'
export const SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_PERSONNEL = 'Personnel'
export const SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_OPERATION = 'Operation'
export const SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_AREA = 'Area'
export const SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_COORDINATES = 'Coordinates'
export const SERVICE_STATUS_PERSONNEL_TABLE_NO_COORDINATES = 'No coordinates'
export const SERVICE_STATUS_PERSONNEL_TABLE_UNNAMED_PERSONNEL = 'Unnamed Personnel'
export const SERVICE_STATUS_PERSONNEL_TABLE_UNSPECIFIED_OPERATION = 'Unspecified'

export const EQUIPMENT_CATEGORIES_TABLE_TITLE = 'Equipment Categories'
export const EQUIPMENT_CATEGORIES_TABLE_EMPTY_MESSAGE = 'No equipment category records found.'
export const EQUIPMENT_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const EQUIPMENT_CATEGORIES_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'itemCount', label: 'Equipment Items', sortable: true },
])
export const EQUIPMENT_CATEGORIES_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-equipment-category', tooltip: 'View equipment category', iconName: 'eye', variant: 'info' },
  { key: 'edit-equipment-category', tooltip: 'Edit equipment category', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-equipment-category', tooltip: 'Delete equipment category', iconName: 'trash', variant: 'danger' },
])

export const EQUIPMENT_ITEMS_TABLE_TITLE = 'Equipment Items'
export const EQUIPMENT_ITEMS_TABLE_EMPTY_MESSAGE = 'No equipment item records found.'
export const EQUIPMENT_ITEMS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const EQUIPMENT_ITEMS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'equipmentCode', label: 'Equipment Code', sortable: true },
  { key: 'name', label: 'Item Name', sortable: true },
  { key: 'categoryName', label: 'Category', sortable: true },
  { key: 'model', label: 'Model', sortable: true },
  { key: 'manufacturer', label: 'Manufacturer', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
])
export const EQUIPMENT_ITEMS_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-equipment-item', tooltip: 'View equipment item', iconName: 'eye', variant: 'info' },
  { key: 'edit-equipment-item', tooltip: 'Edit equipment item', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-equipment-item', tooltip: 'Delete equipment item', iconName: 'trash', variant: 'danger' },
])

export const EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_TITLE = 'Personnel Usage'
export const EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_EMPTY_MESSAGE = 'No personnel usage records found for this equipment item.'
export const EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'issueNo', label: 'Issue No.', sortable: true },
  { key: 'personnelCode', label: 'Personnel Code', sortable: true },
  { key: 'fullName', label: 'Personnel', sortable: true },
  { key: 'rankName', label: 'Rank', sortable: true },
  { key: 'companyName', label: 'Company', sortable: true },
  { key: 'battalionName', label: 'Battalion', sortable: true },
  { key: 'issueDate', dataType: 'date', label: 'Issue Date', sortable: true },
  { key: 'issuanceStatus', label: 'Status', sortable: true },
])

export const EQUIPMENT_ITEM_COMPANIES_USAGE_TABLE_TITLE = 'Companies'
export const EQUIPMENT_ITEM_COMPANIES_USAGE_TABLE_EMPTY_MESSAGE = 'No company usage records found for this equipment item.'
export const EQUIPMENT_ITEM_COMPANIES_USAGE_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Company Code', sortable: true },
  { key: 'name', label: 'Company', sortable: true },
  { key: 'battalionName', label: 'Battalion', sortable: true },
  { key: 'personnelCount', label: 'Personnel', sortable: true },
  { key: 'issuanceCount', label: 'Issuances', sortable: true },
  { key: 'latestIssueDate', dataType: 'date', label: 'Latest Issue', sortable: true },
])

export const EQUIPMENT_ITEM_BATTALIONS_USAGE_TABLE_TITLE = 'Battalions'
export const EQUIPMENT_ITEM_BATTALIONS_USAGE_TABLE_EMPTY_MESSAGE = 'No battalion usage records found for this equipment item.'
export const EQUIPMENT_ITEM_BATTALIONS_USAGE_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'code', label: 'Battalion Code', sortable: true },
  { key: 'name', label: 'Battalion', sortable: true },
  { key: 'personnelCount', label: 'Personnel', sortable: true },
  { key: 'issuanceCount', label: 'Issuances', sortable: true },
  { key: 'latestIssueDate', dataType: 'date', label: 'Latest Issue', sortable: true },
])

export const EQUIPMENT_ASSETS_TABLE_TITLE = 'Equipment Assets'
export const EQUIPMENT_ASSETS_TABLE_EMPTY_MESSAGE = 'No equipment asset records found.'
export const EQUIPMENT_ASSETS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const EQUIPMENT_ASSETS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'assetTag', label: 'Asset Tag', sortable: true },
  { key: 'equipmentItemCode', label: 'Equipment Code', sortable: true },
  { key: 'equipmentItemName', label: 'Equipment Item', sortable: true },
  { key: 'serialNo', label: 'Serial Number', sortable: true },
  { key: 'currentLocation', label: 'Current Location', sortable: true },
  { key: 'serviceabilityStatusName', label: 'Serviceability', sortable: true },
  { key: 'assetStatusName', label: 'Asset Status', sortable: true },
])
export const EQUIPMENT_ASSETS_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-equipment-asset', tooltip: 'View equipment asset', iconName: 'eye', variant: 'info' },
  { key: 'edit-equipment-asset', tooltip: 'Edit equipment asset', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-equipment-asset', tooltip: 'Delete equipment asset', iconName: 'trash', variant: 'danger' },
])

export const EQUIPMENT_ISSUANCES_TABLE_TITLE = 'Equipment Issuances'
export const EQUIPMENT_ISSUANCES_TABLE_EMPTY_MESSAGE = 'No equipment issuance records found.'
export const EQUIPMENT_ISSUANCES_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const EQUIPMENT_ISSUANCES_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'issueNo', label: 'Issue No.', sortable: true },
  { key: 'equipmentAssetTag', label: 'Asset Tag', sortable: true },
  { key: 'equipmentItemName', label: 'Equipment Item', sortable: true },
  { key: 'issuedToPersonnelName', label: 'Issued To', sortable: true },
  { key: 'issueDate', dataType: 'date', label: 'Issue Date', sortable: true },
  { key: 'expectedReturnDate', dataType: 'date', label: 'Expected Return', sortable: true },
  { key: 'actualReturnDate', dataType: 'date', label: 'Actual Return', sortable: true },
  { key: 'statusName', label: 'Status', sortable: true },
])
export const EQUIPMENT_ISSUANCES_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-equipment-issuance', tooltip: 'View equipment issuance', iconName: 'eye', variant: 'info' },
  { key: 'edit-equipment-issuance', tooltip: 'Edit equipment issuance', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-equipment-issuance', tooltip: 'Delete equipment issuance', iconName: 'trash', variant: 'danger' },
])

export const EQUIPMENT_INCIDENTS_TABLE_TITLE = 'Equipment Incidents'
export const EQUIPMENT_INCIDENTS_TABLE_EMPTY_MESSAGE = 'No equipment incident records found.'
export const EQUIPMENT_INCIDENTS_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const EQUIPMENT_INCIDENTS_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'incidentNo', label: 'Incident No.', sortable: true },
  { key: 'assetTag', label: 'Asset Tag', sortable: true },
  { key: 'equipmentName', label: 'Equipment Item', sortable: true },
  { key: 'incidentTypeName', label: 'Incident Type', sortable: true },
  { key: 'incidentDate', dataType: 'date', label: 'Incident Date', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'investigationStatusName', label: 'Investigation Status', sortable: true },
])
