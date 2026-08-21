<template>
  <BaseModal
    :title="TRAININGS_BULK_UPDATE_MODAL_TITLE"
    :description="TRAININGS_BULK_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">

    </form>
    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update {{ selectedCount }} selected</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  TRAININGS_BULK_UPDATE_MODAL_DESCRIPTION,
  TRAININGS_BULK_UPDATE_MODAL_TITLE,
  TRAININGS_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { TrainingBulkUpdateValues } from '~/types/domain/training'
import { validateTrainingBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey = keyof TrainingBulkUpdateValues
const fields: readonly { key: FieldKey, label: string, type?: 'date' }[] = Object.freeze([
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'default_remarks', label: 'Default Remarks' },
])

withDefaults(defineProps<{ selectedCount: number, isSubmitting?: boolean, errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: TrainingBulkUpdateValues): void
}>()
const form = reactive<Record<FieldKey, string>>({ start_date: '', end_date: '', default_remarks: '' })
const enabled = reactive<Record<FieldKey, boolean>>({ start_date: false, end_date: false, default_remarks: false })
const validationError = ref('')
const onSubmit = () => {
  const result = validateTrainingBulkUpdate<TrainingBulkUpdateValues>({
    fields: fields.map(field => field.key),
    form,
    enabled,
    dateRange: {
      start: 'start_date',
      end: 'end_date',
    },
  })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
