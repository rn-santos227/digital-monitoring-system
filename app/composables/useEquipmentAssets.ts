import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentAssetsStore } from '~/stores/equipment'
import type { EquipmentAssetSearchQuery, EquipmentAssetTableRow } from '~/types/domain/equipment'
import { hasEquipmentAssetSearchFilters } from '~/utils/equipment-endpoints'


