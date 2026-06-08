import type { Ref } from 'vue'

interface ValidatedFilterResult<TFilters extends object> {
  filters: TFilters
  isValid: boolean
}

