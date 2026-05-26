import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentItemsStore } from '~/stores/equipment'
import type { EquipmentItemSearchQuery, EquipmentItemTableRow } from '~/types/domain/equipment'
import { hasEquipmentItemSearchFilters } from '~/utils/equipment-endpoints'

export const useEquipmentItems = () => {

}
