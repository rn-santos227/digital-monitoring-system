import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  ASSET_STATUS_VALUES,
  CONDITION_STATUS_VALUES,
  INCIDENT_TYPE_VALUES,
  INVESTIGATION_STATUS_VALUES,
  ISSUANCE_STATUS_VALUES,
  SERVICEABILITY_STATUS_VALUES,
} from '~/types/enums'
import type { BaseTabItem } from '~/constants/ui.constants'
import type { EquipmentItemProfileTabId } from '~/types/domain/equipment'

export const EQUIPMENT_CATEGORIES_PAGE_TITLE = 'Equipment Categories'
export const EQUIPMENT_CATEGORIES_PAGE_SUBTITLE = 'Manage equipment category records for standardized equipment classification.'
export const EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES = 'space-y-6'
export const EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'

export const EQUIPMENT_CATEGORIES_FILTER_CARD_TITLE = 'Filter Equipment Categories'
export const EQUIPMENT_CATEGORIES_FILTER_TERM_LABEL = 'Search Term'
export const EQUIPMENT_CATEGORIES_FILTER_TERM_PLACEHOLDER = 'Search equipment category value'
export const EQUIPMENT_CATEGORIES_FILTER_FIELDS_LABEL = 'Search Field'
export const EQUIPMENT_CATEGORIES_FILTER_STATUS_LABEL = 'Status'
export const EQUIPMENT_CATEGORIES_FILTER_APPLY_LABEL = 'Apply Filters'
export const EQUIPMENT_CATEGORIES_FILTER_RESET_LABEL = 'Reset'

export const EQUIPMENT_CATEGORIES_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created Date', dataType: 'date' as const },
  { value: 'updatedAt', label: 'Updated Date', dataType: 'date' as const },
])

export const EQUIPMENT_CATEGORIES_FILTER_STATUS_OPTIONS = Object.freeze([
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
])

export const EQUIPMENT_CATEGORIES_PAGE_REQUIRED_PERMISSIONS = EQUIPMENT_PRIVILEGES

export const EQUIPMENT_ITEMS_PAGE_TITLE = 'Equipment Items'
export const EQUIPMENT_ITEMS_PAGE_SUBTITLE = 'Manage equipment item records and their operational classifications.'
export const EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES = 'space-y-6'
export const EQUIPMENT_ITEMS_FILTER_CARD_TITLE = 'Filter Equipment Items'
export const EQUIPMENT_ITEMS_FILTER_TERM_LABEL = 'Search Term'
export const EQUIPMENT_ITEMS_FILTER_TERM_PLACEHOLDER = 'Search equipment item value'
export const EQUIPMENT_ITEMS_FILTER_FIELDS_LABEL = 'Search Field'
export const EQUIPMENT_ITEMS_FILTER_APPLY_LABEL = 'Apply Filters'
export const EQUIPMENT_ITEMS_FILTER_RESET_LABEL = 'Reset'
export const EQUIPMENT_ITEMS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'equipmentCode', label: 'Equipment Code' },
  { value: 'name', label: 'Item Name' },
  { value: 'model', label: 'Model' },
  { value: 'manufacturer', label: 'Manufacturer' },
])
export const EQUIPMENT_ITEMS_PAGE_REQUIRED_PERMISSIONS = EQUIPMENT_PRIVILEGES

export const EQUIPMENT_ITEM_PROFILE_PAGE_TITLE = 'Equipment Item Profile'
export const EQUIPMENT_ITEM_PROFILE_PAGE_SUBTITLE = 'Review item details and unit usage history for issued equipment.'
export const EQUIPMENT_ITEM_PROFILE_TABS_ARIA_LABEL = 'Equipment item profile tabs'
export const EQUIPMENT_ITEM_PROFILE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'personnel', label: 'Personnel Usage' },
  { id: 'companies', label: 'Companies' },
  { id: 'battalions', label: 'Battalions' },
])
export const EQUIPMENT_ITEM_PROFILE_TAB_CARD_TITLES: Readonly<Record<EquipmentItemProfileTabId, string>> = Object.freeze({
  personnel: 'Personnel Usage Records',
  companies: 'Company Usage Summary',
  battalions: 'Battalion Usage Summary',
})

export const EQUIPMENT_ASSETS_PAGE_TITLE = 'Equipment Assets'
export const EQUIPMENT_ASSETS_PAGE_SUBTITLE = 'Monitor and track equipment asset records and operational statuses.'
export const EQUIPMENT_ASSETS_PAGE_SECTION_CLASSES = 'space-y-6'
export const EQUIPMENT_ASSETS_FILTER_CARD_TITLE = 'Filter Equipment Assets'
export const EQUIPMENT_ASSETS_FILTER_TERM_LABEL = 'Search Term'
export const EQUIPMENT_ASSETS_FILTER_TERM_PLACEHOLDER = 'Search equipment asset value'
export const EQUIPMENT_ASSETS_FILTER_FIELDS_LABEL = 'Search Field'
export const EQUIPMENT_ASSETS_FILTER_APPLY_LABEL = 'Apply Filters'
export const EQUIPMENT_ASSETS_FILTER_RESET_LABEL = 'Reset'
export const EQUIPMENT_ASSETS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'assetTag', label: 'Asset Tag' },
  { value: 'equipmentItemCode', label: 'Equipment Code' },
  { value: 'equipmentItemName', label: 'Equipment Item' },
  { value: 'serialNo', label: 'Serial Number' },
])
export const EQUIPMENT_ASSETS_CONDITION_STATUS_OPTIONS = Object.freeze(
  CONDITION_STATUS_VALUES.map((value) => ({ label: value, value })),
)
export const EQUIPMENT_ASSETS_SERVICEABILITY_STATUS_OPTIONS = Object.freeze(
  SERVICEABILITY_STATUS_VALUES.map((value) => ({ label: value, value })),
)
export const EQUIPMENT_ASSETS_ASSET_STATUS_OPTIONS = Object.freeze(
  ASSET_STATUS_VALUES.map((value) => ({ label: value, value })),
)
export const EQUIPMENT_ASSETS_PAGE_REQUIRED_PERMISSIONS = EQUIPMENT_PRIVILEGES

export const EQUIPMENT_ISSUANCES_PAGE_TITLE = 'Equipment Issuances'
export const EQUIPMENT_ISSUANCES_PAGE_SUBTITLE = 'Monitor issued equipment assets, assigned personnel, return timelines, and issuance status.'
export const EQUIPMENT_ISSUANCES_PAGE_SECTION_CLASSES = 'space-y-6'
export const EQUIPMENT_ISSUANCES_FILTER_CARD_TITLE = 'Filter Equipment Issuances'
export const EQUIPMENT_ISSUANCES_FILTER_TERM_LABEL = 'Search Term'
export const EQUIPMENT_ISSUANCES_FILTER_TERM_PLACEHOLDER = 'Search issue number, issued location, or remarks'
export const EQUIPMENT_ISSUANCES_FILTER_STATUS_LABEL = 'Issuance Status'
export const EQUIPMENT_ISSUANCES_STATUS_OPTIONS = Object.freeze(
  ISSUANCE_STATUS_VALUES.map((value) => ({ label: value, value })),
)

export const EQUIPMENT_ISSUANCES_FILTER_STATUS_OPTIONS = Object.freeze([
  { value: '', label: 'All issuance statuses' },
  ...EQUIPMENT_ISSUANCES_STATUS_OPTIONS,
])
export const EQUIPMENT_ISSUANCES_FILTER_APPLY_LABEL = 'Apply Filters'
export const EQUIPMENT_ISSUANCES_FILTER_RESET_LABEL = 'Reset'
export const EQUIPMENT_ISSUANCES_PAGE_REQUIRED_PERMISSIONS = EQUIPMENT_PRIVILEGES

export const EQUIPMENT_INCIDENTS_PAGE_TITLE = 'Equipment Incidents'
export const EQUIPMENT_INCIDENTS_PAGE_SUBTITLE = 'Monitor reported equipment incidents, investigations, and resolution status.'
export const EQUIPMENT_INCIDENTS_PAGE_SECTION_CLASSES = 'space-y-6'
export const EQUIPMENT_INCIDENTS_FILTER_CARD_TITLE = 'Filter Equipment Incidents'
export const EQUIPMENT_INCIDENTS_FILTER_TERM_LABEL = 'Search Term'
export const EQUIPMENT_INCIDENTS_FILTER_TERM_PLACEHOLDER = 'Search incident number, location, description, resolution, or remarks'
export const EQUIPMENT_INCIDENTS_FILTER_DATE_FROM_LABEL = 'Incident Date From'
export const EQUIPMENT_INCIDENTS_FILTER_DATE_TO_LABEL = 'Incident Date To'
export const EQUIPMENT_INCIDENTS_FILTER_APPLY_LABEL = 'Apply Filters'
export const EQUIPMENT_INCIDENTS_FILTER_RESET_LABEL = 'Reset'
export const EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS = Object.freeze(
  INCIDENT_TYPE_VALUES.map((value) => ({ label: value, value })),
)
export const EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS = Object.freeze(
  INVESTIGATION_STATUS_VALUES.map((value) => ({ label: value, value })),
)
export const EQUIPMENT_INCIDENTS_PAGE_REQUIRED_PERMISSIONS = EQUIPMENT_PRIVILEGES
export const EQUIPMENT_INCIDENTS_BULK_UPDATE_MODAL_TITLE =
  'Bulk Update Equipment Incidents'
export const EQUIPMENT_INCIDENTS_BULK_UPDATE_MODAL_DESCRIPTION =
  'Change non-unique incident fields for all selected equipment incidents.'
export const EQUIPMENT_INCIDENTS_BULK_UPDATE_WARNING =
  'Only enabled fields will be applied to every selected incident. The unique incident number is intentionally unavailable.'
export const EQUIPMENT_INCIDENT_PROFILE_PAGE_TITLE = 'Equipment Incident Profile'
export const EQUIPMENT_INCIDENT_PROFILE_PAGE_SUBTITLE = 'Review incident details, linked records, updates, and investigation status changes.'
export const EQUIPMENT_BULK_UPDATE_WARNING =
  'Only enabled fields will be applied to every selected record. Unique identifiers are intentionally unavailable for bulk updates.'
export const EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_TITLE =
  'Bulk Update Equipment Categories'
export const EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_DESCRIPTION =
  'Change non-unique category fields for all selected equipment categories.'
export const EQUIPMENT_ITEMS_BULK_UPDATE_MODAL_TITLE =
  'Bulk Update Equipment Items'
export const EQUIPMENT_ITEMS_BULK_UPDATE_MODAL_DESCRIPTION =
  'Change non-unique item fields for all selected equipment items.'
export const EQUIPMENT_ASSETS_BULK_UPDATE_MODAL_TITLE =
  'Bulk Update Equipment Assets'
export const EQUIPMENT_ASSETS_BULK_UPDATE_MODAL_DESCRIPTION =
  'Change non-unique asset fields for all selected equipment assets.'
export const EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_TITLE =
  'Bulk Update Equipment Issuances'
export const EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_DESCRIPTION =
  'Change non-unique issuance fields for all selected equipment issuances.'
