<template>
  <BaseModal
    :title="TRAINING_CATEGORIES_CREATE_MODAL_TITLE"
    :description="TRAINING_CATEGORIES_CREATE_MODAL_DESCRIPTION"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
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
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ TRAININGS_MODAL_CREATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  TRAINING_CATEGORIES_CREATE_CODE_LABEL,
  TRAINING_CATEGORIES_CREATE_CODE_PLACEHOLDER,
  TRAINING_CATEGORIES_CREATE_MODAL_DESCRIPTION,
  TRAINING_CATEGORIES_CREATE_MODAL_TITLE,
  TRAINING_CATEGORIES_CREATE_NAME_LABEL,
  TRAINING_CATEGORIES_CREATE_NAME_PLACEHOLDER,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_CREATE_LABEL,
} from '~/constants/page.constants'
import type { CreateTrainingCategoryPayload } from '~/types/domain/training'
import { validateCreateTrainingCategoryForm } from '~/utils/training-validation'

withDefaults(defineProps<{ isSubmitting?: boolean }>(), { isSubmitting: false })

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateTrainingCategoryPayload): void
}>()

const form = reactive({
  code: '',
  name: '',
})

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateCreateTrainingCategoryForm(form)

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
