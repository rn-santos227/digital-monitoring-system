<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { BulkUpdateBooleanField, BulkUpdateField } from '~/constants/ui.constants'
import {
  EQUIPMENT_BULK_UPDATE_WARNING,
  EQUIPMENT_ITEMS_BULK_UPDATE_MODAL_DESCRIPTION,
  EQUIPMENT_ITEMS_BULK_UPDATE_MODAL_TITLE,
} from '~/constants/page.constants'
import type { EquipmentItemBulkUpdateValues } from '~/types/domain/equipment'
import {
  formatBulkUpdateInputValue,
  validateEquipmentBulkUpdate,
} from '~/utils/bulk-management-validation'
withDefaults(
  defineProps<{
    selectedCount: number
    isSubmitting?: boolean
    errorMessage?: string
  }>(),
  { isSubmitting: false, errorMessage: '' },
)

</script>
