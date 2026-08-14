<template>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  EQUIPMENT_ASSETS_ASSET_STATUS_OPTIONS,
  EQUIPMENT_ASSETS_BULK_UPDATE_MODAL_DESCRIPTION,
  EQUIPMENT_ASSETS_BULK_UPDATE_MODAL_TITLE,
  EQUIPMENT_ASSETS_CONDITION_STATUS_OPTIONS,
  EQUIPMENT_ASSETS_SERVICEABILITY_STATUS_OPTIONS,
  EQUIPMENT_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { EquipmentAssetBulkUpdateValues } from '~/types/domain/equipment'
import { validateEquipmentBulkUpdate } from '~/utils/bulk-management-validation'
withDefaults(
  defineProps<{
    selectedCount: number
    isSubmitting?: boolean
    errorMessage?: string
  }>(),
  { isSubmitting: false, errorMessage: '' },
)
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: EquipmentAssetBulkUpdateValues): void
}>()
const enabled = reactive<Record<keyof EquipmentAssetBulkUpdateValues, boolean>>(
  {
    equipment_item_id: false,
    batch_no: false,
    procurement_date: false,
    acquisition_cost: false,
    fund_source: false,
    current_location: false,
    condition_status_id: false,
    serviceability_status_id: false,
    asset_status_id: false,
    remarks: false,
  },
)
const values = reactive({
  equipment_item_id: '',
  batch_no: null as string | null,
  procurement_date: null as string | null,
  acquisition_cost: null as number | null,
  fund_source: null as string | null,
  current_location: null as string | null,
  condition_status_id: null as string | null,
  serviceability_status_id: null as string | null,
  asset_status_id: '',
  remarks: null as string | null,
})
const fields = [
  { key: 'equipment_item_id', label: 'Equipment item' },
  { key: 'batch_no', label: 'Batch number' },
  { key: 'procurement_date', label: 'Procurement date', type: 'date' },
  { key: 'acquisition_cost', label: 'Acquisition cost', type: 'number' },
  { key: 'fund_source', label: 'Fund source' },
  { key: 'current_location', label: 'Current location' },
  {
    key: 'condition_status_id',
    label: 'Condition status',
    options: EQUIPMENT_ASSETS_CONDITION_STATUS_OPTIONS,
  },
]
</script>
