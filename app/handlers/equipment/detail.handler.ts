import type { Ref } from 'vue'
import type { EquipmentItemProfileTabId } from '~/types/domain/equipment'

interface UseEquipmentItemDetailHandlersOptions {
  activeTab: Ref<EquipmentItemProfileTabId>
  loadPersonnelUsage: (page?: number, pageSize?: number) => Promise<unknown>
  loadCompanyUsage: (page?: number, pageSize?: number) => Promise<unknown>
  loadBattalionUsage: (page?: number, pageSize?: number) => Promise<unknown>
}
