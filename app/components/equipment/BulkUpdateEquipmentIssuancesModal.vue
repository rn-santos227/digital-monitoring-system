<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { BulkUpdateField } from '~/constants/ui.constants'
import {
  EQUIPMENT_BULK_UPDATE_WARNING,
  EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_DESCRIPTION,
  EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_TITLE,
  EQUIPMENT_ISSUANCES_STATUS_OPTIONS,
} from '~/constants/page.constants'
import type { EquipmentIssuanceBulkUpdateValues } from '~/types/domain/equipment'
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
  (event: 'submit', payload: EquipmentIssuanceBulkUpdateValues): void
}>()
const enabled = reactive<
  Record<keyof EquipmentIssuanceBulkUpdateValues, boolean>
>({
  issued_to_personnel_id: false,
  issued_by_personnel_id: false,
  deployment_id: false,
  issue_date: false,
  expected_return_date: false,
  actual_return_date: false,
  quantity_issued: false,
  status_id: false,
  issued_location: false,
  return_location: false,
  remarks: false,
})
const values = reactive({
  issued_to_personnel_id: '',
  issued_by_personnel_id: '',
  deployment_id: null as string | null,
  issue_date: '',
  expected_return_date: null as string | null,
  actual_return_date: null as string | null,
  quantity_issued: 1,
  status_id: '',
  issued_location: null as string | null,
  return_location: null as string | null,
  remarks: null as string | null,
})
const setFieldValue = (
  key: keyof EquipmentIssuanceBulkUpdateValues,
  value: string,
  type?: BulkUpdateField<keyof EquipmentIssuanceBulkUpdateValues>['type'],
) => {
  const normalizedValue = type === 'number'
    ? (value === '' ? null : Number(value))
    : value
  Reflect.set(values, key, normalizedValue)
}
const fields: readonly BulkUpdateField<keyof EquipmentIssuanceBulkUpdateValues>[] = [
  { key: 'issued_to_personnel_id', label: 'Issued to personnel' },
  { key: 'issued_by_personnel_id', label: 'Issued by personnel' },
]
</script>
