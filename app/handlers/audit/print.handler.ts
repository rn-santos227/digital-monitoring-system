import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import type { AuditLogTableRow } from '~/types/domain/audit'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintAuditHandler = () => ({
  printAuditLogs: createTablePrintHandler<AuditLogTableRow>(TABLE_PRINT_FORMATS.auditLogs),
})
