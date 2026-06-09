import type { Ref } from 'vue'

export const useRanksPageHandlers = (activeTab: Ref<'personnel-records' | 'rank-management'>) => {
  const handleRankTabChange = (nextTab: string) => {
    activeTab.value = nextTab === 'rank-management' ? 'rank-management' : 'personnel-records'
  }

  return {
    handleRankTabChange,
  }
}

export const useRankTableActionHandler = (
  onDeleteRank: (id: string) => Promise<unknown>,
) => {
  const onRankTableAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: { id: string }
  }) => {
    if (actionKey === 'delete-rank') {
      await onDeleteRank(row.id)
    }
  }

  return {
    onRankTableAction,
  }
}
