import type { Ref } from 'vue'
import type { PersonnelSearchQuery } from '~/types/domain/personnel'
import { usePersonnelSearchHandlers } from './search.handler'

export const usePersonnelPageHandlers = (filters: Ref<Partial<PersonnelSearchQuery>>) => {
  const { handleFilterApply, handleFilterReset } = usePersonnelSearchHandlers(filters)
  return {
    handleFilterApply,
    handleFilterReset,
  }
}
