import type { Ref } from 'vue'
import { useEngagementsStore } from '~/stores/engagements'
import type { EngagementManagementSearchQuery } from '~/types/domain/engagement'

interface UseEngagementListLoadHandlersOptions {
  engagementsStore: ReturnType<typeof useEngagementsStore>
  engagementsFilters: Ref<Partial<EngagementManagementSearchQuery>>
  engagementRecordsFilters: Ref<Partial<EngagementManagementSearchQuery>>
}

export const useEngagementListLoadHandlers = ({
  engagementsStore,
  engagementsFilters,
  engagementRecordsFilters,
}: UseEngagementListLoadHandlersOptions) => {
  const loadEngagements = async (page = 1, pageSize?: number) => {
    await engagementsStore.fetchEngagements(page, engagementsFilters.value, pageSize)
  }

  const loadEngagementRecords = async (page = 1, pageSize?: number) => {
    await engagementsStore.fetchEngagementRecords(page, engagementRecordsFilters.value, pageSize)
  }

  return {
    loadEngagements,
    loadEngagementRecords,
  }
}
