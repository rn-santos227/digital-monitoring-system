import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { CalendarEventsQuery } from '~/types/domain/calendar'
import type {
  CreateEngagementPayload,
  CreateEngagementRecordPayload,
  EngagementManagementSearchQuery,
  EngagementPersonnelListItem,
} from '~/types/domain/engagement'
import { useEngagementsStore } from '~/stores/engagements'

export const useEngagements = () => {
  const engagementsStore = useEngagementsStore()
  const { engagements, kpis, calendar } = storeToRefs(engagementsStore)
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

  onMounted(() => {
    void engagementsStore.fetchEngagementManagementKpisOnce().catch(() => {})
  })

  const loadEngagementCalendarEvents = async (query: CalendarEventsQuery) => {
    return await engagementsStore.fetchEngagementCalendarEvents(query)
  }

  return {
    filters,
    tableRows,
    kpis,
    pagination: computed(() => engagements.value.pagination),
    isLoading: computed(() => engagements.value.isLoading),
    error: computed(() => engagements.value.error),
    calendarEvents: computed(() => calendar.value.items),
    calendarIsLoading: computed(() => calendar.value.isLoading),
    calendarError: computed(() => calendar.value.error),
    loadEngagements,
    createEngagement: async (payload: CreateEngagementPayload) => await engagementsStore.createEngagement(payload),
    createEngagementRecord: async (payload: CreateEngagementRecordPayload) => await engagementsStore.createEngagementRecord(payload),
    updateEngagement: async (id: string, payload: CreateEngagementPayload) => await engagementsStore.updateEngagement(id, payload),
    deleteEngagement: async (id: string) => await engagementsStore.deleteEngagement(id),
    loadEngagementCalendarEvents,
    getEngagementById: async (id: string) => await engagementsStore.getEngagementById(id),
    getEngagementPersonnel: async (id: string): Promise<EngagementPersonnelListItem[]> => await engagementsStore.fetchEngagementPersonnel(id),
    getEngagementRecordById: async (id: string) => await engagementsStore.getEngagementRecordById(id),
    updateEngagementRecord: async (id: string, payload: CreateEngagementRecordPayload) => await engagementsStore.updateEngagementRecord(id, payload),
    deleteEngagementRecord: async (id: string) => await engagementsStore.deleteEngagementRecord(id),
  }
}
