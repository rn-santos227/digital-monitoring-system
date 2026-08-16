<template>
  <BaseModal
    :title="EQUIPMENT_ITEMS_BULK_UPDATE_MODAL_TITLE"
    :description="EQUIPMENT_ITEMS_BULK_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="EQUIPMENT_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert
        v-if="errorMessage || validationError"
        :message="errorMessage || validationError"
        tone="danger"
      />
      <div
        v-for="field in textFields"
        :key="field.key"
        class="space-y-2 rounded-lg border border-slate-200 p-3"
      >
        <BaseCheckbox v-model="enabled[field.key]" :label="field.label" />
        <EquipmentCategoriesSuggestionField
          v-if="field.key === 'category_id'"
          v-model="values.category_id"
          :disabled="!enabled.category_id"
        />
        <BaseTextField
          v-else
          :model-value="formatBulkUpdateInputValue(values[field.key])"
          :label="field.label"
          :type="field.type"
          @update:model-value="setFieldValue(field.key, $event, field.type)"
          :disabled="!enabled[field.key]"
        />
      </div>
      <div
        v-for="field in booleanFields"
        :key="field.key"
        class="space-y-2 rounded-lg border border-slate-200 p-3"
      >
        <BaseCheckbox v-model="enabled[field.key]" :label="field.label" />
        <BaseCheckbox
          v-model="values[field.key]"
          :label="field.valueLabel"
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
type EquipmentItemTextInputType = 'text' | 'number'
type EquipmentItemBooleanFieldKey = Extract<
  keyof EquipmentItemBulkUpdateValues,
  'is_serialized' | 'is_active'
>

const setFieldValue = (
  key: EquipmentItemTextFieldKey,
  value: string,
  type?: BulkUpdateField<
    EquipmentItemTextFieldKey,
    EquipmentItemTextInputType
  >['type'],
) => {
  const normalizedValue = type === 'number'
    ? (value === '' ? 0 : Number(value))
    : value
  Reflect.set(values, key, normalizedValue)
}

const textFields: readonly BulkUpdateField<
  EquipmentItemTextFieldKey,
  EquipmentItemTextInputType
>[] = [
  { key: 'category_id', label: 'Equipment category' },
  { key: 'name', label: 'Item name' },
  { key: 'model', label: 'Model' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'description', label: 'Description' },
  { key: 'unit_of_measure', label: 'Unit of measure' },
  { key: 'minimum_stock_level', label: 'Minimum stock level', type: 'number' },
]
const booleanFields: readonly BulkUpdateBooleanField<EquipmentItemBooleanFieldKey>[] = [
  {
    key: 'is_serialized',
    label: 'Serialization',
    valueLabel: 'Serialized item',
  },
  { key: 'is_active', label: 'Item status', valueLabel: 'Active' },
]
const validationError = ref('')
const onSubmit = () => {
  const result = validateEquipmentBulkUpdate<EquipmentItemBulkUpdateValues>({
    enabled,
    values,
    requiredFields: ['category_id', 'name'],
    numericFields: ['minimum_stock_level'],
  })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
