import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type {
  CreateEngagementPayload,
  CreateEngagementRecordPayload,
  EngagementManagementSearchQuery,
  EngagementPersonnelListItem,
} from '~/types/domain/engagement'
import { useEngagementsStore } from '~/stores/engagements'

export const useEngagements = () => {
  const engagementsStore = useEngagementsStore()
  const { engagements } = storeToRefs(engagementsStore)
  const filters = ref<Partial<EngagementManagementSearchQuery>>({})

  const tableRows = computed(() => engagements.value.items.map((item) => ({
    id: item.id,
    engagementTitle: item.engagementTitle ?? '—',
    engagementCategoryName: item.engagementCategoryName ?? '—',
    levelName: item.levelName ?? '—',
    statusName: item.statusName ?? '—',
    startDate: item.startDate ?? '—',
    endDate: item.endDate ?? '—',
  })))

  const loadEngagements = async (
    page = engagements.value.pagination.page,
    nextFilters: Partial<EngagementManagementSearchQuery> = filters.value,
    pageSize = engagements.value.pagination.pageSize,
  ) => {
    filters.value = { ...nextFilters }
    await engagementsStore.fetchEngagements(page, filters.value, pageSize)
  }

  return {
    filters,
    tableRows,
    pagination: computed(() => engagements.value.pagination),
    isLoading: computed(() => engagements.value.isLoading),
    error: computed(() => engagements.value.error),
    loadEngagements,
    createEngagement: async (payload: CreateEngagementPayload) => await engagementsStore.createEngagement(payload),
    createEngagementRecord: async (payload: CreateEngagementRecordPayload) => await engagementsStore.createEngagementRecord(payload),
    updateEngagement: async (id: string, payload: CreateEngagementPayload) => await engagementsStore.updateEngagement(id, payload),
    deleteEngagement: async (id: string) => await engagementsStore.deleteEngagement(id),
    getEngagementById: async (id: string) => await engagementsStore.getEngagementById(id),
    getEngagementPersonnel: async (id: string): Promise<EngagementPersonnelListItem[]> => await engagementsStore.fetchEngagementPersonnel(id),
  }
}
