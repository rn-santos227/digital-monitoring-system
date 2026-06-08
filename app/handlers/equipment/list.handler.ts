import type { Ref } from 'vue'

interface ValidatedFilterResult<TFilters extends object> {
  filters: TFilters
  isValid: boolean
}

type FilterApplyResult<TFilters extends object> =
  | TFilters
  | ValidatedFilterResult<TFilters>

interface UseEquipmentListHandlersOptions<TFilters extends object> {
  filters: Ref<TFilters>
  loadPage: (
    page?: number,
    filters?: TFilters,
    pageSize?: number,
  ) => Promise<unknown>
  handleFilterApply: (value: TFilters) => FilterApplyResult<TFilters>
  handleFilterReset: () => TFilters
}

const isValidatedFilterResult = <TFilters extends object>(
  result: FilterApplyResult<TFilters>,
): result is ValidatedFilterResult<TFilters> => {
  return 'filters' in result && 'isValid' in result
}

export const useEquipmentListHandlers = <TFilters extends object>({
  filters,
  loadPage,
  handleFilterApply,
  handleFilterReset,
}: UseEquipmentListHandlersOptions<TFilters>) => {
  const onApply = async (value: TFilters) => {
    const result = handleFilterApply(value)

    if (isValidatedFilterResult(result) && !result.isValid) {
      return
    }

    const nextFilters = isValidatedFilterResult(result)
      ? result.filters
      : result

    await loadPage(1, nextFilters)
  }

  const onReset = async () => {
    const resetFilters = handleFilterReset()
    await loadPage(1, resetFilters)
  }

  const onPageChange = async (page: number) => {
    await loadPage(page)
  }
}
