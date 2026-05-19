<template>

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
