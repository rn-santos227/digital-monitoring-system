import type { BaseTabItem } from '~/constants/ui.constants'
import {
  LEVEL_VALUES,
  ENGAGEMENT_TYPE_VALUES,
  ENGAGEMENT_STATUS_VALUES,
} from '~/types/enums'
export const ENGAGEMENT_RECORDS_PAGE_TITLE = 'Engagement Records Management'
export const ENGAGEMENT_RECORDS_PAGE_SUBTITLE = 'Monitor engagement records and operation participation across personnel.'
export const ENGAGEMENT_RECORDS_PAGE_SECTION_CLASSES = 'space-y-6'
export const ENGAGEMENT_RECORDS_PAGE_TABS_ARIA_LABEL = 'Engagement records management tabs'
export const ENGAGEMENT_RECORDS_PAGE_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'records', label: 'Records' },
  { id: 'engagements', label: 'Engagements' },
])
export const ENGAGEMENT_RECORDS_PAGE_TAB_REQUIRED_PERMISSIONS = Object.freeze({
  engagements: Object.freeze(['engagement.manage']),
  records: Object.freeze(['engagement.manage']),
})

export const ENGAGEMENT_CREATE_TYPE_OPTIONS = Object.freeze([
  ...ENGAGEMENT_TYPE_VALUES.map((value) => ({ value, label: value })),
])

export const ENGAGEMENT_CREATE_LEVEL_OPTIONS = Object.freeze([
  ...LEVEL_VALUES.map((value) => ({ value, label: value })),
])

export const ENGAGEMENT_CREATE_STATUS_OPTIONS = Object.freeze([
  ...ENGAGEMENT_STATUS_VALUES.map((value) => ({ value, label: value })),
])

export const ENGAGEMENTS_FILTER_CARD_TITLE = 'Filter Engagement Records'
export const ENGAGEMENTS_FILTER_TERM_LABEL = 'Search Term'
export const ENGAGEMENTS_FILTER_TERM_PLACEHOLDER = 'Search engagement record value'
export const ENGAGEMENTS_FILTER_FIELDS_LABEL = 'Search Field'
export const ENGAGEMENTS_FILTER_APPLY_LABEL = 'Apply Filters'
export const ENGAGEMENTS_FILTER_RESET_LABEL = 'Reset'
export const ENGAGEMENTS_FILTER_FIELD_OPTIONS = Object.freeze([
  { value: '', label: 'All searchable fields' },
  { value: 'engagementTitle', label: 'Engagement Title' },
  { value: 'recordNo', label: 'Record No' },
  { value: 'personnelName', label: 'Personnel' }]
)

export const ENGAGEMENT_RECORDS_UPDATE_MODAL_TITLE = 'Update Engagement Record'
export const ENGAGEMENT_RECORDS_UPDATE_MODAL_DESCRIPTION = 'Update personnel engagement record details.'
export const ENGAGEMENT_RECORDS_VIEW_MODAL_TITLE = 'Engagement Record'
export const ENGAGEMENT_RECORDS_VIEW_MODAL_DESCRIPTION = 'Review personnel engagement record details.'
export const ENGAGEMENT_RECORDS_VIEW_MODAL_CLOSE_LABEL = 'Close'
export const ENGAGEMENT_RECORDS_ENGAGEMENT_LABEL = 'Engagement'
export const ENGAGEMENT_RECORDS_ENGAGEMENT_PLACEHOLDER = 'Search engagement profile'
export const ENGAGEMENT_RECORDS_ENGAGEMENT_HELPER_TEXT = 'Select an engagement profile to link this personnel record.'
export const ENGAGEMENT_RECORDS_PERSONNEL_LABEL = 'Personnel'
export const ENGAGEMENT_RECORDS_PERSONNEL_PLACEHOLDER = 'Search personnel code or name'
export const ENGAGEMENT_RECORDS_PERSONNEL_HELPER_TEXT = 'Select personnel assigned to this engagement record.'
export const ENGAGEMENT_RECORDS_ROLE_LABEL = 'Role'
export const ENGAGEMENT_RECORDS_LOCATION_LABEL = 'Location'
export const ENGAGEMENT_RECORDS_START_DATE_LABEL = 'Start Date'
export const ENGAGEMENT_RECORDS_END_DATE_LABEL = 'End Date'
export const ENGAGEMENT_RECORDS_REMARKS_LABEL = 'Remarks'
export const ENGAGEMENT_RECORDS_REMARKS_PLACEHOLDER = 'Optional engagement remarks'
export const ENGAGEMENT_CALENDAR_ERROR_MESSAGE = 'Unable to fetch engagement calendar events.'
