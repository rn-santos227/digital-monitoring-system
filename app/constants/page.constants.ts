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
import { DEPLOYMENT_STATUS_VALUES, EMPLOYMENT_STATUS_VALUES, SERVICE_STATUS_VALUES, TRAINING_LEVEL_VALUES, TRAINING_STATUS_VALUES } from '~/types/enums'

export const DASHBOARD_PAGE_TITLE = 'Dashboard'
export const DASHBOARD_PAGE_SUBTITLE = 'AFP personnel readiness and equipment handling overview.'

export const DASHBOARD_PAGE_SECTION_CLASSES = 'space-y-6'
export const DASHBOARD_METRICS_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'
export const DASHBOARD_SECONDARY_GRID_CLASSES = 'grid gap-4 xl:grid-cols-2'
export const DASHBOARD_METRIC_VALUE_CLASSES = 'text-3xl font-semibold text-slate-900'
export const DASHBOARD_METRIC_CHANGE_CLASSES = 'mt-1 text-sm text-emerald-600'

export const DASHBOARD_KPI_CARDS = Object.freeze([
  {
    key: 'personnel',
    title: 'Personnel',
    context: 'Total personnel records currently tracked.',
    iconName: 'users',
    tone: 'emerald',
  },
  {
    key: 'battalions',
    title: 'Battalions',
    context: 'Total battalion units currently tracked.',
    iconName: 'shield',
    tone: 'sky',
  },
  {
    key: 'companies',
    title: 'Companies',
    context: 'Total company units currently tracked.',
    iconName: 'building',
    tone: 'violet',
  },
  {
    key: 'account-types',
    title: 'Account Types',
    context: 'Total account types available for RBAC assignments.',
    iconName: 'cog',
    tone: 'amber',
  },
] as const)

export const DASHBOARD_PLACEHOLDER_CARDS = Object.freeze([
  {
    title: 'Pending Personnel Actions',
    subtitle: 'Use shared list/table components for personnel workflows.'
  },
  {
    title: 'Equipment Movement',
    subtitle: 'Use shared cards and tables for issuance and return tracking.'
  }
])

export const AUDIT_PAGE_TITLE = 'Audit Trail'
export const AUDIT_PAGE_SUBTITLE = 'Track recent activity across personnel and equipment monitoring records.'
export const AUDIT_PAGE_SECTION_CLASSES = 'space-y-6'

export const AUDIT_TABLE_TITLE = 'Recent Audit Logs'
export const AUDIT_TABLE_SEARCH_PLACEHOLDER = 'Search audit logs'
export const AUDIT_TABLE_EMPTY_MESSAGE = 'No audit log entries found.'

export const AUDIT_FILTER_CARD_TITLE = 'Filter Audit Logs'
export const AUDIT_FILTER_TERM_LABEL = 'Search Term'
export const AUDIT_FILTER_TERM_PLACEHOLDER = 'Search value'
export const AUDIT_FILTER_FIELDS_LABEL = 'Search Field'
export const AUDIT_FILTER_USER_LABEL = 'Actor Name'
export const AUDIT_FILTER_USER_PLACEHOLDER = 'Search actor name'
export const AUDIT_FILTER_START_DATE_LABEL = 'Start Date'
export const AUDIT_FILTER_END_DATE_LABEL = 'End Date'
export const AUDIT_FILTER_APPLY_LABEL = 'Apply Filters'
export const AUDIT_FILTER_RESET_LABEL = 'Reset'

export const AUDIT_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'action', label: 'Action' },
  { value: 'tableName', label: 'Entity/Table Name' },
  { value: 'recordId', label: 'Record ID' },
  { value: 'ipAddress', label: 'IP Address' },
  { value: 'statusCode', label: 'Status Code' }
])

export const AUDIT_MODAL_TITLE = 'Audit Log Details'
export const AUDIT_MODAL_DESCRIPTION = 'Review request, response, headers, and metadata for this audit record.'
export const AUDIT_MODAL_CLOSE_LABEL = 'Close'
export const AUDIT_MODAL_EMPTY_LOG_MESSAGE = 'No audit log details are available for this record.'
export const AUDIT_MODAL_REQUEST_SECTION_LABEL = 'Request'
export const AUDIT_MODAL_RESPONSE_SECTION_LABEL = 'Response'
export const AUDIT_MODAL_HEADERS_SECTION_LABEL = 'Headers'
export const AUDIT_MODAL_METADATA_SECTION_LABEL = 'Metadata'
export const AUDIT_MODAL_OLD_DATA_SECTION_LABEL = 'Old Data'
export const AUDIT_MODAL_NEW_DATA_SECTION_LABEL = 'New Data'

export const LOGIN_PAGE_BADGE = 'AFP Digital Monitoring System'
export const LOGIN_PAGE_TITLE = 'Digital Personnel and Equipment Monitoring'
export const LOGIN_PAGE_SUBTITLE =
  'Secure access for authorized personnel overseeing battalions, deployments, training records, and equipment issuances.'
export const LOGIN_PAGE_CARD_TITLE = 'Sign In'
export const LOGIN_PAGE_CARD_SUBTITLE = 'Enter your account credentials to access operational monitoring dashboards.'
export const LOGIN_PAGE_EMAIL_LABEL = 'Email'
export const LOGIN_PAGE_EMAIL_PLACEHOLDER = 'Enter your service email'
export const LOGIN_PAGE_PASSWORD_LABEL = 'Password'
export const LOGIN_PAGE_PASSWORD_PLACEHOLDER = 'Enter your password'
export const LOGIN_PAGE_REMEMBER_LABEL = 'Remember this secure device'
export const LOGIN_PAGE_FORGOT_LABEL = 'Forgot password?'
export const LOGIN_PAGE_SIGN_IN_LABEL = 'Sign In'
export const LOGIN_PAGE_SIGN_IN_ERROR_TITLE = 'Sign-in failed'
export const LOGIN_PAGE_SUPPORT_TEXT = 'Need assistance? Contact your battalion system administrator.'
export const LOGIN_PAGE_FOOTER_NOTICE = 'This secure AFP system is for authorized access only.'

export const DASHBOARD_LOGOUT_DIALOG_TITLE = 'Log out from dashboard?'
export const DASHBOARD_LOGOUT_DIALOG_MESSAGE =
  'You are about to end your authenticated session in the Digital AFP Personnel and Equipment Monitoring System.'
export const DASHBOARD_LOGOUT_DIALOG_CONFIRM_LABEL = 'Log out'
export const DASHBOARD_LOGOUT_DIALOG_CANCEL_LABEL = 'Stay signed in'

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
export const PERSONNEL_MODAL_CREATE_LABEL = 'Create'
export const PERSONNEL_MODAL_UPDATE_LABEL = 'Update'
export const PERSONNEL_MODAL_CANCEL_LABEL = 'Cancel'
export const PERSONNEL_CREATE_MODAL_TITLE = 'Create Personnel Record'
export const PERSONNEL_CREATE_MODAL_DESCRIPTION = 'Register a new personnel profile for battalion and company monitoring.'
export const PERSONNEL_CREATE_PERSONNEL_CODE_LABEL = 'Personnel Code'
export const PERSONNEL_CREATE_PERSONNEL_CODE_PLACEHOLDER = 'Enter personnel code'
export const PERSONNEL_CREATE_SERVICE_NUMBER_LABEL = 'Serial Number'
export const PERSONNEL_CREATE_SERVICE_NUMBER_PLACEHOLDER = 'Enter Serial Number'
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
export const PERSONNEL_CREATE_COMPANY_ID_LABEL = 'Company ID'
export const PERSONNEL_CREATE_COMPANY_ID_PLACEHOLDER = 'Enter company id (optional)'
export const PERSONNEL_CREATE_BATTALION_ID_LABEL = 'Battalion ID'
export const PERSONNEL_CREATE_BATTALION_ID_PLACEHOLDER = 'Enter battalion id (optional)'
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

export const PERSONNEL_PROFILE_PAGE_TITLE = 'Personnel Dossier'
export const PERSONNEL_PROFILE_PAGE_SUBTITLE = 'Profile details, assignments, and readiness context for operational review.'
export const PERSONNEL_PROFILE_TABS_ARIA_LABEL = 'Personnel dossier tabs'
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
  { value: 'lastName', label: 'Last Name' },
  { value: 'firstName', label: 'First Name' },
  { value: 'rankName', label: 'Rank' },
])

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
export const USERS_PROFILE_ACCOUNT_TYPES_LABEL = 'Account Types'
export const USERS_PROFILE_ACCOUNT_TYPES_EMPTY_MESSAGE = 'No account types available. Create an account type first.'
export const USERS_PROFILE_UPDATE_MODAL_TITLE = 'Update User Profile'
export const USERS_PROFILE_UPDATE_MODAL_DESCRIPTION = 'Update profile details and account type assignments.'
export const USERS_PROFILE_PASSWORD_MODAL_TITLE = 'Change User Password'
export const USERS_PROFILE_PASSWORD_MODAL_DESCRIPTION = 'Set a new password for this user profile.'
export const USERS_PROFILE_VIEW_MODAL_TITLE = 'User Profile Details'
export const USERS_PROFILE_VIEW_MODAL_DESCRIPTION = 'Review account details and access assignments.'
export const USERS_PROFILE_GENERATE_PASSWORD_LABEL = 'Generate Password'
export const USERS_PROFILE_VIEW_EMPTY_ACCOUNT_TYPES = 'No account type assigned.'
export const USERS_MODAL_CLOSE_LABEL = 'Close'

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
export const USERS_ACCOUNT_PRIVILEGES_PLACEHOLDER = 'Type privilege name, code, or module'
export const USERS_ACCOUNT_PRIVILEGES_EMPTY_MESSAGE = 'No privileges are currently available.'
export const USERS_ACCOUNT_PRIVILEGES_CODE_PREFIX = 'Code'

export const USERS_PROFILE_REQUIRED_PERMISSIONS = USER_PROFILE_PRIVILEGES
export const USERS_ACCOUNT_REQUIRED_PERMISSIONS = ACCOUNT_TYPE_PRIVILEGES

export const TRAINING_PAGE_TITLE = 'Training Management'
export const TRAINING_PAGE_SUBTITLE = 'Monitor training records, training master list, and training categories for readiness planning.'
export const TRAINING_PAGE_SECTION_CLASSES = 'space-y-6'
export const TRAINING_PAGE_KPI_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
export const TRAINING_PAGE_TABS_ARIA_LABEL = 'Training management tabs'
export const TRAINING_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'records', label: 'Records' },
  { id: 'trainings', label: 'Trainings' },
  { id: 'categories', label: 'Categories' },
])

export const TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS: Readonly<Record<TrainingManagementTabId, readonly string[]>> = Object.freeze({
  records: TRAINING_PRIVILEGES.manage,
  trainings: TRAINING_PRIVILEGES.view,
  categories: TRAINING_PRIVILEGES.view,
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
export const TRAININGS_MODAL_UPDATE_LABEL = 'Update'
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
  TRAINING_LEVEL_VALUES.map((value) => ({ label: value, value })),
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

export const DEPLOYMENTS_PAGE_TITLE = 'Deployments Management'
export const DEPLOYMENTS_PAGE_SUBTITLE = 'Monitor deployments and deployment records for active personnel operations.'
export const DEPLOYMENTS_PAGE_SECTION_CLASSES = 'space-y-6'
export const DEPLOYMENTS_PAGE_KPI_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
export const DEPLOYMENTS_PAGE_TABS_ARIA_LABEL = 'Deployments management tabs'
export const DEPLOYMENTS_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'deployments', label: 'Deployments' },
  { id: 'records', label: 'Records' },
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
  { value: '', label: 'All searchable fields' },
  { value: 'operationName', label: 'Operation' },
  { value: 'deploymentArea', label: 'Deployment Area' },
  { value: 'status', label: 'Status' },
])
export const DEPLOYMENTS_CREATE_MODAL_TITLE = 'Create Deployment'
export const DEPLOYMENTS_CREATE_MODAL_DESCRIPTION = 'Register a new deployment profile for operational tracking.'
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

export const DEPLOYMENTS_RECORDS_PENDING_MESSAGE = 'Deployment records tab will be added in the next iteration.'
