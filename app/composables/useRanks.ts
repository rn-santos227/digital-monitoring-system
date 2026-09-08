import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { CreateRankPayload, RankListQuery } from '~/types/domain/rank'
import { useRanksStore } from '~/stores/ranks'

export const useRanks = () => {
  const rankStore = useRanksStore()
  const { items, pagination, isLoading, error, searchTerm } = storeToRefs(rankStore)
  const filters = ref<Partial<RankListQuery>>({})

  const tableRows = computed(() => items.value)

  const loadRanks = async (
    page = pagination.value.page,
    query: Partial<RankListQuery> = filters.value,
    pageSize = pagination.value.pageSize,
  ) => {
    filters.value = { ...query }

    try {
      await rankStore.fetchRanks(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createRank = async (payload: CreateRankPayload) => {
    await rankStore.createRank(payload)
    return await rankStore.createRank(payload)
  }

  const deleteRank = async (id: string) => {
    await rankStore.deleteRank(id)
  }

  return {
    filters,
    search: searchTerm,
    tableRows,
    pagination,
    isLoading,
    error,
    totalItems: computed(() => pagination.value.totalItems),
    loadRanks,
    createRank,
    deleteRank,
  }
}
