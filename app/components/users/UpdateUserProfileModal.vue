<template>
  <BaseModal
    :title="USERS_PROFILE_UPDATE_MODAL_TITLE"
    :description="USERS_PROFILE_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.email"
          type="email"
          :label="USERS_PROFILE_EMAIL_LABEL"
          :placeholder="USERS_PROFILE_EMAIL_PLACEHOLDER"
          :error="errors.email"
          required
        />

        <BaseTextField
          v-model="form.fullName"
          :label="USERS_PROFILE_FULL_NAME_LABEL"
          :placeholder="USERS_PROFILE_FULL_NAME_PLACEHOLDER"
          :error="errors.fullName"
          required
        />
      </div>

      <div class="space-y-2">
        <BaseTextField
          v-model="form.avatarUrl"
          type="url"
          :label="USERS_PROFILE_AVATAR_URL_LABEL"
          :placeholder="USERS_PROFILE_AVATAR_URL_PLACEHOLDER"
          helper-text="Optional fallback URL."
        />
      </div>

      <fieldset class="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <legend class="px-1 text-sm font-semibold text-slate-700">{{ USERS_PROFILE_ACCOUNT_TYPES_LABEL }}</legend>

        <p v-if="!accountTypeOptions.length" class="text-sm text-slate-500">
          {{ USERS_PROFILE_ACCOUNT_TYPES_EMPTY_MESSAGE }}
        </p>

        <div v-else class="grid gap-3 md:grid-cols-2">
          <BaseCheckbox
            v-for="accountType in accountTypeOptions"
            :key="accountType.value"
            :model-value="isSelected(accountType.value)"
            :label="accountType.label"
            @update:model-value="onAccountTypeToggle(accountType.value, $event)"
          />
        </div>

        <p v-if="errors.accountTypeIds" class="text-sm text-rose-600">{{ errors.accountTypeIds }}</p>
      </fieldset>
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
  USERS_PROFILE_ACCOUNT_TYPES_EMPTY_MESSAGE,
  USERS_PROFILE_ACCOUNT_TYPES_LABEL,
  USERS_PROFILE_AVATAR_URL_LABEL,
  USERS_PROFILE_AVATAR_URL_PLACEHOLDER,
  USERS_PROFILE_EMAIL_LABEL,
  USERS_PROFILE_EMAIL_PLACEHOLDER,
  USERS_PROFILE_FULL_NAME_LABEL,
  USERS_PROFILE_FULL_NAME_PLACEHOLDER,
  USERS_PROFILE_UPDATE_MODAL_DESCRIPTION,
  USERS_PROFILE_UPDATE_MODAL_TITLE,
} from '~/constants/page.constants'
import type { SelectOption } from '~/types/domain/misc'
import type { UpdateUserProfilePayload } from '~/types/domain/users'
import { validateUpdateUserProfileForm } from '~/utils/users-validation'

const props = withDefaults(
  defineProps<{
    accountTypeOptions: SelectOption[]
    initialValues: {
      email: string
      fullName: string
      avatarUrl: string | null
      accountTypeIds: string[]
    }
    isSubmitting?: boolean
  }>(),
  {
    isSubmitting: false,
  },
)

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateUserProfilePayload): void
}>()

const form = reactive({
  email: props.initialValues.email,
  fullName: props.initialValues.fullName,
  avatarUrl: props.initialValues.avatarUrl ?? '',
  accountTypeIds: [...props.initialValues.accountTypeIds],
})

const errors = reactive<Record<string, string>>({})

const isSelected = (accountTypeId: string) => form.accountTypeIds.includes(accountTypeId)

const onAccountTypeToggle = (accountTypeId: string, checked: boolean) => {
  if (checked) {
    form.accountTypeIds = [...form.accountTypeIds, accountTypeId]
    return
  }

  form.accountTypeIds = form.accountTypeIds.filter((existingId) => existingId !== accountTypeId)
}

const onSubmit = () => {
  const result = validateUpdateUserProfileForm(form)

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
