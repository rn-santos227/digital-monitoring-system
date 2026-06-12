import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintUsersHandler = () => ({
  printUserProfiles: createTablePrintHandler<object>(TABLE_PRINT_FORMATS.userProfiles),
})
