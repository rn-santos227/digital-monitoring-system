<template>
  <BaseModal
    :title="USERS_PROFILE_UPDATE_MODAL_TITLE"
    :description="USERS_PROFILE_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <PersonnelSuggestionField
        v-model="form.personnelId"
        :selected-personnel-id="props.initialValues.personnelId"
        @select="onPersonnelSelected"
      />

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

        <BaseRadioGroup
          v-else
          v-model="selectedAccountTypeId"
          :options="accountTypeOptions"
          name="user-account-type"
          :error="errors.accountTypeIds"
        />
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
import { computed, reactive, ref } from 'vue'
import { FILE_UPLOAD_CONSTRAINTS } from '~/constants/api.constants'
import {
  USERS_MODAL_CANCEL_LABEL,
  USERS_MODAL_UPDATE_LABEL,
  USERS_PROFILE_ACCOUNT_TYPES_EMPTY_MESSAGE,
  USERS_PROFILE_ACCOUNT_TYPES_LABEL,
  USERS_PROFILE_AVATAR_HELPER,
  USERS_PROFILE_AVATAR_URL_LABEL,
  USERS_PROFILE_AVATAR_URL_PLACEHOLDER,
  USERS_PROFILE_EMAIL_LABEL,
  USERS_PROFILE_EMAIL_PLACEHOLDER,
  USERS_PROFILE_FULL_NAME_LABEL,
  USERS_PROFILE_FULL_NAME_PLACEHOLDER,
  USERS_PROFILE_UPDATE_MODAL_DESCRIPTION,
  USERS_PROFILE_UPDATE_MODAL_TITLE,
} from '~/constants/page.constants'
import type { RadioOption } from '~/types/domain/misc'
import type { UpdateUserProfilePayload } from '~/types/domain/users'
import type { PersonnelSuggestion } from '~/types/domain/personnel'
import { uploadFileEndpoint } from '~/utils/file-management-endpoints'
import { formatFileSizeLabel } from '~/utils/file-upload'
import { extractApiErrorMessage } from '~/utils/api-request'
import { validateUpdateUserProfileForm } from '~/utils/users-validation'

const props = withDefaults(
  defineProps<{
    accountTypeOptions: RadioOption[]
    initialValues: {
      personnelId: string | null
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
  personnelId: props.initialValues.personnelId ?? '',
  email: props.initialValues.email,
  fullName: props.initialValues.fullName,
  avatarUrl: props.initialValues.avatarUrl ?? '',
  accountTypeIds: [...props.initialValues.accountTypeIds],
})

const errors = reactive<Record<string, string>>({})
const isAvatarUploading = ref(false)
const avatarFile = ref<File | null>(null)

const avatarUploadHelperText = computed(() => {
  const maxSizeLabel = formatFileSizeLabel(FILE_UPLOAD_CONSTRAINTS.maxSizeBytes)
  return `${USERS_PROFILE_AVATAR_HELPER} Max size: ${maxSizeLabel}.`
})

const selectedAccountTypeId = computed({
  get: () => form.accountTypeIds[0] ?? '',
  set: (accountTypeId: string) => {
    form.accountTypeIds = accountTypeId ? [accountTypeId] : []
  },
})

const onAvatarFileSelected = (file: File | null) => {
  delete errors.avatarFile
  avatarFile.value = file
}

const onSubmit = async () => {
  const result = validateUpdateUserProfileForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (isAvatarUploading.value) {
    errors.avatarFile = 'Avatar upload is in progress. Please wait.'
    return
  }

  if (!result.payload) {
    return
  }

  if (avatarFile.value) {
    isAvatarUploading.value = true

    try {
      const response = await uploadFileEndpoint(avatarFile.value)
      form.avatarUrl = response.attachment.publicUrl
      result.payload.avatarUrl = response.attachment.publicUrl
    } catch (error) {
      errors.avatarFile = extractApiErrorMessage(error, 'Unable to upload avatar file.')
      return
    } finally {
      isAvatarUploading.value = false
    }
  }

  emit('submit', result.payload)
}

const onPersonnelSelected = (personnel: PersonnelSuggestion | null) => {
  if (!personnel) {
    return
  }

  form.fullName = personnel.fullName

  const suggestedEmail = personnel.email || personnel.suggestedEmail

  if (suggestedEmail) {
    form.email = suggestedEmail
  }
}
</script>
