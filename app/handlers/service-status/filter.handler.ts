import type { Ref } from 'vue'

export interface ServiceStatusPersonnelFilter {
  term?: string
  fields?: string
}

export const useServiceStatusFilterHandlers = (
  personnelFilter: Ref<ServiceStatusPersonnelFilter>,
) => {
  const onApplyPersonnelFilter = (value: ServiceStatusPersonnelFilter) => {
    personnelFilter.value = {
      term: value.term ?? '',
      fields: value.fields ?? '',
    }
  }

  const onResetPersonnelFilter = () => {
    personnelFilter.value = {}
  }

  return {
    onApplyPersonnelFilter,
    onResetPersonnelFilter,
  }
}
