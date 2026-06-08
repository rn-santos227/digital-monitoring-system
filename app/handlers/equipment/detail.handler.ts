import type { Ref } from 'vue'
import type { EquipmentItemProfileTabId } from '~/types/domain/equipment'

interface UseEquipmentItemDetailHandlersOptions {
  activeTab: Ref<EquipmentItemProfileTabId>
  loadPersonnelUsage: (page?: number, pageSize?: number) => Promise<unknown>
  loadCompanyUsage: (page?: number, pageSize?: number) => Promise<unknown>
  loadBattalionUsage: (page?: number, pageSize?: number) => Promise<unknown>
}

export const useEquipmentItemDetailHandlers = ({
  activeTab,
  loadPersonnelUsage,
  loadCompanyUsage,
  loadBattalionUsage,
}: UseEquipmentItemDetailHandlersOptions) => {
  const onTabChange = (nextTab: string) => {
    if (nextTab === 'personnel' || nextTab === 'companies' || nextTab === 'battalions') {
      activeTab.value = nextTab
    }
  }

  const onPersonnelPageChange = async (page: number) => {
    await loadPersonnelUsage(page)
  }

  const onPersonnelPageSizeChange = async (pageSize: number) => {
    await loadPersonnelUsage(1, pageSize)
  }

  const onCompanyPageChange = async (page: number) => {
    await loadCompanyUsage(page)
  }
}
