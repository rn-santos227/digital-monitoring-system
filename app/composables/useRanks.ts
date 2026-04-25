import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { CreateRankPayload } from '~/types/domain/rank'
import { useRanksStore } from '~/stores/ranks'

export const useRanks = () => {
  const rankStore = useRanksStore()
  const { items, pagination, isLoading, error, searchTerm } = storeToRefs(rankStore)

  const tableRows = computed(() => items.value)

  const loadRanks = async (page = pagination.value.page, queryTerm = searchTerm.value) => {
    try {
      await rankStore.fetchRanks(page, queryTerm)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createRank = async (payload: CreateRankPayload) => {
    await rankStore.createRank(payload)
  }

  const deleteRank = async (id: string) => {
    await rankStore.deleteRank(id)
  }

  return {
    search: searchTerm,
    tableRows,
    pagination,
    isLoading,
    error,
    loadRanks,
    createRank,
    deleteRank,
  }
}
