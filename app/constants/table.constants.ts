import type { DataTableAction, DataTableColumn } from '~/constants/ui.constants'

export const AUDIT_TABLE_TITLE = 'Recent Audit Logs'
export const AUDIT_TABLE_SEARCH_PLACEHOLDER = 'Search audit logs'
export const AUDIT_TABLE_EMPTY_MESSAGE = 'No audit log entries found.'

export const AUDIT_TABLE_COLUMNS: readonly DataTableColumn[] = Object.freeze([
  { key: 'createdAt', label: 'Timestamp', sortable: true },
  { key: 'actor', label: 'Actor', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'tableName', label: 'Entity', sortable: true },
  { key: 'recordId', label: 'Record ID', sortable: true },
  { key: 'ipAddress', label: 'IP Address', sortable: true },
  { key: 'statusCode', label: 'Status Code', sortable: true },
])


