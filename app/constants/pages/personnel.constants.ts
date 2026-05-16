import type { BaseTabItem } from '~/constants/ui.constants'
import {
  ACCOUNT_TYPE_PRIVILEGES,
  BATTALION_PRIVILEGES,
  COMPANY_PRIVILEGES,
  PERSONNEL_PRIVILEGES,
  RANK_PRIVILEGES,
  USER_PROFILE_PRIVILEGES,
  TRAINING_PRIVILEGES,
} from '~/constants/privileges.constants'
import type { PersonnelManagementTabId, PersonnelProfileTabId } from '~/types/domain/personnel'
import type { UserManagementTabId } from '~/types/domain/users'
import type { TrainingManagementTabId } from '~/types/domain/training'
import type { UnitManagementTabId } from '~/types/domain/units'
import {
  DEPLOYMENT_STATUS_VALUES,
  EMPLOYMENT_STATUS_VALUES,
  SERVICE_STATUS_VALUES,
  LEVEL_VALUES,
  TRAINING_STATUS_VALUES,
  ENGAGEMENT_TYPE_VALUES,
  ENGAGEMENT_STATUS_VALUES,
} from '~/types/enums'
export const PERSONNEL_PAGE_TITLE = 'Personnel'
export const PERSONNEL_PAGE_SUBTITLE =
  'Monitor AFP personnel records, unit assignments, and service status in a centralized operational view.'
export const PERSONNEL_PAGE_SECTION_CLASSES = 'space-y-6'
export const PERSONNEL_PAGE_REQUIRED_PERMISSIONS = PERSONNEL_PRIVILEGES
export const PERSONNEL_PAGE_TABS_ARIA_LABEL = 'Personnel and rank management tabs'
export const PERSONNEL_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'personnel-records', label: 'Personnel Records' },
  { id: 'rank-management', label: 'Rank Management' },
])
export const PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS: Readonly<Record<PersonnelManagementTabId, readonly string[]>> = Object.freeze({
  'personnel-records': PERSONNEL_PRIVILEGES.view,
  'rank-management': RANK_PRIVILEGES.view,
})
export const PERSONNEL_CREATE_BUTTON_LABEL = 'Create Personnel'
export const PERSONNEL_BATCH_UPLOAD_BUTTON_LABEL = 'Batch Upload'
export const PERSONNEL_PRINT_BUTTON_TABLE_LABEL = 'Personnel Records'
export const PERSONNEL_MODAL_CREATE_LABEL = 'Create'
export const PERSONNEL_MODAL_UPDATE_LABEL = 'Update'
export const PERSONNEL_MODAL_CANCEL_LABEL = 'Cancel'
export const PERSONNEL_CREATE_MODAL_TITLE = 'Create Personnel Record'
export const PERSONNEL_CREATE_MODAL_DESCRIPTION = 'Register a new personnel profile for battalion and company monitoring.'
export const PERSONNEL_CREATE_PERSONNEL_CODE_LABEL = 'Personnel Code'
export const PERSONNEL_CREATE_PERSONNEL_CODE_PLACEHOLDER = 'Enter personnel code'
export const PERSONNEL_CREATE_SERVICE_NUMBER_LABEL = 'Serial Number'
export const PERSONNEL_CREATE_SERVICE_NUMBER_PLACEHOLDER = 'Enter serial number'
export const PERSONNEL_CREATE_EMAIL_LABEL = 'Email'
export const PERSONNEL_CREATE_EMAIL_PLACEHOLDER = 'Enter email address'
export const PERSONNEL_CREATE_LAST_NAME_LABEL = 'Last Name'
export const PERSONNEL_CREATE_LAST_NAME_PLACEHOLDER = 'Enter last name'
export const PERSONNEL_CREATE_FIRST_NAME_LABEL = 'First Name'
export const PERSONNEL_CREATE_FIRST_NAME_PLACEHOLDER = 'Enter first name'
export const PERSONNEL_CREATE_MIDDLE_NAME_LABEL = 'Middle Name'
export const PERSONNEL_CREATE_MIDDLE_NAME_PLACEHOLDER = 'Enter middle name (optional)'
export const PERSONNEL_CREATE_SEX_LABEL = 'Sex'
export const PERSONNEL_CREATE_SEX_PLACEHOLDER = 'Select sex'
export const PERSONNEL_CREATE_SEX_OPTIONS = Object.freeze([
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
])
export const PERSONNEL_CREATE_BIRTHDATE_LABEL = 'Birthdate'
export const PERSONNEL_CREATE_DATE_ENLISTED_LABEL = 'Date Enlisted'
export const PERSONNEL_CREATE_RANK_ID_LABEL = 'Rank'
export const PERSONNEL_CREATE_RANK_ID_PLACEHOLDER = 'Search rank code or name'
export const PERSONNEL_CREATE_COMPANY_ID_LABEL = 'Company'
export const PERSONNEL_CREATE_COMPANY_ID_PLACEHOLDER = 'Search company by code or name (optional)'
export const PERSONNEL_CREATE_BATTALION_ID_LABEL = 'Battalion'
export const PERSONNEL_CREATE_BATTALION_ID_PLACEHOLDER = 'Search battalion by code or name (optional)'
export const PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_LABEL = 'Employment Status'
export const PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_PLACEHOLDER = 'Select employment status'
export const PERSONNEL_CREATE_EMPLOYMENT_STATUS_OPTIONS = Object.freeze(
  EMPLOYMENT_STATUS_VALUES.map((value) => ({ label: value, value }))
)
export const PERSONNEL_CREATE_SERVICE_STATUS_ID_LABEL = 'Service Status'
export const PERSONNEL_CREATE_SERVICE_STATUS_ID_PLACEHOLDER = 'Select service status'
export const PERSONNEL_CREATE_SERVICE_STATUS_OPTIONS = Object.freeze(
  SERVICE_STATUS_VALUES.map((value) => ({ label: value, value }))
)
export const PERSONNEL_CREATE_CONTACT_NUMBER_LABEL = 'Contact Number'
export const PERSONNEL_CREATE_CONTACT_NUMBER_PLACEHOLDER = 'Enter contact number (optional)'
export const PERSONNEL_CREATE_POSITION_LABEL = 'Position / AFPPOS'
export const PERSONNEL_CREATE_POSITION_PLACEHOLDER = 'Enter Position or AFPPOS (optional)'
export const PERSONNEL_CREATE_PROFILE_IMAGE_LABEL = 'Profile Image'
export const PERSONNEL_CREATE_PROFILE_IMAGE_HELPER = 'Upload an optional personnel profile image.'
export const PERSONNEL_CREATE_PROFILE_IMAGE_URL_LABEL = 'Profile Image URL'
export const PERSONNEL_CREATE_PROFILE_IMAGE_URL_PLACEHOLDER = 'https://example.com/personnel-profile.jpg'
export const PERSONNEL_UPDATE_MODAL_TITLE = 'Update Personnel Record'
export const PERSONNEL_UPDATE_MODAL_DESCRIPTION = 'Update personnel profile details and assignment information.'
export const RANK_CREATE_BUTTON_LABEL = 'Create Rank'
export const RANK_CREATE_MODAL_TITLE = 'Create Rank Record'
export const RANK_CREATE_MODAL_DESCRIPTION = 'Register a rank for personnel assignment and reporting.'

export const PERSONNEL_PROFILE_PAGE_TITLE = 'Personnel Profile'
export const PERSONNEL_PROFILE_PAGE_SUBTITLE = 'Profile details, assignments, and readiness context for operational review.'
export const PERSONNEL_PROFILE_TABS_ARIA_LABEL = 'Personnel profile tabs'
export const PERSONNEL_PROFILE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'core', label: 'Core Profile' },
  { id: 'training', label: 'Training Records' },
  { id: 'deployment', label: 'Deployment Records' },
  { id: 'engagement', label: 'Engagement Records' },
  { id: 'equipment-assignment', label: 'Equipment Assignments' },
])

export const PERSONNEL_PROFILE_TAB_CARD_TITLES: Readonly<Record<PersonnelProfileTabId, string>> = Object.freeze({
  core: 'Personal and Assignment Overview',
  training: 'Training Records',
  deployment: 'Deployment Records',
  engagement: 'Engagement Records',
  'equipment-assignment': 'Equipment Assignment Records',
})

export const PERSONNEL_FILTER_CARD_TITLE = 'Filter Personnel'
export const PERSONNEL_FILTER_TERM_LABEL = 'Search Term'
export const PERSONNEL_FILTER_TERM_PLACEHOLDER = 'Search personnel value'
export const PERSONNEL_FILTER_FIELDS_LABEL = 'Search Field'
export const PERSONNEL_FILTER_APPLY_LABEL = 'Apply Filters'
export const PERSONNEL_FILTER_RESET_LABEL = 'Reset'
export const PERSONNEL_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'personnelCode', label: 'Personnel Code' },
  { value: 'serviceNumber', label: 'Serial Number' },
  { value: 'email', label: 'Email' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'firstName', label: 'First Name' },
  { value: 'rankName', label: 'Rank' },
])
