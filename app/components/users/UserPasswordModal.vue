<template>
  <BaseModal
    :title="USERS_PROFILE_PASSWORD_MODAL_TITLE"
    :description="USERS_PROFILE_PASSWORD_MODAL_DESCRIPTION"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseTextField
        v-model="form.newPassword"
        type="password"
        :label="USERS_PROFILE_PASSWORD_LABEL"
        :placeholder="USERS_PROFILE_PASSWORD_PLACEHOLDER"
        :error="errors.newPassword"
        required
      />

      <BaseTextField
        v-model="form.confirmPassword"
        type="password"
        :label="USERS_PROFILE_CONFIRM_PASSWORD_LABEL"
        :placeholder="USERS_PROFILE_CONFIRM_PASSWORD_PLACEHOLDER"
        :error="errors.confirmPassword"
        required
      />

      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="onGeneratePassword">
          {{ USERS_PROFILE_GENERATE_PASSWORD_LABEL }}
        </BaseButton>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ USERS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ USERS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  USERS_MODAL_CANCEL_LABEL,
  USERS_MODAL_UPDATE_LABEL,
  USERS_PROFILE_CONFIRM_PASSWORD_LABEL,
  USERS_PROFILE_CONFIRM_PASSWORD_PLACEHOLDER,
  USERS_PROFILE_GENERATE_PASSWORD_LABEL,
  USERS_PROFILE_PASSWORD_LABEL,
  USERS_PROFILE_PASSWORD_MODAL_DESCRIPTION,
  USERS_PROFILE_PASSWORD_MODAL_TITLE,
  USERS_PROFILE_PASSWORD_PLACEHOLDER,
} from '~/constants/page.constants'
import type { UpdateUserPasswordPayload } from '~/types/domain/users'
import { generateUserPassword } from '~/utils/password-generator'
import { validateUserPasswordForm } from '~/utils/users-validation'

withDefaults(defineProps<{ isSubmitting?: boolean }>(), {
  isSubmitting: false,
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateUserPasswordPayload): void
}>()

const form = reactive({
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateUserPasswordForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

const onGeneratePassword = () => {
  const generatedPassword = generateUserPassword()
  form.newPassword = generatedPassword
  form.confirmPassword = generatedPassword
}
</script>
