<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  EQUIPMENT_BULK_UPDATE_WARNING,
  EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_DESCRIPTION,
  EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_TITLE,
} from '~/constants/page.constants'
import type { EquipmentCategoryBulkUpdateValues } from '~/types/domain/equipment'
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
  (event: 'submit', payload: EquipmentCategoryBulkUpdateValues): void
}>()
const enabled = reactive<
  Record<keyof EquipmentCategoryBulkUpdateValues, boolean>
>({ is_active: false })
const values = reactive<Required<EquipmentCategoryBulkUpdateValues>>({
  is_active: true,
})
const validationError = ref('')
const onSubmit = () => {
  const result = validateEquipmentBulkUpdate<EquipmentCategoryBulkUpdateValues>({ enabled, values })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
