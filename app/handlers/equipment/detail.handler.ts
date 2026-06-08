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

  const onCompanyPageSizeChange = async (pageSize: number) => {
    await loadCompanyUsage(1, pageSize)
  }

  const onBattalionPageChange = async (page: number) => {
    await loadBattalionUsage(page)
  }

  const onBattalionPageSizeChange = async (pageSize: number) => {
    await loadBattalionUsage(1, pageSize)
  }
}
