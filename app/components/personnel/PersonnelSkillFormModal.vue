<template>
  <BaseModal
    :title="initialValues ? PERSONNEL_SKILL_EDIT_TITLE : PERSONNEL_SKILL_CREATE_TITLE"
    :description="PERSONNEL_SKILL_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <form :class="PERSONNEL_SKILLS_FORM_CLASSES" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <BaseTextField v-model="form.name" :label="PERSONNEL_SKILL_NAME_LABEL" :error="errors.name" required />
      <BaseSelect
        v-model="form.source"
        :label="PERSONNEL_SKILL_SOURCE_LABEL"
        :options="PERSONNEL_SKILL_SOURCE_OPTIONS"
        :error="errors.source"
        required
      />
      <PersonnelSkillTrainingField
        v-if="form.source === 'training'"
        v-model="form.trainingRecordId"
        :personnel-id="personnelId"
        :error="errors.trainingRecordId"
      />
      <BaseTextArea
        v-else
        v-model="form.externalReference"
        :label="PERSONNEL_SKILL_EXTERNAL_LABEL"
        :helper-text="PERSONNEL_SKILL_EXTERNAL_HELPER"
        :error="errors.externalReference"
        required
      />
      <div :class="PERSONNEL_SKILLS_DATE_FIELDS_CLASSES">
        <BaseDatePicker v-model="form.dateObtained" :label="PERSONNEL_SKILL_OBTAINED_LABEL" :error="errors.dateObtained" />
        <BaseDatePicker v-model="form.validUntil" :label="PERSONNEL_SKILL_VALID_UNTIL_LABEL" :error="errors.validUntil" />
      </div>
    </form>
    <template #footer>
      <div :class="PERSONNEL_SKILLS_ACTIONS_CLASSES">
        <BaseButton variant="ghost" :disabled="isSubmitting" @click="emit('close')">{{ PERSONNEL_SKILL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ PERSONNEL_SKILL_SAVE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import PersonnelSkillTrainingField from '~/components/personnel/PersonnelSkillTrainingField.vue'
import type { PersonnelSkillItem, SavePersonnelSkillRequest } from '~/types/domain/personnel-skills'
import {
  PERSONNEL_SKILL_EDIT_TITLE,
  PERSONNEL_SKILL_CREATE_TITLE,
  PERSONNEL_SKILL_MODAL_DESCRIPTION,
  PERSONNEL_SKILL_NAME_LABEL,
  PERSONNEL_SKILL_SOURCE_LABEL,
  PERSONNEL_SKILL_SOURCE_OPTIONS,
  PERSONNEL_SKILL_EXTERNAL_LABEL,
  PERSONNEL_SKILL_EXTERNAL_HELPER,
  PERSONNEL_SKILL_OBTAINED_LABEL,
  PERSONNEL_SKILL_VALID_UNTIL_LABEL,
  PERSONNEL_SKILL_CANCEL_LABEL,
  PERSONNEL_SKILL_SAVE_LABEL,
} from '~/constants/page.constants'
import {
  PERSONNEL_SKILLS_FORM_CLASSES,
  PERSONNEL_SKILLS_DATE_FIELDS_CLASSES,
  PERSONNEL_SKILLS_ACTIONS_CLASSES,
} from '~/constants/shared.constants'
import { toPersonnelSkillForm, validatePersonnelSkillForm } from '~/utils/personnel-skills'

const props = withDefaults(defineProps<{
  personnelId: string
  initialValues?: PersonnelSkillItem | null
  isSubmitting?: boolean
  warningMessage?: string
  errorMessage?: string
}>(), { initialValues: null, isSubmitting: false, warningMessage: '', errorMessage: '' })
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', value: SavePersonnelSkillRequest): void
}>()
const form = reactive(toPersonnelSkillForm(props.initialValues))
const errors = reactive<Record<string, string>>({})
watch(() => props.initialValues, (value) => Object.assign(form, toPersonnelSkillForm(value)))

const onSubmit = () => {
  if (props.isSubmitting) return
  const result = validatePersonnelSkillForm(form)
  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)
  if (result.payload) emit('submit', result.payload)
}
</script>
