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
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: EquipmentItemBulkUpdateValues): void
}>()
const enabled = reactive<Record<keyof EquipmentItemBulkUpdateValues, boolean>>({
  category_id: false,
  name: false,
  model: false,
  manufacturer: false,
  description: false,
  unit_of_measure: false,
  minimum_stock_level: false,
  is_serialized: false,
  is_active: false,
})
const values = reactive({
  category_id: '',
  name: '',
  model: null as string | null,
  manufacturer: null as string | null,
  description: null as string | null,
  unit_of_measure: null as string | null,
  minimum_stock_level: 0,
  is_serialized: false,
  is_active: true,
})
type EquipmentItemTextFieldKey = Exclude<
  keyof EquipmentItemBulkUpdateValues,
  'is_serialized' | 'is_active'
>
type EquipmentItemBooleanFieldKey = Extract<
  keyof EquipmentItemBulkUpdateValues,
  'is_serialized' | 'is_active'
>
const setFieldValue = (
  key: EquipmentItemTextFieldKey,
  value: string,
  type?: BulkUpdateField<EquipmentItemTextFieldKey>['type'],
) => {
  const normalizedValue = type === 'number'
    ? (value === '' ? 0 : Number(value))
    : value
  Reflect.set(values, key, normalizedValue)
}
</script>
