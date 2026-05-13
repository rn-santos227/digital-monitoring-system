export interface RecordPrintedTableAuditRequest {
  tableName: string
  tableLabel?: string | null
  filters?: Record<string, unknown> | null
}
