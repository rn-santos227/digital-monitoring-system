export interface RecordPrintedTableAuditRequest {
  tableName: string
  tableLabel?: string | null
  filters?: Record<string, unknown> | null
}

export type AuditSearchOperator = 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith' | 'between'

export interface AuditAdvancedSearchConditionRequest {
  field: string
  operator: AuditSearchOperator
  value: string
  valueTo?: string
}

export interface AuditLogSearchRequest {
  term: string
  fields?: string
  userName: string
  startDate: string
  endDate: string
  conditions: AuditAdvancedSearchConditionRequest[]
  match: 'any' | 'all'
}
