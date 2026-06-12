import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import type { EngagementManagementListItem } from '~/types/domain/engagement'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintEngagementsHandler = () => ({
  printEngagements: createTablePrintHandler<EngagementManagementListItem>(TABLE_PRINT_FORMATS.engagements),
  printEngagementRecords: createTablePrintHandler<EngagementManagementListItem>(TABLE_PRINT_FORMATS.engagementRecords),
})
