import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { EngagementManagementSearchQuery } from '~/types/domain/engagement'
import { useEngagementsStore } from '~/stores/engagements'

export const useEngagementRecords = () => {
  const engagementsStore = useEngagementsStore()
  const { records } = storeToRefs(engagementsStore)
  const filters = ref<Partial<EngagementManagementSearchQuery>>({})

  const tableRows = computed(() => records.value.items.map((item) => ({
    id: item.id,
    recordNo: item.recordNo ?? '—',
    personnelName: item.personnelName ?? '—',
    engagementTitle: item.engagementTitle ?? '—',
    engagementCategoryName: item.engagementCategoryName ?? '—',
    levelName: item.levelName ?? '—',
    statusName: item.statusName ?? '—',
    startDate: item.startDate ?? '—',
    endDate: item.endDate ?? '—',
  })))

  const loadEngagementRecords = async (
    page = records.value.pagination.page,
    nextFilters: Partial<EngagementManagementSearchQuery> = filters.value,
    pageSize = records.value.pagination.pageSize,
  ) => {
    filters.value = { ...nextFilters }
    await engagementsStore.fetchEngagementRecords(page, filters.value, pageSize)
  }

  return {
    filters,
    tableRows,
    pagination: computed(() => records.value.pagination),
    isLoading: computed(() => records.value.isLoading),
    error: computed(() => records.value.error),
    loadEngagementRecords,
  }
}
