<template>
  <BaseModal
    :title="USERS_ACCOUNT_CREATE_MODAL_TITLE"
    :description="USERS_ACCOUNT_CREATE_MODAL_DESCRIPTION"
    size="md"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseTextField
        v-model="form.code"
        :label="USERS_ACCOUNT_CODE_LABEL"
        :placeholder="USERS_ACCOUNT_CODE_PLACEHOLDER"
        :error="errors.code"
        required
      />

      <BaseTextField
        v-model="form.name"
        :label="USERS_ACCOUNT_NAME_LABEL"
        :placeholder="USERS_ACCOUNT_NAME_PLACEHOLDER"
        :error="errors.name"
        required
      />

      <BaseTextArea
        v-model="form.description"
        :label="USERS_ACCOUNT_DESCRIPTION_LABEL"
        :placeholder="USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER"
      />

      <BaseCheckbox
        v-model="form.isSystem"
        :label="USERS_ACCOUNT_IS_SYSTEM_LABEL"
        :description="USERS_ACCOUNT_IS_SYSTEM_DESCRIPTION"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ USERS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ USERS_MODAL_CREATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  USERS_ACCOUNT_CODE_LABEL,
  USERS_ACCOUNT_CODE_PLACEHOLDER,
  USERS_ACCOUNT_CREATE_MODAL_DESCRIPTION,
  USERS_ACCOUNT_CREATE_MODAL_TITLE,
  USERS_ACCOUNT_DESCRIPTION_LABEL,
  USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER,
  USERS_ACCOUNT_IS_SYSTEM_DESCRIPTION,
  USERS_ACCOUNT_IS_SYSTEM_LABEL,
  USERS_ACCOUNT_NAME_LABEL,
  USERS_ACCOUNT_NAME_PLACEHOLDER,
  USERS_MODAL_CANCEL_LABEL,
  USERS_MODAL_CREATE_LABEL,
} from '~/constants/page.constants'
import type { CreateAccountTypePayload } from '~/types/domain/users'
import { validateAccountTypeForm } from '~/utils/users-validation'

const props = withDefaults(defineProps<{ isSubmitting?: boolean }>(), {
  isSubmitting: false,
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateAccountTypePayload): void
}>()

const form = reactive({
  code: '',
  name: '',
  description: '',
  isSystem: false,
})

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateAccountTypeForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

void props
</script>
