<template>
  <BaseModal
    :title="TRAINING_RECORDS_UPDATE_MODAL_TITLE"
    :description="TRAINING_RECORDS_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert
        v-if="warningMessage"
        :message="warningMessage"
        tone="warning"
      />
      <BaseAlert
        v-if="errorMessage"
        :message="errorMessage"
        tone="danger"
      />

      <div class="grid gap-4 md:grid-cols-2">
        <TrainingSuggestionField
          v-model="form.trainingId"
          :label="TRAINING_RECORDS_CREATE_TRAINING_LABEL"
          :placeholder="TRAINING_RECORDS_CREATE_TRAINING_PLACEHOLDER"
          :helper-text="TRAINING_RECORDS_CREATE_TRAINING_HELPER_TEXT"
          :error="errors.trainingId"
        />
        <PersonnelSuggestionField
          v-model="form.personnelId"
          :label="TRAINING_RECORDS_CREATE_PERSONNEL_LABEL"
          :placeholder="TRAINING_RECORDS_CREATE_PERSONNEL_PLACEHOLDER"
          :helper-text="TRAINING_RECORDS_CREATE_PERSONNEL_HELPER_TEXT"
          :error="errors.personnelId"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.certificateNo"
          :label="TRAINING_RECORDS_CREATE_CERTIFICATE_NO_LABEL"
          :placeholder="TRAINING_RECORDS_CREATE_CERTIFICATE_NO_PLACEHOLDER"
          :error="errors.certificateNo"
        />

        <BaseDatePicker
          v-model="form.validUntil"
          :label="TRAINING_RECORDS_CREATE_VALID_UNTIL_LABEL"
          :error="errors.validUntil"
        />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        :label="TRAINING_RECORDS_CREATE_REMARKS_LABEL"
        :placeholder="TRAINING_RECORDS_CREATE_REMARKS_PLACEHOLDER"
        :error="errors.remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ TRAININGS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ TRAININGS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import TrainingSuggestionField from '~/components/general/TrainingSuggestionField.vue'
import {
  TRAINING_RECORDS_CREATE_CERTIFICATE_NO_LABEL,
  TRAINING_RECORDS_CREATE_CERTIFICATE_NO_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_PERSONNEL_HELPER_TEXT,
  TRAINING_RECORDS_CREATE_PERSONNEL_LABEL,
  TRAINING_RECORDS_CREATE_PERSONNEL_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_REMARKS_LABEL,
  TRAINING_RECORDS_CREATE_REMARKS_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_TRAINING_HELPER_TEXT,
  TRAINING_RECORDS_CREATE_TRAINING_LABEL,
  TRAINING_RECORDS_CREATE_TRAINING_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_VALID_UNTIL_LABEL,
  TRAINING_RECORDS_UPDATE_MODAL_DESCRIPTION,
  TRAINING_RECORDS_UPDATE_MODAL_TITLE,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import type { UpdateTrainingRecordPayload } from '~/types/domain/training'
import { validateUpdateTrainingRecordForm } from '~/utils/training-validation'

const props = withDefaults(defineProps<{
  initialValues: {
    trainingId: string
    personnelId: string
    certificateNo: string
    validUntil: string
    remarks: string
  }
  isSubmitting?: boolean
  warningMessage?: string
  errorMessage?: string
}>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateTrainingRecordPayload): void
}>()

const form = reactive({
  trainingId: '',
  personnelId: '',
  certificateNo: '',
  validUntil: '',
  remarks: '',
})

watch(() => props.initialValues, (value) => {
  form.trainingId = value.trainingId
  form.personnelId = value.personnelId
  form.certificateNo = value.certificateNo
  form.validUntil = value.validUntil
  form.remarks = value.remarks
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateUpdateTrainingRecordForm(form)

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
