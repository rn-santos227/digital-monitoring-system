export type UiSize = 'sm' | 'md' | 'lg'
export type UiTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export interface BaseTabItem {
  id: string
  label: string
  disabled?: boolean
}

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface DataTableAction {
  key: string
  tooltip: string
  iconName?: import('~/types/domain/misc').IconName
  variant?: 'ghost' | 'danger' | 'info' | 'warning'
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

export const FORM_CONTROL_BASE_CLASSES =
  'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2'

export const FORM_CONTROL_STATE_CLASSES = {
  default: 'border-slate-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500',
  error: 'border-rose-500 focus-visible:ring-rose-500',
  disabled: 'bg-slate-100 text-slate-400',
  enabled: 'bg-slate-50'
} as const

export const CHECK_CONTROL_CLASSES =
  'h-4 w-4 rounded border-slate-300 text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60'

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
  'rounded-xl px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60'
export const BASE_TAB_ACTIVE_CLASSES = 'bg-white text-slate-900 shadow-sm'
export const BASE_TAB_INACTIVE_CLASSES = 'text-slate-600 hover:text-slate-900'

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

export const BASE_TABLE_PAGINATION_WRAPPER_CLASSES = 'mt-3 flex items-center justify-between gap-3 text-sm text-slate-600'
export const BASE_TABLE_PAGINATION_BUTTONS_CLASSES = 'flex items-center gap-1'

export const BASE_TABLE_ACTIONS_COLUMN_WIDTH_CLASSES = Object.freeze({
  1: 'w-14',
  2: 'w-24',
  3: 'w-32',
  4: 'w-40'
})

export const APP_SIDEBAR_CLASSES = 'sticky top-0 flex h-screen w-72 flex-col border-r border-emerald-800 bg-emerald-950 text-emerald-50'
export const APP_SIDEBAR_SECTION_TITLE_CLASSES = 'px-2 text-xs font-semibold uppercase tracking-wide text-emerald-300/90'
export const APP_SIDEBAR_ITEM_BASE_CLASSES = 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition'
export const APP_SIDEBAR_ITEM_ACTIVE_CLASSES = 'bg-emerald-500 text-emerald-950 font-semibold'
export const APP_SIDEBAR_ITEM_INACTIVE_CLASSES = 'text-emerald-50 hover:bg-white/10'

export const APP_HEADER_CLASSES = 'sticky top-0 z-20 flex h-16 items-center justify-between border-b border-emerald-900/50 bg-emerald-100 px-6'
export const APP_FOOTER_CLASSES = 'border-t border-emerald-900/50 bg-emerald-100 px-6 py-3 text-xs text-emerald-900'

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

export const BASE_ALERT_CLASSES = 'rounded-xl border px-4 py-3 text-sm'
export const BASE_ALERT_TONE_CLASSES: Record<UiTone, string> = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700'
}
