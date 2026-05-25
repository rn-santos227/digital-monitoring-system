
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'

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
  { value: '', label: 'All searchable fields' },
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
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
