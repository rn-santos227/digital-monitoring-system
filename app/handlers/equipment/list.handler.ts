import type { Ref } from 'vue'

interface ValidatedFilterResult<TFilters extends object> {
  filters: TFilters
  isValid: boolean
}

type FilterApplyResult<TFilters extends object> =
  | TFilters
  | ValidatedFilterResult<TFilters>

