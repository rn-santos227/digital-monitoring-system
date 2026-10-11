<template>
  <BaseModal :title="PERSONNEL_FEEDBACK_MODAL_TITLE" :description="PERSONNEL_FEEDBACK_DESCRIPTION" size="lg" scroll-body @close="emit('close')">
    <form :class="PERSONNEL_HISTORY_SECTION_CLASSES" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage || officialError" :message="errorMessage || officialError" tone="danger" />
      <BaseInlineLoader v-if="isVerifying" />
      <BaseCard v-else-if="official" :title="PERSONNEL_FEEDBACK_AUTHOR_LABEL" :subtitle="officialIdentity" />
      <BaseTextArea v-model="form.feedback" :label="PERSONNEL_FEEDBACK_TEXT_LABEL" :error="errors.feedback" :rows="6" :disabled="isSubmitting" required />
      <div :class="PERSONNEL_HISTORY_DATES_CLASSES">
        <BaseDatePicker v-model="form.reviewDate" :label="PERSONNEL_FEEDBACK_DATE_LABEL" :error="errors.reviewDate" :disabled="isSubmitting" required />
        <BaseTextField v-model="ratingInput" type="number" :min="1" :max="5" :step="1" :label="PERSONNEL_FEEDBACK_RATING_LABEL" :error="errors.rating" :disabled="isSubmitting" />
      </div>
      <BaseCheckbox
        v-model="form.attestAuthorship"
        :label="PERSONNEL_FEEDBACK_ATTEST_LABEL"
        :disabled="isSubmitting || !official"
      />
      <BaseAlert v-if="errors.attestAuthorship" :message="errors.attestAuthorship" tone="warning" />
    </form>
    <template #footer>
      <div :class="PERSONNEL_HISTORY_ACTIONS_CLASSES">
        <BaseButton variant="ghost" :disabled="isSubmitting" @click="emit('close')">{{ PERSONNEL_FEEDBACK_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting || isVerifying || !official" @click="onSubmit">{{ PERSONNEL_FEEDBACK_SAVE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { CreatePersonnelFeedbackRequest, PersonnelFeedbackOfficial, PersonnelFeedbackValues } from '~/types/domain/personnel-feedback'
import {
  PERSONNEL_FEEDBACK_MODAL_TITLE,
  PERSONNEL_FEEDBACK_DESCRIPTION,
  PERSONNEL_FEEDBACK_TEXT_LABEL,
  PERSONNEL_FEEDBACK_DATE_LABEL,
  PERSONNEL_FEEDBACK_RATING_LABEL,
  PERSONNEL_FEEDBACK_AUTHOR_LABEL,
  PERSONNEL_FEEDBACK_ATTEST_LABEL,
  PERSONNEL_FEEDBACK_CANCEL_LABEL,
  PERSONNEL_FEEDBACK_SAVE_LABEL,
  PERSONNEL_FEEDBACK_OFFICIAL_ERROR,
} from '~/constants/page.constants'
import { PERSONNEL_HISTORY_SECTION_CLASSES, PERSONNEL_HISTORY_DATES_CLASSES, PERSONNEL_HISTORY_ACTIONS_CLASSES } from '~/constants/shared.constants'
import { getPersonnelFeedbackOfficialEndpoint } from '~/utils/personnel-feedback-endpoints'
import { extractApiErrorMessage } from '~/utils/api-request'
import { validatePersonnelFeedbackValues } from '../../../server/shared/utils/personnel-feedback'

const props = withDefaults(defineProps<{ isSubmitting?: boolean; errorMessage?: string; warningMessage?: string }>(), {
  isSubmitting: false, errorMessage: '', warningMessage: '',
})
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreatePersonnelFeedbackRequest): void
}>()
const form = reactive<PersonnelFeedbackValues>({ feedback: '', reviewDate: '', rating: null, attestAuthorship: false })
const errors = reactive<Record<string, string>>({})
const official = ref<PersonnelFeedbackOfficial | null>(null)
const officialError = ref('')
const isVerifying = ref(true)
const officialIdentity = computed(() => official.value ? `${official.value.rank} ${official.value.name} · ${official.value.serialNumber}` : '')
const ratingInput = computed({
  get: () => form.rating === null ? '' : String(form.rating),
  set: (value: string) => { form.rating = value.trim() === '' ? null : Number(value) },
})
onMounted(async () => {
  try {
    official.value = await getPersonnelFeedbackOfficialEndpoint()
  } catch (error) {
    officialError.value = extractApiErrorMessage(error, PERSONNEL_FEEDBACK_OFFICIAL_ERROR)
  } finally {
    isVerifying.value = false
  }
})
const onSubmit = () => {
  if (props.isSubmitting || !official.value || isVerifying.value) return
  const values = { ...form, feedback: form.feedback.trim() }
  const result = validatePersonnelFeedbackValues(values)
  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result)
  if (Object.keys(result).length === 0) emit('submit', values)
}
</script>
