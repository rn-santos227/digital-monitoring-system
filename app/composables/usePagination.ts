import { computed } from 'vue'
import { resolvePaginationPages } from '~/utils/data-table'

export const usePagination = (currentPage: Readonly<{ value: number }>, totalPages: Readonly<{ value: number }>, maxVisiblePages: Readonly<{ value: number }>) => {
  const hasPagination = computed(() => totalPages.value > 1)
  const canGoPrevious = computed(() => currentPage.value > 1)
  const canGoNext = computed(() => currentPage.value < totalPages.value)

  const visiblePages = computed(() => {
    return resolvePaginationPages(currentPage.value, totalPages.value, maxVisiblePages.value)
  })

  return {
    hasPagination,
    canGoPrevious,
    canGoNext,
    visiblePages
  }
}
