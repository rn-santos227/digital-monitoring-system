import type { Ref } from 'vue'
import type { EngagementManagementSearchQuery } from '~/types/domain/engagement'
import { useEngagementSearchHandlers } from './search.handler'

export const useEngagementManagementPageHandlers = (
  engagementFilters: Ref<Partial<EngagementManagementSearchQuery>>,
) => {
  const { handleEngagementFilterApply, handleEngagementFilterReset } =
    useEngagementSearchHandlers(engagementFilters)

  return {
    handleEngagementFilterApply,
    handleEngagementFilterReset,
  }
}
