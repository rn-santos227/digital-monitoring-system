<template>
  <BaseModal :title="title" :description="labels.description" size="lg" scroll-body @close="emit('close')">
    <form :class="PERSONNEL_HISTORY_SECTION_CLASSES" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <BaseTextField v-model="form.organization" :label="labels.organizationLabel" :error="errors.organization" :disabled="readOnly || isSubmitting" required />
      <BaseTextField v-model="form.description" :label="labels.descriptionLabel" :error="errors.description" :disabled="readOnly || isSubmitting" required />
      <BaseTextField
        v-if="kind === 'education'"
        v-model="form.educationLevel"
        :label="PERSONNEL_HISTORY_EDUCATION_LEVEL_LABEL"
        :error="errors.educationLevel"
        :disabled="readOnly || isSubmitting"
      />
      <div :class="PERSONNEL_HISTORY_DATES_CLASSES">
        <BaseDatePicker v-model="form.startDate" :label="PERSONNEL_HISTORY_START_DATE_LABEL" :error="errors.startDate" :disabled="readOnly || isSubmitting" />
        <BaseDatePicker v-model="form.endDate" :label="PERSONNEL_HISTORY_END_DATE_LABEL" :error="errors.endDate" :disabled="readOnly || isSubmitting" />
      </div>
      <BaseTextArea v-model="form.reference" :label="PERSONNEL_HISTORY_REFERENCE_LABEL" :error="errors.reference" :disabled="readOnly || isSubmitting" />
      <BaseTextArea v-model="form.remarks" :label="PERSONNEL_HISTORY_REMARKS_LABEL" :error="errors.remarks" :disabled="readOnly || isSubmitting" />
    </form>
    <template #footer>
      <div :class="PERSONNEL_HISTORY_ACTIONS_CLASSES">
        <BaseButton variant="ghost" :disabled="isSubmitting" @click="emit('close')">{{ readOnly ? PERSONNEL_HISTORY_CLOSE_LABEL : PERSONNEL_HISTORY_CANCEL_LABEL }}</BaseButton>
        <BaseButton v-if="!readOnly" :disabled="isSubmitting" @click="onSubmit">{{ PERSONNEL_HISTORY_SAVE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { PersonnelHistoryKind, PersonnelHistoryItem, SavePersonnelHistoryRequest } from '~/types/domain/personnel-history'
import {
  PERSONNEL_HISTORY_LABELS,
  PERSONNEL_HISTORY_EDUCATION_LEVEL_LABEL,
  PERSONNEL_HISTORY_START_DATE_LABEL,
  PERSONNEL_HISTORY_END_DATE_LABEL,
  PERSONNEL_HISTORY_REFERENCE_LABEL,
  PERSONNEL_HISTORY_REMARKS_LABEL,
  PERSONNEL_HISTORY_CLOSE_LABEL,
  PERSONNEL_HISTORY_CANCEL_LABEL,
  PERSONNEL_HISTORY_SAVE_LABEL,
} from '~/constants/page.constants'
import { PERSONNEL_HISTORY_SECTION_CLASSES, PERSONNEL_HISTORY_ACTIONS_CLASSES, PERSONNEL_HISTORY_DATES_CLASSES } from '~/constants/shared.constants'
import { toPersonnelHistoryForm, validatePersonnelHistoryForm } from '~/utils/personnel-history'

const props = withDefaults(defineProps<{
  kind: PersonnelHistoryKind
  initialValues?: PersonnelHistoryItem | null
  readOnly?: boolean
  isSubmitting?: boolean
  errorMessage?: string
  warningMessage?: string
}>(), { initialValues: null, readOnly: false, isSubmitting: false, errorMessage: '', warningMessage: '' })
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: SavePersonnelHistoryRequest): void
}>()
const labels = computed(() => PERSONNEL_HISTORY_LABELS[props.kind])
const title = computed(() => props.readOnly ? labels.value.viewTitle : props.initialValues ? labels.value.editTitle : labels.value.createTitle)
const form = reactive(toPersonnelHistoryForm(props.initialValues))
const errors = reactive<Record<string, string>>({})
watch(() => props.initialValues, (item) => Object.assign(form, toPersonnelHistoryForm(item)))
const onSubmit = () => {
  if (props.readOnly || props.isSubmitting) return
  const result = validatePersonnelHistoryForm(form, props.kind)
  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)
  if (result.payload) emit('submit', result.payload)
}
</script>
