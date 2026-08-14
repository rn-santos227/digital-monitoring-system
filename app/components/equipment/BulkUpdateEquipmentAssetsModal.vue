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
</script>
