import { PRINT_DATA_LIST_EMPTY_MESSAGE } from '~/constants/ui.constants'

export class PrintDataListEmptyError extends Error {
  constructor(message = PRINT_DATA_LIST_EMPTY_MESSAGE) {
    super(message)
    this.name = 'PrintDataListEmptyError'
  }
}
