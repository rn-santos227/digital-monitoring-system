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

