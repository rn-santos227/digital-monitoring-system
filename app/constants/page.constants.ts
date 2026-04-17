import type { BaseTabItem, DataTableAction, DataTableColumn } from '~/constants/ui.constants'
import type { DashboardMetric } from '~/types/domain/misc'

export const DASHBOARD_PAGE_TITLE = 'Dashboard'
export const DASHBOARD_PAGE_SUBTITLE = 'AFP personnel readiness and equipment handling overview.'

export const DASHBOARD_PAGE_SECTION_CLASSES = 'space-y-6'
export const DASHBOARD_METRICS_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'
export const DASHBOARD_SECONDARY_GRID_CLASSES = 'grid gap-4 xl:grid-cols-2'
export const DASHBOARD_METRIC_VALUE_CLASSES = 'text-3xl font-semibold text-slate-900'
export const DASHBOARD_METRIC_CHANGE_CLASSES = 'mt-1 text-sm text-emerald-600'

export const DASHBOARD_METRICS: readonly DashboardMetric[] = Object.freeze([
  { label: 'Active Personnel', value: '3,254', change: '+2.1% from last month' },
  { label: 'On Deployment', value: '418', change: '+12 newly assigned this week' },
  { label: 'Equipment Issued', value: '1,126', change: '84 due for return' },
  { label: 'Serviceable Assets', value: '92%', change: '+1.8% readiness improvement' }
])

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

export const AUDIT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'createdAt', label: 'Timestamp', sortable: true },
  { key: 'actor', label: 'Actor', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'tableName', label: 'Entity', sortable: true },
  { key: 'recordId', label: 'Record ID', sortable: true },
  { key: 'ipAddress', label: 'IP Address', sortable: true },
  { key: 'statusCode', label: 'Status Code', sortable: true }
])

export const AUDIT_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view',
    tooltip: 'View audit log',
    iconName: 'eye',
    variant: 'info'
  }
])

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


export const USERS_PAGE_TITLE = 'Users Management'
export const USERS_PAGE_SUBTITLE =
  'Manage AFP monitoring user profiles and account access details in a single operational workspace.'
export const USERS_PAGE_SECTION_CLASSES = 'space-y-6'
export const USERS_PAGE_TABS_ARIA_LABEL = 'Users management tabs'
export const USERS_PROFILE_TAB_LABEL = 'User Profile'
export const USERS_ACCOUNT_TAB_LABEL = 'User Account'
export const USERS_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'user-profile', label: USERS_PROFILE_TAB_LABEL },
  { id: 'user-account', label: USERS_ACCOUNT_TAB_LABEL },
])

export const USERS_PROFILE_TABLE_TITLE = 'User Profiles'
export const USERS_ACCOUNT_TABLE_TITLE = 'User Accounts'
export const USERS_PROFILE_TABLE_EMPTY_MESSAGE = 'No user profile records found.'
export const USERS_ACCOUNT_TABLE_EMPTY_MESSAGE = 'No user account records found.'
export const USERS_PROFILE_TABLE_SEARCH_PLACEHOLDER = 'Search user profiles'
export const USERS_ACCOUNT_TABLE_SEARCH_PLACEHOLDER = 'Search user accounts'
export const USERS_PROFILE_CREATE_BUTTON_LABEL = 'Create User Profile'
export const USERS_ACCOUNT_CREATE_BUTTON_LABEL = 'Create User Account'
export const USERS_MODAL_CREATE_LABEL = 'Create'
export const USERS_MODAL_CANCEL_LABEL = 'Cancel'

export const USERS_PROFILE_CREATE_MODAL_TITLE = 'Create User Profile'
export const USERS_PROFILE_CREATE_MODAL_DESCRIPTION =
  'Register a new user profile and assign account type access for monitoring operations.'
export const USERS_PROFILE_EMAIL_LABEL = 'Email'
export const USERS_PROFILE_EMAIL_PLACEHOLDER = 'Enter email address'
export const USERS_PROFILE_FULL_NAME_LABEL = 'Full Name'
export const USERS_PROFILE_FULL_NAME_PLACEHOLDER = 'Enter full name'
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

export const USERS_ACCOUNT_CREATE_MODAL_TITLE = 'Create Account Type'
export const USERS_ACCOUNT_CREATE_MODAL_DESCRIPTION =
  'Define a new account type for user access control and privilege grouping.'
export const USERS_ACCOUNT_CODE_LABEL = 'Code'
export const USERS_ACCOUNT_CODE_PLACEHOLDER = 'e.g., company_admin'
export const USERS_ACCOUNT_NAME_LABEL = 'Name'
export const USERS_ACCOUNT_NAME_PLACEHOLDER = 'e.g., Company Administrator'
export const USERS_ACCOUNT_DESCRIPTION_LABEL = 'Description'
export const USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER = 'Add optional account type description'
export const USERS_ACCOUNT_IS_SYSTEM_LABEL = 'System Account Type'
export const USERS_ACCOUNT_IS_SYSTEM_DESCRIPTION = 'Mark this account type as system-managed.'
export const USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'
export const USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL = 'Actions'

export const USERS_PROFILE_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'fullName', label: 'Full Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'accountTypes', label: 'Account Types', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastLoginAt', label: 'Last Login', sortable: true },
])

export const USERS_PROFILE_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'edit-user-profile',
    tooltip: 'Edit user profile',
    iconName: 'pencil-square',
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
