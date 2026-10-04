<template>
  <BaseModal
    :title="EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_TITLE"
    :description="EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <form class="grid gap-4 md:grid-cols-2" @submit.prevent="onSubmit">
      <BaseAlert class="md:col-span-2" :message="warningMessage || EQUIPMENT_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert
        v-if="errorMessage || validationError"
        class="md:col-span-2"
        :message="errorMessage || validationError"
        tone="danger"
      />
      <div
        v-for="field in fields"
        :key="field.key"
        class="space-y-2 rounded-lg border border-slate-200 p-3"
      >
        <BaseCheckbox v-model="enabled[field.key]" :label="field.label" />
        <BaseCheckbox v-model="enabled[field.key]" :label="field.label" />
        <PersonnelSuggestionField
          v-if="
            field.key === 'issued_to_personnel_id' ||
            field.key === 'issued_by_personnel_id'
          "
          :model-value="formatBulkUpdateInputValue(values[field.key])"
          @update:model-value="setFieldValue(field.key, $event, field.type)"
          :label="field.label"
          :disabled="!enabled[field.key]"
        />
        <DeploymentSuggestionField
          v-else-if="field.key === 'deployment_id'"
          :model-value="formatBulkUpdateInputValue(values.deployment_id)"
          :disabled="!enabled.deployment_id"
          @update:model-value="setFieldValue('deployment_id', $event)"
        />
        <BaseDatePicker
          v-else-if="field.type === 'date'"
          :model-value="formatBulkUpdateInputValue(values[field.key])"
          @update:model-value="setFieldValue(field.key, $event, field.type)"
          :label="field.label"
          :disabled="!enabled[field.key]"
        />
        <BaseSelect
          v-else-if="field.options"
          :model-value="formatBulkUpdateInputValue(values[field.key])"
          @update:model-value="setFieldValue(field.key, $event, field.type)"
          :label="field.label"
          :options="field.options"
          :disabled="!enabled[field.key]"
        />
        <BaseTextField
          v-else
          :model-value="formatBulkUpdateInputValue(values[field.key])"
          @update:model-value="setFieldValue(field.key, $event, field.type)"
          :label="field.label"
          :type="field.type"
          :disabled="!enabled[field.key]"
        />
      </div>
    </form>
    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">
          Update {{ selectedCount }} selected
        </BaseButton>
      </div>
    </template>
  </BaseModal>
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
import { formatBulkUpdateInputValue, validateEquipmentBulkUpdate } from '~/utils/bulk-management-validation'

withDefaults(
  defineProps<{
    selectedCount: number
    isSubmitting?: boolean
    errorMessage?: string
    warningMessage?: string
  }>(),
  {
    isSubmitting: false,
    errorMessage: '',
    warningMessage: '',
  },
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
  value: string | null,
  type?: BulkUpdateField<keyof EquipmentIssuanceBulkUpdateValues>['type'],
) => {
  const normalizedValue = type === 'number'
    ? (value === null || value === '' ? null : Number(value))
    : value
  Reflect.set(values, key, normalizedValue)
}

const fields: readonly BulkUpdateField<keyof EquipmentIssuanceBulkUpdateValues>[] = [
  { key: 'issued_to_personnel_id', label: 'Issued to personnel' },
  { key: 'issued_by_personnel_id', label: 'Issued by personnel' },
  { key: 'deployment_id', label: 'Deployment' },
  { key: 'issue_date', label: 'Issue date', type: 'date' },
  { key: 'expected_return_date', label: 'Expected return date', type: 'date' },
  { key: 'actual_return_date', label: 'Actual return date', type: 'date' },
  { key: 'quantity_issued', label: 'Quantity issued', type: 'number' },
  {
    key: 'status_id',
    label: 'Issuance status',
    options: EQUIPMENT_ISSUANCES_STATUS_OPTIONS,
  },
  { key: 'issued_location', label: 'Issued location' },
  { key: 'return_location', label: 'Return location' },
  { key: 'remarks', label: 'Remarks' },
]
const validationError = ref('')
const onSubmit = () => {
  const result = validateEquipmentBulkUpdate<EquipmentIssuanceBulkUpdateValues>({
    enabled,
    values,
    requiredFields: [
      'issued_to_personnel_id',
      'issued_by_personnel_id',
      'issue_date',
      'status_id',
    ],
    numericFields: ['quantity_issued'],
  })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
