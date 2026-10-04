import type { PrintDetailFormat, PrintTableFormat } from '~/types/domain/print'
import { printDetailRecord, printTableRecords } from '~/utils/print'
import type { Ref } from 'vue'

export const createTablePrintHandler = <TItem extends object>(format: PrintTableFormat) => {
  return async (items: readonly TItem[]): Promise<readonly TItem[]> => {
    return printTableRecords(items, format)
  }
}

export const createDetailPrintHandler = <TItem extends object>(format: PrintDetailFormat) => {
  return async (item: TItem | null): Promise<TItem> => {
    if (!item) {
      throw new Error(`${format.documentTitle} is not available for printing.`)
    }

    return printDetailRecord(item, format)
  }
}

export const createCurrentValuePrintHandler = <T, TResult>(
  value: Readonly<Ref<T>>,
  printValue: (value: T) => TResult,
) => {
  return (): TResult => printValue(value.value)
}
