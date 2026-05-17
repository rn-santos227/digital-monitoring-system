import type { BaseTabItem } from '~/constants/ui.constants'

export const SERVICE_STATUSES_PAGE_TITLE = 'Service & Employment Status'
export const SERVICE_STATUSES_PAGE_SUBTITLE = 'Track personnel service and employment visibility using a tactical location map and operational list panel.'
export const SERVICE_STATUSES_PAGE_TABS_ARIA_LABEL = 'Service and employment status tabs'
export const SERVICE_STATUSES_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'service-map', label: 'Service Status Tactical Map' },
])

export const SERVICE_STATUS_PAGE_MAIN_CLASSES = 'space-y-6'
export const SERVICE_STATUS_PAGE_HEADER_CLASSES = 'space-y-1'
export const SERVICE_STATUS_PAGE_TITLE_CLASSES = 'text-3xl font-semibold text-slate-900'
export const SERVICE_STATUS_PAGE_SUBTITLE_CLASSES = 'text-sm text-slate-600'
export const SERVICE_STATUS_PAGE_CONTENT_CLASSES = 'space-y-4'
export const SERVICE_STATUS_PAGE_MAP_WRAPPER_CLASSES = 'min-h-[70vh]'
export const SERVICE_STATUS_PAGE_DETAILS_CLASSES = 'rounded-lg border border-slate-200 bg-white'
export const SERVICE_STATUS_PAGE_DETAILS_SUMMARY_CLASSES = 'cursor-pointer px-4 py-3 text-sm font-medium text-slate-700'
export const SERVICE_STATUS_PAGE_DETAILS_BODY_CLASSES = 'p-4 pt-0'
