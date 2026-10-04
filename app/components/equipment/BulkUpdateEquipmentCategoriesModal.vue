<template>
  <BaseModal
    :title="EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_TITLE"
    :description="EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_DESCRIPTION"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="warningMessage || EQUIPMENT_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert
        v-if="errorMessage || validationError"
        :message="errorMessage || validationError"
        tone="danger"
      />
      <div class="space-y-2 rounded-lg border border-slate-200 p-3">
        <BaseCheckbox v-model="enabled.is_active" label="Category status" />
        <BaseCheckbox
          v-model="values.is_active"
          label="Active"
          :disabled="!enabled.is_active"
        />
      </div>
    </form>
    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit"
          >Update {{ selectedCount }} selected
        </BaseButton>
      </div>
    </template>
  </BaseModal>
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
