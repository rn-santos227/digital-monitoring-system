import type { Ref } from 'vue'
import type {
  EngagementManagementSearchQuery,
  EngagementRecordsTabId,
} from '~/types/domain/engagement'
import { useEngagementSearchHandlers } from './search.handler'

const ENGAGEMENT_RECORDS_TAB_IDS: readonly EngagementRecordsTabId[] = [
  'records',
  'engagements',
]

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
