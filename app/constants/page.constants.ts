import type { DataTableAction, DataTableColumn } from '~/constants/ui.constants'
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
export const AUDIT_TABLE_SEARCH_PLACEHOLDER = 'Search actor, action, table, or record ID'
export const AUDIT_TABLE_EMPTY_MESSAGE = 'No audit log entries found.'

export const AUDIT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'createdAt', label: 'Timestamp', sortable: true },
  { key: 'actor', label: 'Actor', sortable: true },
  { key: 'tableName', label: 'Entity', sortable: true },
  { key: 'recordId', label: 'Record ID', sortable: true }
])

export const AUDIT_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  {
    key: 'view',
    tooltip: 'View audit log',
    iconName: 'eye',
    variant: 'ghost'
  }
])

export const AUDIT_MODAL_TITLE = 'Audit Log Details'
export const AUDIT_MODAL_DESCRIPTION = 'Review request, response, headers, and metadata for this audit record.'
export const AUDIT_MODAL_CLOSE_LABEL = 'Close'
export const AUDIT_MODAL_EMPTY_LOG_MESSAGE = 'No audit log details are available for this record.'
export const AUDIT_MODAL_REQUEST_SECTION_LABEL = 'Request'
export const AUDIT_MODAL_RESPONSE_SECTION_LABEL = 'Response'
export const AUDIT_MODAL_HEADERS_SECTION_LABEL = 'Headers'
export const AUDIT_MODAL_METADATA_SECTION_LABEL = 'Metadata'

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
export const LOGIN_PAGE_SUPPORT_TEXT = 'Need assistance? Contact your battalion system administrator.'
export const LOGIN_PAGE_FOOTER_NOTICE = 'This secure AFP system is for authorized access only.'

export const DASHBOARD_LOGOUT_DIALOG_TITLE = 'Log out from dashboard?'
export const DASHBOARD_LOGOUT_DIALOG_MESSAGE =
  'You are about to end your authenticated session in the Digital AFP Personnel and Equipment Monitoring System.'
export const DASHBOARD_LOGOUT_DIALOG_CONFIRM_LABEL = 'Log out'
export const DASHBOARD_LOGOUT_DIALOG_CANCEL_LABEL = 'Stay signed in'
