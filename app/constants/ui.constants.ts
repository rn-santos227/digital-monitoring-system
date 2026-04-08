export type UiSize = 'sm' | 'md' | 'lg'

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
  default: 'border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500',
  error: 'border-rose-500 focus-visible:ring-rose-500',
  disabled: 'bg-slate-100 text-slate-400',
  enabled: 'bg-slate-50'
} as const

export const CHECK_CONTROL_CLASSES =
  'h-4 w-4 rounded border-slate-300 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60'
  
export const APP_SIDEBAR_CLASSES = 'flex h-full w-72 flex-col border-r border-slate-200 bg-emerald-900 text-emerald-50'
export const APP_SIDEBAR_SECTION_TITLE_CLASSES = 'px-2 text-xs font-semibold uppercase tracking-wide text-emerald-200/90'
export const APP_SIDEBAR_ITEM_BASE_CLASSES = 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition'
export const APP_SIDEBAR_ITEM_ACTIVE_CLASSES = 'bg-amber-400 text-slate-900 font-semibold'
export const APP_SIDEBAR_ITEM_INACTIVE_CLASSES = 'text-emerald-50 hover:bg-white/10'

export const APP_HEADER_CLASSES = 'sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-emerald-50 px-6'
export const APP_FOOTER_CLASSES = 'border-t border-slate-200 bg-emerald-50 px-6 py-3 text-xs text-slate-500'


export const BASE_MENU_TRIGGER_CLASSES =
  'inline-flex w-full items-center justify-between gap-2 rounded-xl border border-transparent px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
export const BASE_MENU_PANEL_CLASSES = 'absolute z-40 mt-2 min-w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg'
export const BASE_MENU_ITEM_CLASSES = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100'
export const BASE_MENU_ITEM_DEFAULT_CLASSES = 'text-slate-700'
export const BASE_MENU_ITEM_DANGER_CLASSES = 'text-rose-600 hover:bg-rose-50'
