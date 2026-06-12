import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import type { RankListItem } from '~/types/domain/rank'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintRanksHandler = () => ({
  printRanks: createTablePrintHandler<RankListItem>(TABLE_PRINT_FORMATS.ranks),
})
