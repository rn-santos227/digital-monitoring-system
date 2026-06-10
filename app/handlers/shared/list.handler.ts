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
}
