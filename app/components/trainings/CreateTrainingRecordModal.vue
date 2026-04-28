<template>
  <BaseModal
    :title="TRAINING_RECORDS_CREATE_MODAL_TITLE"
    :description="TRAINING_RECORDS_CREATE_MODAL_DESCRIPTION"
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 md:grid-cols-2">
        <TrainingSuggestionField
          v-model="form.trainingId"
          :label="TRAINING_RECORDS_CREATE_TRAINING_LABEL"
          :placeholder="TRAINING_RECORDS_CREATE_TRAINING_PLACEHOLDER"
          :helper-text="TRAINING_RECORDS_CREATE_TRAINING_HELPER_TEXT"
          :error="errors.trainingId"
          @select="onTrainingSelected"
        />

        <PersonnelSuggestionField
          v-model="form.personnelId"
          :label="TRAINING_RECORDS_CREATE_PERSONNEL_LABEL"
          :placeholder="TRAINING_RECORDS_CREATE_PERSONNEL_PLACEHOLDER"
          :helper-text="TRAINING_RECORDS_CREATE_PERSONNEL_HELPER_TEXT"
          :error="errors.personnelId"
          @select="onPersonnelSelected"
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
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ TRAININGS_MODAL_CREATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import TrainingSuggestionField from '~/components/general/TrainingSuggestionField.vue'
import {
  TRAINING_RECORDS_CREATE_CERTIFICATE_NO_LABEL,
  TRAINING_RECORDS_CREATE_CERTIFICATE_NO_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_MODAL_DESCRIPTION,
  TRAINING_RECORDS_CREATE_MODAL_TITLE,
  TRAINING_RECORDS_CREATE_PERSONNEL_HELPER_TEXT,
  TRAINING_RECORDS_CREATE_PERSONNEL_LABEL,
  TRAINING_RECORDS_CREATE_PERSONNEL_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_REMARKS_LABEL,
  TRAINING_RECORDS_CREATE_REMARKS_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_TRAINING_HELPER_TEXT,
  TRAINING_RECORDS_CREATE_TRAINING_LABEL,
  TRAINING_RECORDS_CREATE_TRAINING_PLACEHOLDER,
  TRAINING_RECORDS_CREATE_VALID_UNTIL_LABEL,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_CREATE_LABEL,
} from '~/constants/page.constants'
import type { PersonnelSuggestion } from '~/types/domain/personnel'
import type { CreateTrainingRecordPayload, TrainingSuggestionItem } from '~/types/domain/training'
import { validateCreateTrainingRecordForm } from '~/utils/training-validation'

withDefaults(defineProps<{ isSubmitting?: boolean }>(), { isSubmitting: false })

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateTrainingRecordPayload): void
}>()

const form = reactive({
  trainingId: '',
  personnelId: '',
  certificateNo: '',
  validUntil: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})

const onPersonnelSelected = (personnel: PersonnelSuggestion | null) => {
  if (!personnel) {
    return
  }

  if (!form.certificateNo) {
    form.certificateNo = personnel.serviceNumber
  }
}

const onTrainingSelected = (training: TrainingSuggestionItem | null) => {
  if (!training) {
    return
  }

  if (!form.validUntil && training.endDate) {
    form.validUntil = training.endDate
  }

  if (!form.remarks) {
    const fragments = [
      `Training: ${training.trainingTitle}`,
      training.trainingCategoryName ? `Category: ${training.trainingCategoryName}` : '',
      training.levelName ? `Level: ${training.levelName}` : '',
      training.statusName ? `Status: ${training.statusName}` : '',
    ].filter(Boolean)

    form.remarks = fragments.join(' | ')
  }
}

const onSubmit = () => {
  const result = validateCreateTrainingRecordForm(form)

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
