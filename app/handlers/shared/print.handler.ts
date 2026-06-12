import type { PrintDetailFormat, PrintTableFormat } from '~/types/domain/print'
import { printDetailRecord, printTableRecords } from '~/utils/print'

export const createTablePrintHandler = <TItem extends object>(format: PrintTableFormat) => {
  return async (items: readonly TItem[]): Promise<readonly TItem[]> => {
    return printTableRecords(items, format)
  }
}

