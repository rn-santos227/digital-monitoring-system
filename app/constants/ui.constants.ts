import type { LoginPageThemeStyle, KpiToneStyle, IconName } from '~/types/domain/misc'

export type UiSize = 'sm' | 'md' | 'lg'
export type UiTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'
export type UiVariant =  'primary' | 'secondary' | 'ghost' | 'danger' | 'info' | 'warning' | 'success'
export type KpiTone = 'emerald' | 'sky' | 'violet' | 'amber'

export const KPI_TONE_STYLES: Record<KpiTone, KpiToneStyle> = {
  emerald: {
    iconWrapper: 'bg-emerald-100',
    icon: 'text-emerald-700',
    context: 'text-emerald-600',
  },
  sky: {
    iconWrapper: 'bg-sky-100',
    icon: 'text-sky-700',
    context: 'text-sky-700',
  },
  violet: {
    iconWrapper: 'bg-violet-100',
    icon: 'text-violet-700',
    context: 'text-violet-700',
  },
  amber: {
    iconWrapper: 'bg-amber-100',
    icon: 'text-amber-700',
    context: 'text-amber-700',
  },
}

export interface BaseTabItem {
  id: string
  label: string
  disabled?: boolean
  iconName?: IconName
}

export type ListViewMode = 'table' | 'card'

export const LIST_VIEW_MODE_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'table', label: 'Table View', iconName: 'table-cells' },
  { id: 'card', label: 'Card View', iconName: 'squares' },
])

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  dataType?: 'text' | 'date'
}

export interface DataTableAction {
  key: string
  tooltip: string
  iconName?: import('~/types/domain/misc').IconName
  variant?: UiVariant
}

export interface SuggestionFieldOption {
  value: string
  label: string
  description?: string
}

export interface BaseGeoMapPin {
  id?: string | number
  latitude: number
  longitude: number
  label?: string
}

export const UI_SIZE_LABELS: Record<UiSize, string> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg'
}

export const FIELD_LABEL_CLASSES = 'text-sm font-medium text-slate-700'
export const FIELD_REQUIRED_MARKER_CLASSES = 'text-rose-600'
export const FIELD_HELPER_TEXT_CLASSES = 'text-sm text-slate-500'
export const FIELD_ERROR_TEXT_CLASSES = 'text-sm text-rose-600'
export const BASE_IMAGE_CLASSES = 'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-600'
export const BASE_IMAGE_FALLBACK_CLASSES = 'font-medium uppercase'
export const BASE_IMAGE_ELEMENT_CLASSES = 'h-full w-full object-cover'

export const FORM_CONTROL_BASE_CLASSES =
  'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2'

export const FORM_CONTROL_STATE_CLASSES = {
  default: 'border-slate-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500',
  error: 'border-rose-500 focus-visible:ring-rose-500',
  disabled: 'bg-slate-100 text-slate-400',
  enabled: 'bg-slate-50'
} as const

export const CHECK_CONTROL_CLASSES =
 'h-4 w-4 rounded border-slate-300 accent-emerald-600 text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60'

export const BASE_CHIP_CLASSES = 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium'
export const BASE_CHIP_TONE_CLASSES: Record<UiTone, string> = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
  success: 'border-emerald-200 bg-emerald-600 text-white',
  warning: 'border-amber-300 bg-amber-400 text-slate-900',
  danger: 'border-rose-200 bg-rose-100 text-rose-700',
  info: 'border-sky-200 bg-sky-100 text-sky-700'
}

export const BASE_TAB_LIST_CLASSES = 'inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1'
export const BASE_TAB_ITEM_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60'
export const BASE_TAB_ICON_ONLY_CLASSES = 'h-9 w-9 px-0 py-0'
export const BASE_TAB_ACTIVE_CLASSES = 'bg-white text-slate-900 shadow-sm'
export const BASE_TAB_INACTIVE_CLASSES = 'text-slate-600 hover:text-slate-900'

export const BASE_VIEW_TOGGLE_LIST_CLASSES = 'inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1'
export const BASE_VIEW_TOGGLE_BUTTON_CLASSES =
  'inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60'
export const BASE_VIEW_TOGGLE_ACTIVE_CLASSES = 'bg-white text-emerald-700 shadow-sm'
export const BASE_VIEW_TOGGLE_INACTIVE_CLASSES = 'text-slate-500 hover:bg-white/70'
export const BASE_VIEW_TOGGLE_ICON_CLASSES = 'h-5 w-5 stroke-2'

export const BASE_TABLE_WINDOW_WRAPPER_CLASSES = 'w-full rounded-xl border border-slate-200 bg-slate-50 p-4'
export const BASE_TABLE_HEADING_CLASSES = 'text-lg font-semibold text-slate-900'
export const BASE_TABLE_SEARCH_WRAPPER_CLASSES = 'max-w-sm'
export const BASE_TABLE_SCROLL_CLASSES = 'w-full overflow-x-auto rounded-lg border border-slate-200 bg-white'
export const BASE_TABLE_CLASSES = 'min-w-full border-collapse text-left text-sm text-slate-700'
export const BASE_TABLE_HEAD_CLASSES = 'border-b border-slate-200 bg-slate-50 text-slate-700'
export const BASE_TABLE_HEAD_CELL_CLASSES = 'px-3 py-2.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap'
export const BASE_TABLE_ROW_CLASSES = 'border-b border-slate-200 last:border-b-0 hover:bg-slate-50/70'
export const BASE_TABLE_BODY_CELL_CLASSES = 'px-3 py-2.5 align-middle whitespace-nowrap'
export const BASE_TABLE_ACTIONS_CELL_CLASSES = 'px-3 py-2.5 text-right'
export const BASE_TABLE_EMPTY_STATE_CLASSES = 'px-4 py-6 text-center text-slate-500'

export const BASE_TABLE_PAGINATION_WRAPPER_CLASSES = 'mt-3 flex flex-col gap-3 text-sm text-slate-600 xl:flex-row xl:items-center xl:justify-between'
export const BASE_TABLE_PAGINATION_STATUS_CLASSES = 'space-y-1'
export const BASE_TABLE_PAGINATION_CONTROLS_CLASSES = 'flex flex-wrap items-center gap-3'
export const BASE_TABLE_PAGINATION_BUTTONS_CLASSES = 'flex items-center gap-1'

export const BASE_TABLE_ACTIONS_COLUMN_WIDTH_CLASSES = Object.freeze({
  1: 'w-14',
  2: 'w-24',
  3: 'w-32',
  4: 'w-40'
})

export const APP_SIDEBAR_CLASSES = 'sticky top-0 flex h-screen w-72 flex-col'

export const APP_SIDEBAR_THEME_CLASSES = Object.freeze({
  light: 'border-r border-emerald-800 bg-emerald-950 text-emerald-50',
  dark: 'border-r border-slate-800 bg-slate-950 text-slate-100',
  amber: 'border-r border-amber-800 bg-amber-950 text-amber-50',
  azure: 'border-r border-sky-800 bg-sky-950 text-sky-50',
  emerald: 'border-r border-emerald-800 bg-emerald-950 text-emerald-50',
  brown: 'border-r border-orange-800 bg-orange-950 text-orange-50',
} as const)

export const APP_SIDEBAR_SECTION_TITLE_CLASSES = 'px-2 text-xs font-semibold uppercase tracking-wide'

export const APP_SIDEBAR_ITEM_BASE_CLASSES = 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition'
export const APP_SIDEBAR_ITEM_THEME_CLASSES = Object.freeze({
  light: { sectionTitle: 'text-emerald-300/90', active: 'bg-emerald-500 text-emerald-950 font-semibold', inactive: 'text-emerald-50 hover:bg-white/10' },
  dark: { sectionTitle: 'text-slate-300/90', active: 'bg-slate-200 text-slate-950 font-semibold', inactive: 'text-slate-100 hover:bg-white/10' },
  amber: { sectionTitle: 'text-amber-300/90', active: 'bg-amber-400 text-amber-950 font-semibold', inactive: 'text-amber-50 hover:bg-white/10' },
  azure: { sectionTitle: 'text-sky-300/90', active: 'bg-sky-400 text-sky-950 font-semibold', inactive: 'text-sky-50 hover:bg-white/10' },
  emerald: { sectionTitle: 'text-emerald-300/90', active: 'bg-emerald-500 text-emerald-950 font-semibold', inactive: 'text-emerald-50 hover:bg-white/10' },
  brown: { sectionTitle: 'text-orange-300/90', active: 'bg-orange-400 text-orange-950 font-semibold', inactive: 'text-orange-50 hover:bg-white/10' },
} as const)

export const APP_HEADER_CLASSES = 'sticky top-0 z-20 flex h-16 items-center justify-between px-6'
export const APP_FOOTER_CLASSES = 'px-6 py-3 text-xs'
export const APP_SURFACE_THEME_CLASSES = Object.freeze({
  light: 'border-emerald-900/50 bg-emerald-100 text-emerald-900',
  dark: 'border-slate-800/80 bg-slate-900 text-slate-100',
  amber: 'border-amber-900/50 bg-amber-100 text-amber-900',
  azure: 'border-sky-900/40 bg-sky-100 text-sky-900',
  emerald: 'border-emerald-900/50 bg-emerald-100 text-emerald-900',
  brown: 'border-orange-900/50 bg-orange-100 text-orange-900',
} as const)

export const LOGIN_PAGE_THEME_CLASSES = Object.freeze({
  light: {
    brandPanel: 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50',
    brandOverlay: 'bg-emerald-500/20',
    formPanel: 'bg-emerald-50/80',
    forgotLink: 'text-emerald-700 hover:text-emerald-900 focus-visible:ring-emerald-500',
    badge: 'bg-white/10 text-emerald-100',
    description: 'text-emerald-100/95',
    securityIcon: 'text-emerald-100',
    securityText: 'text-emerald-50',
    footerNotice: 'text-emerald-100/80',
  },
  dark: {
    brandPanel: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100',
    brandOverlay: 'bg-slate-400/20',
    formPanel: 'bg-slate-100',
    forgotLink: 'text-slate-700 hover:text-slate-900 focus-visible:ring-slate-500',
    badge: 'bg-white/10 text-slate-200',
    description: 'text-slate-200/95',
    securityIcon: 'text-slate-200',
    securityText: 'text-slate-100',
    footerNotice: 'text-slate-300/90',
  },
  amber: {
    brandPanel: 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50',
    brandOverlay: 'bg-amber-500/20',
    formPanel: 'bg-amber-50/80',
    forgotLink: 'text-amber-700 hover:text-amber-900 focus-visible:ring-amber-500',
    badge: 'bg-white/10 text-amber-100',
    description: 'text-amber-100/95',
    securityIcon: 'text-amber-100',
    securityText: 'text-amber-50',
    footerNotice: 'text-amber-100/80',
  },
  azure: {
    brandPanel: 'bg-gradient-to-b from-sky-950 via-sky-900 to-sky-950 text-sky-50',
    brandOverlay: 'bg-sky-500/20',
    formPanel: 'bg-sky-50/80',
    forgotLink: 'text-sky-700 hover:text-sky-900 focus-visible:ring-sky-500',
    badge: 'bg-white/10 text-sky-100',
    description: 'text-sky-100/95',
    securityIcon: 'text-sky-100',
    securityText: 'text-sky-50',
    footerNotice: 'text-sky-100/80',
  },
  emerald: {
    brandPanel: 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50',
    brandOverlay: 'bg-emerald-500/20',
    formPanel: 'bg-emerald-50/80',
    forgotLink: 'text-emerald-700 hover:text-emerald-900 focus-visible:ring-emerald-500',
    badge: 'bg-white/10 text-emerald-100',
    description: 'text-emerald-100/95',
    securityIcon: 'text-emerald-100',
    securityText: 'text-emerald-50',
    footerNotice: 'text-emerald-100/80',
  },
  brown: {
    brandPanel: 'bg-gradient-to-b from-orange-950 via-orange-900 to-orange-950 text-orange-50',
    brandOverlay: 'bg-orange-500/20',
    formPanel: 'bg-orange-50/80',
    forgotLink: 'text-orange-700 hover:text-orange-900 focus-visible:ring-orange-500',
    badge: 'bg-white/10 text-orange-100',
    description: 'text-orange-100/95',
    securityIcon: 'text-orange-100',
    securityText: 'text-orange-50',
    footerNotice: 'text-orange-100/80',
  },
} as const satisfies Record<string, LoginPageThemeStyle>)

export const BASE_MENU_TRIGGER_CLASSES =
  'inline-flex w-full items-center justify-between gap-2 rounded-xl border border-transparent px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600'
export const BASE_MENU_PANEL_CLASSES = 'absolute z-40 mt-2 min-w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg'
export const BASE_MENU_ITEM_CLASSES = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100'
export const BASE_MENU_ITEM_DEFAULT_CLASSES = 'text-slate-700'
export const BASE_MENU_ITEM_DANGER_CLASSES = 'text-rose-600 hover:bg-rose-50'

export const BASE_ACCORDION_ROOT_CLASSES = 'rounded-xl border border-slate-200 bg-white'
export const BASE_ACCORDION_TRIGGER_CLASSES =
  'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-50'
export const BASE_ACCORDION_CONTENT_CLASSES = 'border-t border-slate-200 px-4 py-3'
export const BASE_ACCORDION_ICON_CLASSES = 'transition-transform duration-200 ease-out'
export const BASE_ACCORDION_ICON_OPEN_CLASSES = 'rotate-180'
export const BASE_ACCORDION_TRANSITION_ENTER_ACTIVE_CLASSES = 'transition-all duration-200 ease-out'
export const BASE_ACCORDION_TRANSITION_ENTER_FROM_CLASSES = 'opacity-0 -translate-y-1'
export const BASE_ACCORDION_TRANSITION_ENTER_TO_CLASSES = 'opacity-100 translate-y-0'
export const BASE_ACCORDION_TRANSITION_LEAVE_ACTIVE_CLASSES = 'transition-all duration-150 ease-in'
export const BASE_ACCORDION_TRANSITION_LEAVE_FROM_CLASSES = 'opacity-100 translate-y-0'
export const BASE_ACCORDION_TRANSITION_LEAVE_TO_CLASSES = 'opacity-0 -translate-y-1'

export const BASE_ALERT_CLASSES = 'rounded-xl border px-4 py-3 text-sm'
export const BASE_ALERT_TONE_CLASSES: Record<UiTone, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700'
}

export const SERVICE_STATUS_PERSONNEL_TABLE_CARD_CLASSES = 'overflow-hidden'
export const SERVICE_STATUS_PERSONNEL_TABLE_HEADER_CLASSES = 'border-b border-slate-200 px-4 py-3'
export const SERVICE_STATUS_PERSONNEL_TABLE_TITLE_CLASSES = 'text-sm font-semibold text-slate-800'
export const SERVICE_STATUS_PERSONNEL_TABLE_SUBTITLE_CLASSES = 'mt-1 text-xs text-slate-500'
export const SERVICE_STATUS_PERSONNEL_TABLE_SCROLL_CLASSES = 'max-h-72 overflow-auto'
export const SERVICE_STATUS_PERSONNEL_TABLE_CLASSES = 'min-w-full divide-y divide-slate-200 text-xs'
export const SERVICE_STATUS_PERSONNEL_TABLE_HEAD_CLASSES = 'bg-slate-50 text-left uppercase tracking-wide text-slate-500'
export const SERVICE_STATUS_PERSONNEL_TABLE_TH_CLASSES = 'px-4 py-2'
export const SERVICE_STATUS_PERSONNEL_TABLE_BODY_CLASSES = 'divide-y divide-slate-100'
export const SERVICE_STATUS_PERSONNEL_TABLE_ROW_CLASSES = 'cursor-pointer hover:bg-slate-50'
export const SERVICE_STATUS_PERSONNEL_TABLE_CELL_PRIMARY_CLASSES = 'px-4 py-2 font-medium text-slate-700'
export const SERVICE_STATUS_PERSONNEL_TABLE_CELL_CLASSES = 'px-4 py-2 text-slate-600'

export const SERVICE_STATUS_TACTICAL_CARD_CLASSES = 'p-4'
export const SERVICE_STATUS_TACTICAL_HEADER_CLASSES = 'mb-3 flex items-center justify-between'
export const SERVICE_STATUS_TACTICAL_TITLE_CLASSES = 'text-sm font-semibold text-slate-800'
export const SERVICE_STATUS_TACTICAL_SUBTITLE_CLASSES = 'text-xs text-slate-500'
export const SERVICE_STATUS_TACTICAL_MAP_CLASSES = 'relative z-0 h-[72vh] min-h-[560px] overflow-hidden rounded-lg border border-slate-200 bg-slate-900'
export const SERVICE_STATUS_TACTICAL_GRID_CLASSES = 'absolute inset-0 h-full w-full'
export const SERVICE_STATUS_TACTICAL_PIN_BUTTON_CLASSES = 'absolute -translate-x-1/2 -translate-y-full'
export const SERVICE_STATUS_TACTICAL_PIN_WRAPPER_CLASSES = 'relative block'
export const SERVICE_STATUS_TACTICAL_PIN_ICON_CLASSES = 'h-10 w-8'
export const SERVICE_STATUS_TACTICAL_PIN_BADGE_CLASSES = 'absolute -right-1 -top-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white'
export const SERVICE_STATUS_TACTICAL_PANEL_CLASSES = 'absolute right-4 top-4 z-10 max-h-[calc(100%-2rem)] w-80 overflow-y-auto rounded-lg border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur'
export const SERVICE_STATUS_TACTICAL_PANEL_TITLE_CLASSES = 'text-sm font-semibold text-slate-800'
export const SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES = 'mt-3 text-xs text-slate-500'
export const SERVICE_STATUS_TACTICAL_PANEL_VALUE_PRIMARY_CLASSES = 'text-sm font-medium text-slate-800'
export const SERVICE_STATUS_TACTICAL_PANEL_VALUE_CLASSES = 'text-sm text-slate-800'
export const SERVICE_STATUS_TACTICAL_CLUSTER_CLASSES = 'absolute bottom-4 left-4 z-20 w-72 rounded-md border border-slate-200 bg-white p-3 shadow'
export const SERVICE_STATUS_TACTICAL_CLUSTER_TITLE_CLASSES = 'mb-2 text-xs font-semibold uppercase text-slate-500'
export const SERVICE_STATUS_TACTICAL_CLUSTER_LIST_CLASSES = 'space-y-1'
export const SERVICE_STATUS_TACTICAL_CLUSTER_BUTTON_CLASSES = 'w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-100'

export const BASE_GEO_MAP_CONTAINER_CLASSES = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
export const BASE_GEO_MAP_HEADER_CLASSES = 'mb-3 flex items-center justify-between gap-3'
export const BASE_GEO_MAP_TITLE_CLASSES = 'text-sm font-semibold text-slate-900'
export const BASE_GEO_MAP_SUBTITLE_CLASSES = 'text-xs text-slate-500'
export const BASE_GEO_MAP_LINK_CLASSES = 'text-xs font-medium text-blue-600 transition hover:text-blue-700'
export const BASE_GEO_MAP_FRAME_WRAPPER_CLASSES = 'relative z-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100'
export const BASE_GEO_MAP_FRAME_CLASSES = 'h-104 w-full'
export const BASE_GEO_MAP_EMPTY_STATE_CLASSES =
  'flex h-104 w-full items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-500'
export const BASE_GEO_MAP_META_WRAPPER_CLASSES = 'mt-3 space-y-2 text-xs text-slate-600'
export const BASE_GEO_MAP_META_VALUE_CLASSES = 'font-medium text-slate-800'
export const BASE_GEO_MAP_META_COUNT_CLASSES = 'font-semibold text-slate-800'

export const SUGGESTION_FIELD_CONTAINER_CLASSES = 'relative'
export const SUGGESTION_FIELD_PANEL_CLASSES = 'absolute z-30 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg'
export const SUGGESTION_FIELD_PANEL_POSITION_CLASSES = Object.freeze({
  bottom: 'top-full mt-1',
  top: 'bottom-full mb-1',
})
export const SUGGESTION_FIELD_ITEM_CLASSES = 'w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100'
export const SUGGESTION_FIELD_ITEM_ACTIVE_CLASSES = 'bg-emerald-50 text-emerald-800'
export const SUGGESTION_FIELD_EMPTY_CLASSES = 'px-3 py-2 text-sm text-slate-500'

export const PRINT_DATA_LIST_BUTTON_TOOLTIP = 'Print data'
export const PRINT_DATA_LIST_BUTTON_ARIA_LABEL = 'Print data list'
export const PRINT_DATA_LIST_BUTTON_LABEL = 'Print'
export const PRINT_DATA_LIST_LOADING_TOOLTIP = 'Loading complete list for printing'
export const PRINT_DATA_LIST_LOADING_ARIA_LABEL = 'Loading complete data list for printing'
export const PRINT_DATA_LIST_LOADING_LABEL = 'Preparing'
export const PRINT_DATA_LIST_EMPTY_TITLE = 'No records to print'
export const PRINT_DATA_LIST_EMPTY_MESSAGE = 'Printing is only available when the selected table or list has at least one record.'
export const PRINT_DATA_LIST_ERROR_TITLE = 'Print unavailable'
export const PRINT_DATA_LIST_ERROR_MESSAGE = 'Unable to prepare the selected table or list for printing.'
