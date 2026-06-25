import { PRINT_DATA_LIST_EMPTY_MESSAGE } from '~/constants/ui.constants'

export class PrintDataListEmptyError extends Error {
  constructor(message = PRINT_DATA_LIST_EMPTY_MESSAGE) {
    super(message)
    this.name = 'PrintDataListEmptyError'
  }
}

export const createPrintDataListEmptyError = (): PrintDataListEmptyError => {
  return new PrintDataListEmptyError()
}

export const isPrintDataListEmptyError = (error: unknown): error is PrintDataListEmptyError => {
  return error instanceof PrintDataListEmptyError || (
    error instanceof Error && error.name === 'PrintDataListEmptyError'
  )
}
