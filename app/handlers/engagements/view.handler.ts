import type { Ref } from 'vue'
import type { EngagementManagementListItem, EngagementPersonnelListItem } from '~/types/domain/engagement'

interface UseViewEngagementHandlerOptions {
  selectedEngagement: Ref<EngagementManagementListItem | null>
  engagementPersonnelRows: Ref<Record<string, unknown>[]>
  isViewEngagementModalOpen: Ref<boolean>
  getEngagementById: (id: string) => Promise<EngagementManagementListItem>
  getEngagementPersonnel: (id: string) => Promise<EngagementPersonnelListItem[]>
}

const mapPersonnelRows = (personnelItems: EngagementPersonnelListItem[]): Record<string, unknown>[] => {
  return personnelItems.map(item => ({
    personnelCode: item.personnelCode ?? '—',
    serviceNumber: item.serviceNumber ?? '—',
    fullName: item.fullName ?? '—',
    rankName: item.rankName ?? '—',
    serviceStatus: item.serviceStatus ?? '—',
  }))
}

export const useViewEngagementHandler = ({
  selectedEngagement,
  engagementPersonnelRows,
  isViewEngagementModalOpen,
  getEngagementById,
  getEngagementPersonnel,
}: UseViewEngagementHandlerOptions) => {
  const onOpenViewEngagementModal = async (id: string) => {
    selectedEngagement.value = await getEngagementById(id)
    const personnelItems = await getEngagementPersonnel(id)
    engagementPersonnelRows.value = mapPersonnelRows(personnelItems)
    isViewEngagementModalOpen.value = true
  }

  const onCloseViewEngagementModal = () => {
    isViewEngagementModalOpen.value = false
  }

  return {
    onOpenViewEngagementModal,
    onCloseViewEngagementModal,
  }
}
