export const DASHBOARD_PAGE_TITLE = 'Dashboard'
export const DASHBOARD_PAGE_SUBTITLE = 'AFP personnel readiness and equipment handling overview.'

export const DASHBOARD_PAGE_SECTION_CLASSES = 'space-y-6'
export const DASHBOARD_METRICS_GRID_CLASSES = 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'
export const DASHBOARD_SECONDARY_GRID_CLASSES = 'grid gap-4 xl:grid-cols-2'
export const DASHBOARD_METRIC_VALUE_CLASSES = 'text-3xl font-semibold text-slate-900'
export const DASHBOARD_METRIC_CHANGE_CLASSES = 'mt-1 text-sm text-emerald-600'

export const DASHBOARD_KPI_CARDS = Object.freeze([
  { key: 'personnel', title: 'Personnel', context: 'Total personnel records currently tracked.', iconName: 'users', tone: 'emerald' },
  { key: 'battalions', title: 'Battalions', context: 'Total battalion units currently tracked.', iconName: 'shield', tone: 'sky' },
  { key: 'companies', title: 'Companies', context: 'Total company units currently tracked.', iconName: 'building', tone: 'violet' },
  { key: 'account-types', title: 'Account Types', context: 'Total account types available for RBAC assignments.', iconName: 'cog', tone: 'amber' },
] as const)

export const DASHBOARD_PLACEHOLDER_CARDS = Object.freeze([
  { title: 'Pending Personnel Actions', subtitle: 'Use shared list/table components for personnel workflows.' },
  { title: 'Equipment Movement', subtitle: 'Use shared cards and tables for issuance and return tracking.' }
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
export const LOGIN_PAGE_SUBTITLE = 'Secure access for authorized personnel overseeing battalions, deployments, training records, and equipment issuances.'
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
export const DASHBOARD_LOGOUT_DIALOG_MESSAGE = 'You are about to end your authenticated session in the Digital AFP Personnel and Equipment Monitoring System.'
export const DASHBOARD_LOGOUT_DIALOG_CONFIRM_LABEL = 'Log out'
export const DASHBOARD_LOGOUT_DIALOG_CANCEL_LABEL = 'Stay signed in'
