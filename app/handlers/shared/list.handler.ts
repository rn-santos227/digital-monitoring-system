import type { Ref } from 'vue'
import type { FieldValidationMap } from '~/utils/field-validation'

interface ValidatedFilters<TFilters extends object> {
  filters: TFilters
  errors: FieldValidationMap
  isValid: boolean
}

interface UseValidatedListHandlersOptions<TFilters extends object> {
  filters: Ref<TFilters>
  validationErrors: Ref<FieldValidationMap>
  applyFilters: (value: TFilters) => ValidatedFilters<TFilters>
  resetFilters: () => TFilters
  loadPage: (
    page?: number,
    filters?: TFilters,
    pageSize?: number,
  ) => Promise<unknown>
  getPageSize?: () => number
  onInvalid?: () => Promise<unknown> | unknown
}

interface UseSearchTermListHandlersOptions {
  searchTerm: Ref<string>
  loadPage: (
    page?: number,
    searchTerm?: string,
    pageSize?: number,
  ) => Promise<unknown>
}

export const useValidatedListHandlers = <TFilters extends object>({
  filters,
  validationErrors,
  applyFilters,
  resetFilters,
  loadPage,
  getPageSize,
  onInvalid,
}: UseValidatedListHandlersOptions<TFilters>) => {
  const handleApplyFilters = async (value: TFilters) => {
    const result = applyFilters(value)
    validationErrors.value = result.errors

    if (!result.isValid) {
      await onInvalid?.()
      return
    }

    await loadPage(1, result.filters)
  }

  const handleResetFilters = async () => {
    validationErrors.value = {}
    const resetFilterValues = resetFilters()
    await loadPage(1, resetFilterValues)
  }

  const handlePageChange = async (page: number) => {
    await loadPage(page, filters.value, getPageSize?.())
  }

  const handlePageSizeChange = async (pageSize: number) => {
    await loadPage(1, filters.value, pageSize)
  }

  return {
    handleApplyFilters,
    handleResetFilters,
    handlePageChange,
    handlePageSizeChange,
  }
}

export const useSearchTermListHandlers = ({
  searchTerm,
  loadPage,
}: UseSearchTermListHandlersOptions) => {
  const handleSearchTermChange = async (value: string | number) => {
    await loadPage(1, String(value ?? ''))
  }

  const handlePageChange = async (page: number) => {
    await loadPage(page, searchTerm.value)
  }

  const handlePageSizeChange = async (pageSize: number) => {
    await loadPage(1, searchTerm.value, pageSize)
  }
}
