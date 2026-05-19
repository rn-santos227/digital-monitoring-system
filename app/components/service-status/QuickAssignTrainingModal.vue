<template>
  <BaseModal
    title="Quick Assign Training"
    description="Assign the selected personnel to an existing training profile."
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert
        v-if="errorMessage"
        tone="danger"
        :message="errorMessage"
      />

      <TrainingSuggestionField
        v-model="form.training_id"
        label="Training"
        placeholder="Search training profile"
        helper-text="Select a training profile for this personnel assignment."
        :error="errors.training_id"
      />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.certificate_no"
          label="Certificate No"
          :error="errors.certificate_no"
        />
        <BaseDatePicker
          v-model="form.valid_until"
          label="Valid Until"
          :error="errors.valid_until"
        />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        label="Remarks"
        placeholder="Optional training remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Assign</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import TrainingSuggestionField from '~/components/general/TrainingSuggestionField.vue'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'
import { validateQuickAssignTrainingForm } from '~/utils/service-status-validation'

withDefaults(defineProps<{ isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: Omit<CreateTrainingRecordPayload, 'personnelId'>): void
}>()

const form = reactive({
  training_id: '',
  certificate_no: '',
  valid_until: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateQuickAssignTrainingForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}
</script>
