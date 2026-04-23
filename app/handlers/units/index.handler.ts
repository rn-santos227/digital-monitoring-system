import type { Ref } from 'vue'
import type { UnitManagementTabId } from '~/types/domain/units'

const UNIT_MANAGEMENT_TAB_IDS: readonly UnitManagementTabId[] = ['battalion', 'company']

export const useUnitsPageHandlers = (activeTab: Ref<UnitManagementTabId>) => {
  const handleTabChange = (nextTab: string) => {
    if (UNIT_MANAGEMENT_TAB_IDS.includes(nextTab as UnitManagementTabId)) {
      activeTab.value = nextTab as UnitManagementTabId
    }
  }

  return {
    handleTabChange,
  }
}
