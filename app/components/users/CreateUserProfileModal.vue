<template>
  <BaseModal
    :title="USERS_PROFILE_CREATE_MODAL_TITLE"
    :description="USERS_PROFILE_CREATE_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <PersonnelSuggestionField
        v-model="form.personnelId"
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

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.password"
          type="password"
          :label="USERS_PROFILE_PASSWORD_LABEL"
          :placeholder="USERS_PROFILE_PASSWORD_PLACEHOLDER"
          :error="errors.password"
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
      </div>

      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="onGeneratePassword">
          {{ USERS_PROFILE_GENERATE_PASSWORD_LABEL }}
        </BaseButton>
      </div>

      <div class="space-y-2">
        <BaseFileUpload
          :label="USERS_PROFILE_AVATAR_LABEL"
          :helper-text="avatarUploadHelperText"
          :error="errors.avatarFile"
          accept="image/*"
          :allowed-mime-prefixes="FILE_UPLOAD_CONSTRAINTS.imageMimePrefixes"
          :max-size-bytes="FILE_UPLOAD_CONSTRAINTS.maxSizeBytes"
          :disabled="isSubmitting || isAvatarUploading"
          @update:file="onAvatarFileSelected"
        />
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
        <BaseButton variant="ghost" @click="onCloseRequest">{{ USERS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ USERS_MODAL_CREATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useDialog } from '~/composables/useDialog'
import { FILE_UPLOAD_CONSTRAINTS } from '~/constants/api.constants'
import {
  USERS_MODAL_CANCEL_LABEL,
  USERS_MODAL_CREATE_LABEL,
  USERS_PROFILE_ACCOUNT_TYPES_EMPTY_MESSAGE,
  USERS_PROFILE_ACCOUNT_TYPES_LABEL,
  USERS_PROFILE_AVATAR_HELPER,
  USERS_PROFILE_AVATAR_LABEL,
  USERS_PROFILE_AVATAR_URL_LABEL,
  USERS_PROFILE_AVATAR_URL_PLACEHOLDER,
  USERS_PROFILE_CONFIRM_PASSWORD_LABEL,
  USERS_PROFILE_CONFIRM_PASSWORD_PLACEHOLDER,
  USERS_PROFILE_CREATE_MODAL_DESCRIPTION,
  USERS_PROFILE_CREATE_MODAL_TITLE,
  USERS_PROFILE_EMAIL_LABEL,
  USERS_PROFILE_EMAIL_PLACEHOLDER,
  USERS_PROFILE_FULL_NAME_LABEL,
  USERS_PROFILE_FULL_NAME_PLACEHOLDER,
  USERS_PROFILE_GENERATE_PASSWORD_LABEL,
  USERS_PROFILE_PASSWORD_LABEL,
  USERS_PROFILE_PASSWORD_PLACEHOLDER,
} from '~/constants/page.constants'
import type { RadioOption } from '~/types/domain/misc'
import type { CreateUserProfilePayload } from '~/types/domain/users'
import type { PersonnelSuggestion } from '~/types/domain/personnel'
import { uploadFileEndpoint } from '~/utils/file-management-endpoints'
import { formatFileSizeLabel } from '~/utils/file-upload'
import { validateUserProfileForm } from '~/utils/users-validation'
import { extractApiErrorMessage } from '~/utils/api-request'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'

const props = withDefaults(
  defineProps<{
    accountTypeOptions: RadioOption[]
    isSubmitting?: boolean
  }>(),
  {
    isSubmitting: false,
  },
)

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateUserProfilePayload): void
}>()

const form = reactive({
  personnelId: '',
  email: '',
  fullName: '',
  avatarUrl: '',
  password: '',
  confirmPassword: '',
  accountTypeIds: [] as string[],
})

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()
const isAvatarUploading = ref(false)
const avatarFile = ref<File | null>(null)

const avatarUploadHelperText = computed(() => {
  const maxSizeLabel = formatFileSizeLabel(FILE_UPLOAD_CONSTRAINTS.maxSizeBytes)
  return `${USERS_PROFILE_AVATAR_HELPER} Max size: ${maxSizeLabel}.`
})

const isSelected = (accountTypeId: string) => form.accountTypeIds.includes(accountTypeId)

const onAccountTypeToggle = (accountTypeId: string, checked: boolean) => {
  if (checked) {
    form.accountTypeIds = [...form.accountTypeIds, accountTypeId]
    return
  }

  form.accountTypeIds = form.accountTypeIds.filter((existingId) => existingId !== accountTypeId)
}

const onAvatarFileSelected = (file: File | null) => {
  delete errors.avatarFile
  avatarFile.value = file
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

const onSubmit = async () => {
  const result = validateUserProfileForm(form)

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
      const response = await uploadFileEndpoint(avatarFile.value, {
        allowedMimePrefixes: FILE_UPLOAD_CONSTRAINTS.imageMimePrefixes,
      })
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

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForRequiredFields({
    formValues: form,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}

const onGeneratePassword = () => {
  const generatedPassword = generateUserPassword()
  form.password = generatedPassword
  form.confirmPassword = generatedPassword
}
</script>
