<template>
  <BaseModal
    :title="BATTALION_UPDATE_MODAL_TITLE"
    :description="BATTALION_UPDATE_MODAL_DESCRIPTION"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.code"
          :label="BATTALION_CREATE_CODE_LABEL"
          :placeholder="BATTALION_CREATE_CODE_PLACEHOLDER"
          :error="errors.code"
          required
        />

        <BaseTextField
          v-model="form.name"
          :label="BATTALION_CREATE_NAME_LABEL"
          :placeholder="BATTALION_CREATE_NAME_PLACEHOLDER"
          :error="errors.name"
          required
        />
      </div>

      <BaseCheckbox
        v-model="form.isActive"
        :label="BATTALION_CREATE_ACTIVE_LABEL"
        :description="BATTALION_CREATE_ACTIVE_DESCRIPTION"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ UNITS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ UNITS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  BATTALION_CREATE_ACTIVE_DESCRIPTION,
  BATTALION_CREATE_ACTIVE_LABEL,
  BATTALION_CREATE_CODE_LABEL,
  BATTALION_CREATE_CODE_PLACEHOLDER,
  BATTALION_CREATE_NAME_LABEL,
  BATTALION_CREATE_NAME_PLACEHOLDER,
  BATTALION_UPDATE_MODAL_DESCRIPTION,
  BATTALION_UPDATE_MODAL_TITLE,
  UNITS_MODAL_CANCEL_LABEL,
  UNITS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import type { UpdateBattalionPayload } from '~/types/domain/units'
import { validateCreateBattalionForm } from '~/utils/units-validation'

const props = withDefaults(defineProps<{
  initialValues: {
    code: string
    name: string
    isActive: boolean
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
  (event: 'submit', payload: UpdateBattalionPayload): void
}>()

const form = reactive({
  code: '',
  name: '',
  isActive: true,
})

watch(() => props.initialValues, (value) => {
  form.code = value.code
  form.name = value.name
  form.isActive = value.isActive
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateCreateBattalionForm(form)

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
