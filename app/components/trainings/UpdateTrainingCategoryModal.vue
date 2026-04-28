<template>
  <BaseModal
    :title="TRAINING_CATEGORIES_UPDATE_MODAL_TITLE"
    :description="TRAINING_CATEGORIES_UPDATE_MODAL_DESCRIPTION"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <BaseTextField
        v-model="form.code"
        :label="TRAINING_CATEGORIES_CREATE_CODE_LABEL"
        :placeholder="TRAINING_CATEGORIES_CREATE_CODE_PLACEHOLDER"
        :error="errors.code"
        required
      />

      <BaseTextField
        v-model="form.name"
        :label="TRAINING_CATEGORIES_CREATE_NAME_LABEL"
        :placeholder="TRAINING_CATEGORIES_CREATE_NAME_PLACEHOLDER"
        :error="errors.name"
        required
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
import {
  TRAINING_CATEGORIES_CREATE_CODE_LABEL,
  TRAINING_CATEGORIES_CREATE_CODE_PLACEHOLDER,
  TRAINING_CATEGORIES_CREATE_NAME_LABEL,
  TRAINING_CATEGORIES_CREATE_NAME_PLACEHOLDER,
  TRAINING_CATEGORIES_UPDATE_MODAL_DESCRIPTION,
  TRAINING_CATEGORIES_UPDATE_MODAL_TITLE,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import type { UpdateTrainingCategoryPayload } from '~/types/domain/training'
import { validateUpdateTrainingCategoryForm } from '~/utils/training-validation'

const props = withDefaults(defineProps<{
  initialValues: {
    code: string
    name: string
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
  (event: 'submit', payload: UpdateTrainingCategoryPayload): void
}>()

const form = reactive({
  code: '',
  name: '',
})

watch(() => props.initialValues, (value) => {
  form.code = value.code
  form.name = value.name
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateUpdateTrainingCategoryForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', {
    code: result.payload.code,
    name: result.payload.name,
  })
}
</script>
