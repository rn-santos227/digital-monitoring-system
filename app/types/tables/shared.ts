export type UUID = string
export type ISODate = string
export type ISODateTime = string

export interface TableShape<Row, Insert, Update> {
  Row: Row
  Insert: Insert
  Update: Update
}

export type AuditColumns = {
  created_at: ISODateTime
  updated_at: ISODateTime
  created_by: UUID | null
}

export type AuditInsert = {
  created_at?: ISODateTime
  updated_at?: ISODateTime
  created_by: UUID | null
}

export const AUDIT_MODAL_CONTENT_CLASSES = 'space-y-4'
export const AUDIT_MODAL_SUMMARY_GRID_CLASSES = 'grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2'
export const AUDIT_MODAL_SUMMARY_LABEL_CLASSES = 'text-xs font-semibold uppercase tracking-wide text-slate-500'
export const AUDIT_MODAL_SUMMARY_VALUE_CLASSES = 'mt-1 text-sm text-slate-800'
export const AUDIT_MODAL_CODE_BLOCK_CLASSES =
  'max-h-64 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-emerald-100'
