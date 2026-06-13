import type { Ref } from 'vue'

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
    const completeListPageSize = Math.max(options.pagination.value.totalItems, originalPageSize)

    try {

    } finally {
      if (originalPage !== 1 || originalPageSize !== completeListPageSize) {
        await options.loadPage(originalPage, originalPageSize)
      }
    }
  }
}
