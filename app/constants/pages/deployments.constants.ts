import type { BaseTabItem } from '~/constants/ui.constants'
import { DEPLOYMENT_STATUS_VALUES } from '~/types/enums'

export const DEPLOYMENTS_PAGE_TITLE = 'Deployments Management'
export const DEPLOYMENTS_PAGE_SUBTITLE = 'Monitor deployments and deployment records for active personnel operations.'
export const DEPLOYMENTS_PAGE_SECTION_CLASSES = 'space-y-6'
export const DEPLOYMENTS_PAGE_KPI_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-2'
export const DEPLOYMENTS_PAGE_TABS_ARIA_LABEL = 'Deployments management tabs'
export const DEPLOYMENTS_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'records', label: 'Records' },  
  { id: 'deployments', label: 'Deployments' },
])
export const DEPLOYMENTS_PAGE_TAB_REQUIRED_PERMISSIONS = Object.freeze({
  deployments: Object.freeze(['deployment.manage']),
  records: Object.freeze(['deployment.manage']),
})
export const DEPLOYMENTS_FILTER_CARD_TITLE = 'Filter Deployments'
export const DEPLOYMENTS_FILTER_TERM_LABEL = 'Search Term'
export const DEPLOYMENTS_FILTER_TERM_PLACEHOLDER = 'Search deployment value'
export const DEPLOYMENTS_FILTER_FIELDS_LABEL = 'Search Field'
export const DEPLOYMENTS_FILTER_APPLY_LABEL = 'Apply Filters'
export const DEPLOYMENTS_FILTER_RESET_LABEL = 'Reset'
export const DEPLOYMENTS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: 'operationName', label: 'Operation' },
  { value: 'deploymentArea', label: 'Deployment Area' },
  { value: 'assignmentRole', label: 'Assignment Role' },
  { value: 'location', label: 'Location' },
  { value: 'remarks', label: 'Remarks' },
  { value: 'startDate', label: 'Start Date', type: 'date' },
  { value: 'endDate', label: 'End Date', type: 'date' },
])
export const DEPLOYMENT_RECORDS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: 'recordNo', label: 'Record Number' },
  ...DEPLOYMENTS_FILTER_FIELD_OPTIONS,
])
export const DEPLOYMENT_RECORDS_FILTER_CARD_TITLE = 'Filter Deployment Records'
export const DEPLOYMENT_RECORDS_FILTER_TERM_LABEL = 'Search Term'
export const DEPLOYMENT_RECORDS_FILTER_TERM_PLACEHOLDER = 'Search deployment record value'
export const DEPLOYMENT_RECORDS_FILTER_FIELDS_LABEL = 'Search Field'
export const DEPLOYMENT_RECORDS_FILTER_APPLY_LABEL = 'Apply Filters'
export const DEPLOYMENT_RECORDS_FILTER_RESET_LABEL = 'Reset'
export const DEPLOYMENTS_CREATE_MODAL_TITLE = 'Create Deployment'
export const DEPLOYMENTS_CREATE_MODAL_DESCRIPTION = 'Register a new deployment profile for operational tracking.'
export const DEPLOYMENTS_UPDATE_MODAL_TITLE = 'Update Deployment'
export const DEPLOYMENTS_UPDATE_MODAL_DESCRIPTION = 'Update deployment profile details for operational tracking.'
export const DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_LABEL = 'Deployment Area'
export const DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_PLACEHOLDER = 'e.g., Northern Sector Command'
export const DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_LABEL = 'Assignment Role'
export const DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_PLACEHOLDER = 'e.g., Platoon Support'
export const DEPLOYMENTS_CREATE_OPERATION_NAME_LABEL = 'Operation Name'
export const DEPLOYMENTS_CREATE_OPERATION_NAME_PLACEHOLDER = 'e.g., Operation Sentinel Watch'
export const DEPLOYMENTS_CREATE_STATUS_ID_LABEL = 'Deployment Status'
export const DEPLOYMENTS_CREATE_STATUS_ID_PLACEHOLDER = 'Select deployment status'
export const DEPLOYMENTS_CREATE_STATUS_OPTIONS = Object.freeze(
  DEPLOYMENT_STATUS_VALUES.map((value) => ({ label: value, value })),
)
export const DEPLOYMENTS_CREATE_START_DATE_LABEL = 'Start Date'
export const DEPLOYMENTS_CREATE_END_DATE_LABEL = 'End Date'
export const DEPLOYMENTS_CREATE_LOCATION_LABEL = 'Location'
export const DEPLOYMENTS_CREATE_LOCATION_PLACEHOLDER = 'e.g., Camp Aguinaldo, Quezon City'
export const DEPLOYMENTS_CREATE_SUPERVISOR_ID_LABEL = 'Supervisor Personnel ID'
export const DEPLOYMENTS_CREATE_SUPERVISOR_ID_PLACEHOLDER = 'Enter supervisor personnel identifier'
export const DEPLOYMENTS_CREATE_REMARKS_LABEL = 'Default Remarks'
export const DEPLOYMENTS_CREATE_REMARKS_PLACEHOLDER = 'Add optional deployment notes'
export const DEPLOYMENTS_CREATE_LATITUDE_LABEL = 'Deployment Latitude'
export const DEPLOYMENTS_CREATE_LATITUDE_PLACEHOLDER = 'e.g., 14.599512'
export const DEPLOYMENTS_CREATE_LONGITUDE_LABEL = 'Deployment Longitude'
export const DEPLOYMENTS_CREATE_LONGITUDE_PLACEHOLDER = 'e.g., 120.984222'
export const DEPLOYMENTS_CREATE_MAP_TITLE = 'Deployment Area Map Preview'
export const DEPLOYMENTS_CREATE_MAP_SUBTITLE = 'Drag the map pin to set deployment latitude and longitude.'

export const DEPLOYMENTS_VIEW_MODAL_TITLE = 'View Deployment'
export const DEPLOYMENTS_VIEW_MODAL_DESCRIPTION = 'Review deployment operation details and tactical area map.'
export const DEPLOYMENTS_VIEW_MODAL_CLOSE_LABEL = 'Close'
export const DEPLOYMENTS_VIEW_TAB_ARIA_LABEL = 'Deployment view tabs'
export const DEPLOYMENTS_VIEW_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'details', label: 'Operation Details' },
  { id: 'map', label: 'Tactical Map View' },
])
export const DEPLOYMENTS_VIEW_DETAILS_CARD_TITLE = 'Operation Details'
export const DEPLOYMENTS_VIEW_MAP_TITLE = 'Tactical Map View'
export const DEPLOYMENTS_VIEW_MAP_SUBTITLE = 'Operational deployment area coordinates and map context.'

export const DEPLOYMENTS_RECORDS_PENDING_MESSAGE = 'Deployment records tab will be added in the next iteration.'
export const DEPLOYMENTS_BULK_UPDATE_MODAL_TITLE = 'Bulk Update Deployments'
export const DEPLOYMENTS_BULK_UPDATE_MODAL_DESCRIPTION = 'Choose non-unique fields to apply to every selected deployment.'
export const DEPLOYMENT_RECORDS_BULK_UPDATE_MODAL_TITLE = 'Bulk Update Deployment Records'
export const DEPLOYMENT_RECORDS_BULK_UPDATE_MODAL_DESCRIPTION = 'Choose non-unique fields to apply to every selected deployment record.'
export const DEPLOYMENTS_BULK_UPDATE_WARNING = 'Only checked fields will be changed. Existing record numbers and personnel or deployment assignments remain unchanged.'

export const CREATE_DEPLOYMENT_RECORD_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'details', label: 'Details' },
  { id: 'location', label: 'Geomap' },
])
