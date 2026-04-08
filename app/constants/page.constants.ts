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
