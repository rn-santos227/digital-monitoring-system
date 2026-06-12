import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintBattalionsHandler = () => ({
  printBattalions: createTablePrintHandler<object>(TABLE_PRINT_FORMATS.battalions),
})
