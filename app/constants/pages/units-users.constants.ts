import type { BaseTabItem } from '~/constants/ui.constants'
import {
  ACCOUNT_TYPE_PRIVILEGES,
  AUDIT_PRIVILEGES,
  BATTALION_PRIVILEGES,
  COMPANY_PRIVILEGES,
  USER_PROFILE_PRIVILEGES,
} from '~/constants/privileges.constants'
import type { UserManagementTabId, UserProfileViewTabId } from '~/types/domain/users'
import type { UnitManagementTabId } from '~/types/domain/units'
export const UNITS_PAGE_TITLE = 'Battalions and Companies'
export const UNITS_PAGE_SUBTITLE =
  'Monitor battalion and company unit records with searchable operational tables.'
export const UNITS_PAGE_SECTION_CLASSES = 'space-y-6'
export const UNITS_PAGE_KPI_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
export const UNITS_PAGE_TABS_ARIA_LABEL = 'Battalions and companies tabs'
export const UNITS_BATTALION_TAB_LABEL = 'Battalions'
export const UNITS_COMPANY_TAB_LABEL = 'Companies'
export const UNITS_BATTALION_CREATE_BUTTON_LABEL = 'Create Battalion'
export const UNITS_COMPANY_CREATE_BUTTON_LABEL = 'Create Company'
export const UNITS_MODAL_UPDATE_LABEL = 'Update'
export const UNITS_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'battalion', label: UNITS_BATTALION_TAB_LABEL },
  { id: 'company', label: UNITS_COMPANY_TAB_LABEL },
])
export const UNITS_PAGE_TAB_REQUIRED_PERMISSIONS: Readonly<Record<UnitManagementTabId, readonly string[]>> = Object.freeze({
  battalion: BATTALION_PRIVILEGES.view,
  company: COMPANY_PRIVILEGES.view,
})

export const BATTALIONS_FILTER_CARD_TITLE = 'Filter Battalions'
export const BATTALIONS_FILTER_TERM_LABEL = 'Search Term'
export const BATTALIONS_FILTER_TERM_PLACEHOLDER = 'Search battalion value'
export const BATTALIONS_FILTER_FIELDS_LABEL = 'Search Field'
export const BATTALIONS_FILTER_STATUS_LABEL = 'Status'
export const BATTALIONS_FILTER_APPLY_LABEL = 'Apply Filters'
export const BATTALIONS_FILTER_RESET_LABEL = 'Reset'
export const BATTALIONS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created Date', dataType: 'date' },
  { value: 'updatedAt', label: 'Updated Date', dataType: 'date' },
])
export const BATTALIONS_FILTER_STATUS_OPTIONS = Object.freeze([
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
])

export const BATTALION_CREATE_MODAL_TITLE = 'Create Battalion Record'
export const BATTALION_CREATE_MODAL_DESCRIPTION = 'Register a battalion unit for personnel and company assignment.'
export const BATTALION_CREATE_CODE_LABEL = 'Battalion Code'
export const BATTALION_CREATE_CODE_PLACEHOLDER = 'Enter battalion code'
export const BATTALION_CREATE_NAME_LABEL = 'Battalion Name'
export const BATTALION_CREATE_NAME_PLACEHOLDER = 'Enter battalion name'
export const BATTALION_CREATE_ACTIVE_LABEL = 'Active Battalion'
export const BATTALION_CREATE_ACTIVE_DESCRIPTION = 'Enable this battalion for assignment and operations.'

export const COMPANY_CREATE_MODAL_TITLE = 'Create Company Record'
export const COMPANY_CREATE_MODAL_DESCRIPTION = 'Register a company unit and optionally link it to a battalion.'
export const COMPANY_CREATE_CODE_LABEL = 'Company Code'
export const COMPANY_CREATE_CODE_PLACEHOLDER = 'Enter company code'
export const COMPANY_CREATE_NAME_LABEL = 'Company Name'
export const COMPANY_CREATE_NAME_PLACEHOLDER = 'Enter company name'
export const COMPANY_CREATE_BATTALION_LABEL = 'Battalion'
export const COMPANY_CREATE_BATTALION_PLACEHOLDER = 'Select battalion (optional)'
export const COMPANY_CREATE_ACTIVE_LABEL = 'Active Company'
export const COMPANY_CREATE_ACTIVE_DESCRIPTION = 'Enable this company for personnel assignment and operations.'
export const UNITS_MODAL_CREATE_LABEL = 'Create'
export const UNITS_MODAL_CANCEL_LABEL = 'Cancel'

export const BATTALION_UPDATE_MODAL_TITLE = 'Update Battalion Record'
export const BATTALION_UPDATE_MODAL_DESCRIPTION = 'Update battalion profile details and assignment availability.'

export const COMPANY_UPDATE_MODAL_TITLE = 'Update Company Record'
export const COMPANY_UPDATE_MODAL_DESCRIPTION = 'Update company profile details and battalion assignment.'
export const BATTALION_VIEW_MODAL_TITLE = 'Battalion Details'
export const BATTALION_VIEW_MODAL_DESCRIPTION = 'Review battalion information, attached personnel, equipment, and companies.'
export const COMPANY_VIEW_MODAL_TITLE = 'Company Details'
export const COMPANY_VIEW_MODAL_DESCRIPTION = 'Review company information, attached personnel, equipment, and related companies.'
export const UNITS_VIEW_MODAL_CLOSE_LABEL = 'Close'
export const UNITS_VIEW_TAB_ARIA_LABEL = 'Unit detail tabs'
export const BATTALION_VIEW_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'equipment', label: 'Equipment' },
  { id: 'companies', label: 'Companies' },
])
export const COMPANY_VIEW_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'personnel', label: 'Personnel' },
  { id: 'equipment', label: 'Equipment' },
])

export const BATTALION_DELETE_DIALOG_TITLE = 'Delete battalion?'
export const BATTALION_DELETE_DIALOG_MESSAGE = 'This action cannot be undone. Continue deleting this battalion record?'
export const COMPANY_DELETE_DIALOG_TITLE = 'Delete company?'
export const COMPANY_DELETE_DIALOG_MESSAGE = 'This action cannot be undone. Continue deleting this company record?'

export const COMPANIES_FILTER_CARD_TITLE = 'Filter Companies'
export const COMPANIES_FILTER_TERM_LABEL = 'Search Term'
export const COMPANIES_FILTER_TERM_PLACEHOLDER = 'Search company value'
export const COMPANIES_FILTER_FIELDS_LABEL = 'Search Field'
export const COMPANIES_FILTER_STATUS_LABEL = 'Status'
export const COMPANIES_FILTER_BATTALION_ID_LABEL = 'Battalion ID'
export const COMPANIES_FILTER_BATTALION_ID_PLACEHOLDER = 'Enter battalion id'
export const COMPANIES_FILTER_APPLY_LABEL = 'Apply Filters'
export const COMPANIES_FILTER_RESET_LABEL = 'Reset'
export const COMPANIES_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
])
export const COMPANIES_FILTER_STATUS_OPTIONS = Object.freeze([
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
])

export const USERS_PAGE_TITLE = 'Users Management'
export const USERS_PAGE_SUBTITLE =
  'Manage AFP monitoring user profiles and account access details in a single operational workspace.'


export const TEMPORARY_ROUTE_PAGE_SECTION_CLASSES = 'space-y-6'

export const TEMPORARY_ROUTE_PAGE_CONTENT = Object.freeze({
  serviceStatuses: Object.freeze({
    title: 'Service & Employment Status',
    subtitle: 'Track service and employment status configurations for personnel monitoring operations.',
    featureLabel: 'service and employment status',
  }),
  trainingRecords: Object.freeze({
    title: 'Training Records',
    subtitle: 'Maintain personnel training records and qualification readiness updates.',
    featureLabel: 'training records',
  }),
  deploymentRecords: Object.freeze({
    title: 'Deployment Records',
    subtitle: 'Track personnel deployment assignments and operational area details.',
    featureLabel: 'deployment records',
  }),
  engagementRecords: Object.freeze({
    title: 'Engagement Records',
    subtitle: 'Monitor personnel engagement activities and mission participation records.',
    featureLabel: 'engagement records',
  }),
  equipmentCategories: Object.freeze({
    title: 'Equipment Categories',
    subtitle: 'Manage equipment category groupings used for inventory and issuance workflows.',
    featureLabel: 'equipment categories',
  }),
  equipmentItems: Object.freeze({
    title: 'Equipment Items',
    subtitle: 'Manage standardized equipment item definitions across battalions and companies.',
    featureLabel: 'equipment items',
  }),
  equipmentAssets: Object.freeze({
    title: 'Equipment Assets',
    subtitle: 'Track serialized equipment assets and assignment context in the monitoring system.',
    featureLabel: 'equipment assets',
  }),
  equipmentIssuances: Object.freeze({
    title: 'Equipment Issuances',
    subtitle: 'Monitor equipment issuance and return records for accountable logistics handling.',
    featureLabel: 'equipment issuances',
  }),
  incidents: Object.freeze({
    title: 'Incident Tracking',
    subtitle: 'Track equipment-related incidents, investigations, and resolution outcomes.',
    featureLabel: 'incident tracking',
  }),
  settings: Object.freeze({
    title: 'Settings',
    subtitle: 'Configure system-level defaults and operational preferences for the monitoring platform.',
    featureLabel: 'settings',
  }),
})

export const USERS_PAGE_SECTION_CLASSES = 'space-y-6'
export const USERS_PAGE_KPI_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
export const USERS_PAGE_TABS_ARIA_LABEL = 'Users management tabs'
export const USERS_PROFILE_TAB_LABEL = 'User Profile'
export const USERS_ACCOUNT_TAB_LABEL = 'User Account'
export const USERS_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'user-profile', label: USERS_PROFILE_TAB_LABEL },
  { id: 'user-account', label: USERS_ACCOUNT_TAB_LABEL },
])
export const USERS_PAGE_TAB_REQUIRED_PERMISSIONS: Readonly<Record<UserManagementTabId, readonly string[]>> = Object.freeze({
  'user-profile': USER_PROFILE_PRIVILEGES.view,
  'user-account': ACCOUNT_TYPE_PRIVILEGES.view,
})

export const USERS_PROFILE_FILTER_CARD_TITLE = 'Filter User Profiles'
export const USERS_PROFILE_FILTER_TERM_LABEL = 'Search Term'
export const USERS_PROFILE_FILTER_TERM_PLACEHOLDER = 'Search profile value'
export const USERS_PROFILE_FILTER_FIELDS_LABEL = 'Search Field'
export const USERS_PROFILE_FILTER_STATUS_LABEL = 'Profile Status'
export const USERS_PROFILE_FILTER_APPLY_LABEL = 'Apply Filters'
export const USERS_PROFILE_FILTER_RESET_LABEL = 'Reset'

export const USERS_PROFILE_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'email', label: 'Email' },
  { value: 'fullName', label: 'Full Name' },
])

export const USERS_PROFILE_FILTER_STATUS_OPTIONS = Object.freeze([
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
])

export const USERS_ACCOUNT_FILTER_CARD_TITLE = 'Filter Account Types'
export const USERS_ACCOUNT_FILTER_TERM_LABEL = 'Search Term'
export const USERS_ACCOUNT_FILTER_TERM_PLACEHOLDER = 'Search account type value'
export const USERS_ACCOUNT_FILTER_FIELDS_LABEL = 'Search Field'
export const USERS_ACCOUNT_FILTER_SYSTEM_TYPE_LABEL = 'Account Type'
export const USERS_ACCOUNT_FILTER_APPLY_LABEL = 'Apply Filters'
export const USERS_ACCOUNT_FILTER_RESET_LABEL = 'Reset'

export const USERS_ACCOUNT_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Name' },
  { value: 'description', label: 'Description' },
])

export const USERS_ACCOUNT_FILTER_SYSTEM_TYPE_OPTIONS = Object.freeze([
  { value: '', label: 'All account types' },
  { value: 'system', label: 'System' },
  { value: 'custom', label: 'Custom' },
])

export const USERS_PROFILE_CREATE_BUTTON_LABEL = 'Create User Profile'
export const USERS_ACCOUNT_CREATE_BUTTON_LABEL = 'Create User Account'
export const USERS_MODAL_CREATE_LABEL = 'Create'
export const USERS_MODAL_UPDATE_LABEL = 'Update'
export const USERS_MODAL_CANCEL_LABEL = 'Cancel'

export const USERS_PROFILE_CREATE_MODAL_TITLE = 'Create User Profile'
export const USERS_PROFILE_CREATE_MODAL_DESCRIPTION =
  'Register a new user profile and assign account type access for monitoring operations.'
export const USERS_PROFILE_EMAIL_LABEL = 'Email'
export const USERS_PROFILE_EMAIL_PLACEHOLDER = 'Enter email address'
export const USERS_PROFILE_FULL_NAME_LABEL = 'Full Name'
export const USERS_PROFILE_FULL_NAME_PLACEHOLDER = 'Enter full name'
export const USERS_PROFILE_PERSONNEL_LABEL = 'Personnel'
export const USERS_PROFILE_PERSONNEL_PLACEHOLDER = 'Search personnel by code, Serial Number, or name'
export const USERS_PROFILE_PERSONNEL_HELPER_TEXT = 'Assign personnel to link this user profile to personnel records.'
export const USERS_PROFILE_PERSONNEL_EMPTY_MESSAGE = 'No personnel records found.'
export const USERS_PROFILE_PASSWORD_LABEL = 'Password'
export const USERS_PROFILE_PASSWORD_PLACEHOLDER = 'Set initial password'
export const USERS_PROFILE_CONFIRM_PASSWORD_LABEL = 'Confirm Password'
export const USERS_PROFILE_CONFIRM_PASSWORD_PLACEHOLDER = 'Re-enter password'
export const USERS_PROFILE_AVATAR_LABEL = 'Avatar Upload'
export const USERS_PROFILE_AVATAR_HELPER = 'Upload an optional profile image.'
export const USERS_PROFILE_AVATAR_URL_LABEL = 'Avatar URL'
export const USERS_PROFILE_AVATAR_URL_PLACEHOLDER = 'https://example.com/avatar.jpg'
export const USERS_PROFILE_ACCOUNT_TYPES_LABEL = 'Account Type'
export const USERS_PROFILE_ACCOUNT_TYPES_EMPTY_MESSAGE = 'No account types available. Create an account type first.'
export const USERS_PROFILE_UPDATE_MODAL_TITLE = 'Update User Profile'
export const USERS_PROFILE_UPDATE_MODAL_DESCRIPTION = 'Update profile details and account type assignments.'
export const USERS_PROFILE_PASSWORD_MODAL_TITLE = 'Change User Password'
export const USERS_PROFILE_PASSWORD_MODAL_DESCRIPTION = 'Set a new password for this user profile.'
export const USERS_PROFILE_VIEW_MODAL_TITLE = 'User Profile Details'
export const USERS_PROFILE_VIEW_MODAL_DESCRIPTION = 'Review account details and access assignments.'
export const USERS_PROFILE_GENERATE_PASSWORD_LABEL = 'Generate Password'
export const USERS_PROFILE_VIEW_EMPTY_ACCOUNT_TYPES = 'No account type assigned.'
export const USERS_PROFILE_VIEW_TAB_ARIA_LABEL = 'User profile details tabs'
export const USERS_PROFILE_VIEW_DETAILS_TAB_LABEL = 'Details'
export const USERS_PROFILE_VIEW_ACTIVITIES_TAB_LABEL = 'Activities'
export const USERS_PROFILE_VIEW_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'details', label: USERS_PROFILE_VIEW_DETAILS_TAB_LABEL },
  { id: 'activities', label: USERS_PROFILE_VIEW_ACTIVITIES_TAB_LABEL },
])
export const USERS_PROFILE_VIEW_TAB_REQUIRED_PERMISSIONS: Readonly<Record<UserProfileViewTabId, readonly string[]>> = Object.freeze({
  details: USER_PROFILE_PRIVILEGES.view,
  activities: AUDIT_PRIVILEGES.view,
})
export const USERS_PROFILE_ACTIVITIES_TITLE = 'User Activities'
export const USERS_PROFILE_ACTIVITIES_EMPTY_MESSAGE = 'No activities recorded for this user.'
export const USERS_PROFILE_ACTIVITIES_LOADING_LABEL = 'Loading user activities...'
export const USERS_PROFILE_ACTIVITIES_ERROR_MESSAGE = 'Unable to load user activities.'
export const USERS_MODAL_CLOSE_LABEL = 'Close'
export const USERS_PROFILE_BULK_UPDATE_MODAL_TITLE = 'Update Selected User Profiles'
export const USERS_PROFILE_BULK_UPDATE_MODAL_DESCRIPTION =
  'Apply the same non-unique profile values to every selected user profile.'
export const USERS_PROFILE_BULK_UPDATE_WARNING =
  'Email, full name, personnel assignment, and account type assignment are not changed in bulk. Only checked fields will be updated.'


export const USERS_ACCOUNT_CREATE_MODAL_TITLE = 'Create Account Type'
export const USERS_ACCOUNT_CREATE_MODAL_DESCRIPTION =
  'Define a new account type for user access control and privilege grouping.'
export const USERS_ACCOUNT_UPDATE_MODAL_TITLE = 'Update Account Type'
export const USERS_ACCOUNT_UPDATE_MODAL_DESCRIPTION =
  'Update account type details and assigned privileges.'
export const USERS_ACCOUNT_CODE_LABEL = 'Code'
export const USERS_ACCOUNT_CODE_PLACEHOLDER = 'e.g., company_admin'
export const USERS_ACCOUNT_NAME_LABEL = 'Name'
export const USERS_ACCOUNT_NAME_PLACEHOLDER = 'e.g., Company Administrator'
export const USERS_ACCOUNT_DESCRIPTION_LABEL = 'Description'
export const USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER = 'Add optional account type description'
export const USERS_ACCOUNT_IS_SYSTEM_LABEL = 'System Account Type'
export const USERS_ACCOUNT_IS_SYSTEM_DESCRIPTION = 'Mark this account type as system-managed.'
export const USERS_ACCOUNT_PRIVILEGES_LABEL = 'Privileges'
export const USERS_ACCOUNT_PRIVILEGES_DESCRIPTION = 'Select privileges to include in this account type.'
export const USERS_ACCOUNT_PRIVILEGES_SELECT_ALL_LABEL = 'Select All Privileges'
export const USERS_ACCOUNT_PRIVILEGES_SELECT_ALL_DESCRIPTION = 'Toggle all available privileges in this checklist.'
export const USERS_ACCOUNT_BULK_UPDATE_MODAL_TITLE = 'Update Selected Account Types'
export const USERS_ACCOUNT_BULK_UPDATE_MODAL_DESCRIPTION =
  'Apply the same non-unique account type values to every selected account type.'
export const USERS_ACCOUNT_BULK_UPDATE_WARNING =
  'Unique codes and names, as well as privilege assignments, are not changed in bulk. Only checked fields will be updated.'
export const USERS_ACCOUNT_PRIVILEGES_PLACEHOLDER = 'Type privilege name, code, or module'
export const USERS_ACCOUNT_PRIVILEGES_EMPTY_MESSAGE = 'No privileges are currently available.'
export const USERS_ACCOUNT_PRIVILEGES_CODE_PREFIX = 'Code'

export const USERS_PROFILE_REQUIRED_PERMISSIONS = USER_PROFILE_PRIVILEGES
export const USERS_ACCOUNT_REQUIRED_PERMISSIONS = ACCOUNT_TYPE_PRIVILEGES
