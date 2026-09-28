export const REPORT_CHART_DEFAULT_COLORS = [
  '#0f766e',
  '#2563eb',
  '#7c3aed',
  '#ea580c',
  '#dc2626',
  '#0891b2',
] as const

export const REPORT_TOP_CATEGORY_LIMIT = 5

export const REPORT_PERSONNEL_CHART_SOURCE = 'vw_personnel_profile'

export const REPORT_PERSONNEL_CHART_SELECT_COLUMNS =
  'id, service_status, battalion_name, company_name, sex, created_at'

export const REPORT_EQUIPMENT_ASSET_CHART_SELECT_COLUMNS =
  'id, current_location, procurement_date, created_at, equipment_item:equipment_items(name), serviceability_status:serviceability_statuses(name), asset_status:asset_statuses(name)'
