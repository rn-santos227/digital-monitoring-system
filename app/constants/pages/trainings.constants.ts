import type { BaseTabItem } from '~/constants/ui.constants'
import {
  TRAINING_PRIVILEGES,
} from '~/constants/privileges.constants'
import type { TrainingManagementTabId } from '~/types/domain/training'
import {
  LEVEL_VALUES,
  TRAINING_STATUS_VALUES,
} from '~/types/enums'
export const TRAINING_PAGE_TITLE = 'Training Management'
export const TRAINING_PAGE_SUBTITLE = 'Monitor training records, training master list, and training categories for readiness planning.'
export const TRAINING_PAGE_SECTION_CLASSES = 'space-y-6'
export const TRAINING_PAGE_KPI_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
export const TRAINING_PAGE_TABS_ARIA_LABEL = 'Training management tabs'
export const TRAINING_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'records', label: 'Records' },
  { id: 'trainings', label: 'Trainings' },
  { id: 'categories', label: 'Categories' },
  { id: 'calendar', label: 'Calendar' },
])

export const TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS: Readonly<Record<TrainingManagementTabId, readonly string[]>> = Object.freeze({
  records: TRAINING_PRIVILEGES.manage,
  trainings: TRAINING_PRIVILEGES.view,
  categories: TRAINING_PRIVILEGES.view,
  calendar: TRAINING_PRIVILEGES.manage,
})
export const TRAINING_PAGE_REQUIRED_PERMISSIONS = TRAINING_PRIVILEGES


export const TRAINING_RECORDS_FILTER_CARD_TITLE = 'Filter Training Records'
export const TRAINING_RECORDS_FILTER_TERM_LABEL = 'Search Term'
export const TRAINING_RECORDS_FILTER_TERM_PLACEHOLDER = 'Search training record value'
export const TRAINING_RECORDS_FILTER_FIELDS_LABEL = 'Search Field'
export const TRAINING_RECORDS_FILTER_APPLY_LABEL = 'Apply Filters'
export const TRAINING_RECORDS_FILTER_RESET_LABEL = 'Reset'
export const TRAINING_RECORDS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'recordNo', label: 'Record No.' },
  { value: 'trainingTitle', label: 'Training' },
  { value: 'certificateNo', label: 'Certificate No.' },
  { value: 'remarks', label: 'Remarks' },
])

export const TRAININGS_FILTER_CARD_TITLE = 'Filter Trainings'
export const TRAININGS_FILTER_TERM_LABEL = 'Search Term'
export const TRAININGS_FILTER_TERM_PLACEHOLDER = 'Search training value'
export const TRAININGS_FILTER_FIELDS_LABEL = 'Search Field'
export const TRAININGS_FILTER_APPLY_LABEL = 'Apply Filters'
export const TRAININGS_FILTER_RESET_LABEL = 'Reset'
export const TRAININGS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'trainingTitle', label: 'Training Title' },
  { value: 'defaultRemarks', label: 'Default Remarks' },
])

export const TRAINING_CATEGORIES_FILTER_CARD_TITLE = 'Filter Training Categories'
export const TRAINING_CATEGORIES_FILTER_TERM_LABEL = 'Search Term'
export const TRAINING_CATEGORIES_FILTER_TERM_PLACEHOLDER = 'Search category value'
export const TRAINING_CATEGORIES_FILTER_FIELDS_LABEL = 'Search Field'
export const TRAINING_CATEGORIES_FILTER_APPLY_LABEL = 'Apply Filters'
export const TRAINING_CATEGORIES_FILTER_RESET_LABEL = 'Reset'
export const TRAINING_CATEGORIES_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
])

export const TRAINING_RECORDS_PENDING_MESSAGE = 'Training records module will be added in the next iteration.'
export const TRAINING_RECORDS_CREATE_BUTTON_LABEL = 'Create Training Record'
export const TRAININGS_CREATE_BUTTON_LABEL = 'Create Training'
export const TRAINING_CATEGORIES_CREATE_BUTTON_LABEL = 'Create Training Category'
export const TRAININGS_MODAL_CANCEL_LABEL = 'Cancel'
export const TRAININGS_MODAL_CREATE_LABEL = 'Create'
export const TRAINING_RECORDS_UPDATE_MODAL_TITLE = 'Update Training Record'
export const TRAINING_RECORDS_UPDATE_MODAL_DESCRIPTION = 'Update personnel training record details and validity.'
export const TRAININGS_MODAL_UPDATE_LABEL = 'Update'
export const TRAINING_RECORDS_VIEW_MODAL_TITLE = 'View Training Record'
export const TRAINING_RECORDS_VIEW_MODAL_DESCRIPTION = 'Review training record details and assigned personnel information.'
export const TRAINING_RECORDS_VIEW_MODAL_CLOSE_LABEL = 'Close'
export const TRAININGS_VIEW_MODAL_TITLE = 'View Training'
export const TRAININGS_VIEW_MODAL_DESCRIPTION = 'Review training details and assigned personnel records.'
export const TRAININGS_VIEW_MODAL_CLOSE_LABEL = 'Close'

export const TRAININGS_CREATE_MODAL_TITLE = 'Create Training'
export const TRAININGS_CREATE_MODAL_DESCRIPTION = 'Add a training record to the training management registry.'
export const TRAININGS_CREATE_TITLE_LABEL = 'Training Title'
export const TRAININGS_CREATE_TITLE_PLACEHOLDER = 'e.g., Basic Infantry Combat Course'
export const TRAININGS_CREATE_CATEGORY_LABEL = 'Training Category'
export const TRAININGS_CREATE_CATEGORY_PLACEHOLDER = 'Type training category code or name'
export const TRAININGS_CREATE_CATEGORY_EMPTY_MESSAGE = 'No training categories found.'
export const TRAININGS_CREATE_STATUS_LABEL = 'Training Status'
export const TRAININGS_CREATE_STATUS_PLACEHOLDER = 'Select training status'
export const TRAININGS_CREATE_STATUS_OPTIONS = Object.freeze(
  TRAINING_STATUS_VALUES.map((value) => ({ label: value, value })),
)
export const TRAININGS_CREATE_LEVEL_LABEL = 'Level'
export const TRAININGS_CREATE_LEVEL_PLACEHOLDER = 'Select level'
export const TRAININGS_CREATE_LEVEL_OPTIONS = Object.freeze(
  LEVEL_VALUES.map((value) => ({ label: value, value })),
)
export const TRAININGS_CREATE_START_DATE_LABEL = 'Start Date'
export const TRAININGS_CREATE_END_DATE_LABEL = 'End Date'
export const TRAININGS_CREATE_REMARKS_LABEL = 'Default Remarks'
export const TRAININGS_CREATE_REMARKS_PLACEHOLDER = 'Add optional remarks for this training'

export const TRAINING_RECORDS_CREATE_MODAL_TITLE = 'Create Training Record'
export const TRAINING_RECORDS_CREATE_MODAL_DESCRIPTION = 'Assign a training to personnel and capture certificate details.'
export const TRAINING_RECORDS_CREATE_TRAINING_LABEL = 'Training'
export const TRAINING_RECORDS_CREATE_TRAINING_PLACEHOLDER = 'Search training title'
export const TRAINING_RECORDS_CREATE_TRAINING_HELPER_TEXT = 'Select a training from the training registry.'
export const TRAINING_RECORDS_CREATE_PERSONNEL_LABEL = 'Personnel'
export const TRAINING_RECORDS_CREATE_PERSONNEL_PLACEHOLDER = 'Search personnel name or code'
export const TRAINING_RECORDS_CREATE_PERSONNEL_HELPER_TEXT = 'Select personnel to assign this training record.'
export const TRAINING_RECORDS_CREATE_CERTIFICATE_NO_LABEL = 'Certificate No.'
export const TRAINING_RECORDS_CREATE_CERTIFICATE_NO_PLACEHOLDER = 'Enter certificate number'
export const TRAINING_RECORDS_CREATE_VALID_UNTIL_LABEL = 'Valid Until'
export const TRAINING_RECORDS_CREATE_REMARKS_LABEL = 'Remarks'
export const TRAINING_RECORDS_CREATE_REMARKS_PLACEHOLDER = 'Add optional remarks'

export const TRAINING_CATEGORIES_CREATE_MODAL_TITLE = 'Create Training Category'
export const TRAINING_CATEGORIES_CREATE_MODAL_DESCRIPTION = 'Add a training category for training classification.'
export const TRAINING_CATEGORIES_CREATE_CODE_LABEL = 'Category Code'
export const TRAINING_CATEGORIES_CREATE_CODE_PLACEHOLDER = 'e.g., COMBAT'
export const TRAINING_CATEGORIES_CREATE_NAME_LABEL = 'Category Name'
export const TRAINING_CATEGORIES_CREATE_NAME_PLACEHOLDER = 'e.g., Combat Training'
export const TRAININGS_UPDATE_MODAL_TITLE = 'Update Training'
export const TRAININGS_UPDATE_MODAL_DESCRIPTION = 'Update training registry details.'
export const TRAINING_CATEGORIES_UPDATE_MODAL_TITLE = 'Update Training Category'
export const TRAINING_CATEGORIES_UPDATE_MODAL_DESCRIPTION = 'Update training category details.'
export const TRAINING_CALENDAR_ERROR_MESSAGE = 'Unable to fetch training calendar events.'
