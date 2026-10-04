import type { Ref } from 'vue'
import type { TablePaginationState } from '~/constants/ui.constants'

interface LoadMoreCardsOptions<TItem, TFilters extends object> {
  cardRows: Ref<TItem[]>
  tableRows: Readonly<Ref<TItem[]>>
  isLoading: Readonly<Ref<boolean>>
  canLoadMore: Readonly<Ref<boolean>>
  pagination: Readonly<Ref<TablePaginationState>>
  filters: Readonly<Ref<TFilters>>
  loadPage: (page: number, filters: TFilters, pageSize: number) => Promise<unknown>
}

export const createLoadMoreCardsHandler = <TItem, TFilters extends object>({
  cardRows,
  tableRows,
  isLoading,
  canLoadMore,
  pagination,
  filters,
  loadPage,
}: LoadMoreCardsOptions<TItem, TFilters>) => {
  return async (): Promise<void> => {
    if (isLoading.value || !canLoadMore.value) {
      return
    }

    await loadPage(pagination.value.page + 1, filters.value, pagination.value.pageSize)
    cardRows.value = [...cardRows.value, ...tableRows.value]
  }
}
