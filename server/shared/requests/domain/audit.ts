export interface RecordPrintedTableAuditRequest {
  tableName: string
  tableLabel?: string | null
  filters?: Record<string, unknown> | null
}

export type AuditSearchOperator = 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith' | 'between'



