import type { BaseTabItem } from '~/constants/ui.constants'

export const SERVICE_STATUSES_PAGE_TITLE = 'Service & Employment Status'
export const SERVICE_STATUSES_PAGE_SUBTITLE = 'Track personnel service and employment visibility using a tactical location map and operational list panel.'
export const SERVICE_STATUSES_PAGE_TABS_ARIA_LABEL = 'Service and employment status tabs'
export const SERVICE_STATUSES_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'service-map', label: 'Service Status Tactical Map' },
])
