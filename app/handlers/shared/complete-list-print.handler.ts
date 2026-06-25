import type { Ref } from 'vue'
import { PRINT_DATA_LIST_EMPTY_MESSAGE } from '~/constants/ui.constants'

interface CompleteListPagination {
  page: number
  pageSize: number
  totalItems: number
}

interface CompleteListPrintOptions<TItem> {
  rows: Readonly<Ref<readonly TItem[]>>
  pagination: Readonly<Ref<CompleteListPagination>>
  loadPage: (page: number, pageSize: number) => Promise<void>
  printItems: (items: readonly TItem[]) => unknown
}

export const createCompleteListPrintHandler = <TItem>(
  options: CompleteListPrintOptions<TItem>,
) => {
  return async (): Promise<readonly TItem[]> => {
    const originalPage = options.pagination.value.page
    const originalPageSize = options.pagination.value.pageSize
    const totalItems = options.pagination.value.totalItems

    if (totalItems === 0) {
      throw new Error(PRINT_DATA_LIST_EMPTY_MESSAGE)
    }

    const completeListPageSize = Math.max(totalItems, originalPageSize)

    try {
      await options.loadPage(1, completeListPageSize)
      const completeItems = [...options.rows.value]
      options.printItems(completeItems)
      return completeItems
    } finally {
      if (originalPage !== 1 || originalPageSize !== completeListPageSize) {
        await options.loadPage(originalPage, originalPageSize)
      }
    }
  }
}
