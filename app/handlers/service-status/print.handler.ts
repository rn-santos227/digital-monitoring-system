import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintServiceStatusHandler = () => ({
  printServiceStatusPersonnel: createTablePrintHandler<PersonnelLocationItem>(TABLE_PRINT_FORMATS.serviceStatusPersonnel),
})
