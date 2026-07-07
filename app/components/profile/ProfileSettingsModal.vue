<template>
  <BaseModal
    :title="PROFILE_SETTINGS_MODAL_TITLE"
    :description="PROFILE_SETTINGS_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-5">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="rounded-full px-3 py-1.5 text-sm font-medium transition"
          :class="activeTab === tab.id ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          @click="emit('update:activeTab', tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <form v-if="activeTab === 'details'" class="space-y-4" @submit.prevent="submitDetails">
        <BaseTextField
          v-model="detailsForm.fullName"
          :label="PROFILE_SETTINGS_FULL_NAME_LABEL"
          :placeholder="PROFILE_SETTINGS_FULL_NAME_PLACEHOLDER"
          :error="errors.fullName"
          required
        />
      </form>

      <form v-else-if="activeTab === 'email'" class="space-y-4" @submit.prevent="submitEmail">
        <BaseTextField
          v-model="emailForm.email"
          type="email"
          :label="PROFILE_SETTINGS_EMAIL_LABEL"
          :placeholder="PROFILE_SETTINGS_EMAIL_PLACEHOLDER"
          :error="errors.email"
          required
        />
      </form>

      <form v-else-if="activeTab === 'password'" class="space-y-4" @submit.prevent="submitPassword">
        <BaseTextField
          v-model="passwordForm.currentPassword"
          type="password"
          :label="PROFILE_SETTINGS_CURRENT_PASSWORD_LABEL"
          :placeholder="PROFILE_SETTINGS_CURRENT_PASSWORD_PLACEHOLDER"
          :error="errors.currentPassword"
          required
        />
        <BaseTextField
          v-model="passwordForm.newPassword"
          type="password"
          :label="PROFILE_SETTINGS_NEW_PASSWORD_LABEL"
          :placeholder="PROFILE_SETTINGS_NEW_PASSWORD_PLACEHOLDER"
          :error="errors.newPassword"
          required
        />
        <BaseTextField
          v-model="passwordForm.confirmPassword"
          type="password"
          :label="PROFILE_SETTINGS_CONFIRM_PASSWORD_LABEL"
          :placeholder="PROFILE_SETTINGS_CONFIRM_PASSWORD_PLACEHOLDER"
          :error="errors.confirmPassword"
          required
        />
      </form>

      <form v-else class="space-y-4" @submit.prevent="submitOtherDetails">
        <BaseTextField
          v-model="otherForm.avatarUrl"
          type="url"
          :label="PROFILE_SETTINGS_AVATAR_URL_LABEL"
          :placeholder="PROFILE_SETTINGS_AVATAR_URL_PLACEHOLDER"
          helper-text="Optional public profile avatar URL."
        />
      </form>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ PROFILE_SETTINGS_CLOSE_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="submitActiveTab">{{ submitLabel }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  PROFILE_SETTINGS_AVATAR_URL_LABEL,
  PROFILE_SETTINGS_AVATAR_URL_PLACEHOLDER,
  PROFILE_SETTINGS_CHANGE_PASSWORD_LABEL,
  PROFILE_SETTINGS_CLOSE_LABEL,
  PROFILE_SETTINGS_CONFIRM_PASSWORD_LABEL,
  PROFILE_SETTINGS_CONFIRM_PASSWORD_PLACEHOLDER,
  PROFILE_SETTINGS_CURRENT_PASSWORD_LABEL,
  PROFILE_SETTINGS_CURRENT_PASSWORD_PLACEHOLDER,
  PROFILE_SETTINGS_DETAILS_TAB_LABEL,
  PROFILE_SETTINGS_EMAIL_LABEL,
  PROFILE_SETTINGS_EMAIL_PLACEHOLDER,
  PROFILE_SETTINGS_EMAIL_TAB_LABEL,
  PROFILE_SETTINGS_FULL_NAME_LABEL,
  PROFILE_SETTINGS_FULL_NAME_PLACEHOLDER,
  PROFILE_SETTINGS_MODAL_DESCRIPTION,
  PROFILE_SETTINGS_MODAL_TITLE,
  PROFILE_SETTINGS_NEW_PASSWORD_LABEL,
  PROFILE_SETTINGS_NEW_PASSWORD_PLACEHOLDER,
  PROFILE_SETTINGS_OTHER_TAB_LABEL,
  PROFILE_SETTINGS_PASSWORD_TAB_LABEL,
  PROFILE_SETTINGS_SAVE_DETAILS_LABEL,
  PROFILE_SETTINGS_SAVE_EMAIL_LABEL,
  PROFILE_SETTINGS_SAVE_OTHER_LABEL,
} from '~/constants/page.constants'
import type { SessionUser } from '~/types/domain/auth-store'
import type {
  ProfileDetailsPayload,
  ProfileEmailPayload,
  ProfileOtherDetailsPayload,
  ProfilePasswordPayload,
  ProfileSettingsTabId,
} from '~/types/domain/profile'
import {
  validateProfileDetailsForm,
  validateProfileEmailForm,
  validateProfileOtherDetailsForm,
  validateProfilePasswordForm,
} from '~/utils/profile-settings-validation'

const props = withDefaults(
  defineProps<{
    activeTab: ProfileSettingsTabId
    user: SessionUser | null
    isSubmitting?: boolean
    warningMessage?: string
    errorMessage?: string
  }>(),
  {
    isSubmitting: false,
    warningMessage: '',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'update:activeTab', tab: ProfileSettingsTabId): void
  (event: 'save-details', payload: ProfileDetailsPayload): void
  (event: 'save-email', payload: ProfileEmailPayload): void
  (event: 'save-other-details', payload: ProfileOtherDetailsPayload): void
  (event: 'save-password', payload: ProfilePasswordPayload): void
}>()

const tabs: Array<{ id: ProfileSettingsTabId; label: string }> = [
  { id: 'details', label: PROFILE_SETTINGS_DETAILS_TAB_LABEL },
  { id: 'email', label: PROFILE_SETTINGS_EMAIL_TAB_LABEL },
  { id: 'password', label: PROFILE_SETTINGS_PASSWORD_TAB_LABEL },
  { id: 'other', label: PROFILE_SETTINGS_OTHER_TAB_LABEL },
]

const detailsForm = reactive({ fullName: props.user?.fullName ?? '' })
const emailForm = reactive({ email: props.user?.email ?? '' })
const otherForm = reactive({ avatarUrl: '' })
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const errors = reactive<Record<string, string>>({})

const submitLabel = computed(() => {
  const labels: Record<ProfileSettingsTabId, string> = {
    details: PROFILE_SETTINGS_SAVE_DETAILS_LABEL,
    email: PROFILE_SETTINGS_SAVE_EMAIL_LABEL,
    password: PROFILE_SETTINGS_CHANGE_PASSWORD_LABEL,
    other: PROFILE_SETTINGS_SAVE_OTHER_LABEL,
  }
  return labels[props.activeTab] ?? PROFILE_SETTINGS_SAVE_DETAILS_LABEL
})

watch(() => props.user, (user) => {
  detailsForm.fullName = user?.fullName ?? ''
  emailForm.email = user?.email ?? ''
}, { immediate: true })

const resetErrors = () => Object.keys(errors).forEach((key) => delete errors[key])

const submitDetails = () => {
  resetErrors()
  const result = validateProfileDetailsForm(detailsForm)
  Object.assign(errors, result.errors)
  if (result.payload) emit('save-details', result.payload)
}

const submitEmail = () => {
  resetErrors()
  const result = validateProfileEmailForm(emailForm)
  Object.assign(errors, result.errors)
  if (result.payload) emit('save-email', result.payload)
}

const submitOtherDetails = () => {
  resetErrors()
  const result = validateProfileOtherDetailsForm(otherForm)
  Object.assign(errors, result.errors)
  if (result.payload) emit('save-other-details', result.payload)
}

const submitPassword = () => {
  resetErrors()
  const result = validateProfilePasswordForm(passwordForm)
  Object.assign(errors, result.errors)
  if (result.payload) emit('save-password', result.payload)
}

const submitActiveTab = () => {
  const submitters: Record<ProfileSettingsTabId, () => void> = {
    details: submitDetails,
    email: submitEmail,
    password: submitPassword,
    other: submitOtherDetails,
  }
  submitters[props.activeTab]?.()
}
</script>
