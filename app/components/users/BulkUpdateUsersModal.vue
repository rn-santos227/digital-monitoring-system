<template>
  <BaseModal
    :title="USERS_PROFILE_BULK_UPDATE_MODAL_TITLE"
    :description="USERS_PROFILE_BULK_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="USERS_PROFILE_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert v-if="errorMessage || validationError" :message="errorMessage || validationError" tone="danger" />

      <div class="space-y-2 rounded-lg border border-slate-200 p-3">
        <BaseCheckbox v-model="enabled.avatar_url" :label="USERS_PROFILE_AVATAR_URL_LABEL" />
        <BaseTextField
          v-model="avatarUrl"
          type="url"
          :label="USERS_PROFILE_AVATAR_URL_LABEL"
          :placeholder="USERS_PROFILE_AVATAR_URL_PLACEHOLDER"
          helper-text="Leave empty to clear the avatar URL for all selected profiles."
          :disabled="!enabled.avatar_url"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update {{ selectedCount }} selected</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  USERS_PROFILE_AVATAR_URL_LABEL,
  USERS_PROFILE_AVATAR_URL_PLACEHOLDER,
  USERS_PROFILE_BULK_UPDATE_MODAL_DESCRIPTION,
  USERS_PROFILE_BULK_UPDATE_MODAL_TITLE,
  USERS_PROFILE_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { UserProfileBulkUpdateValues } from '~/types/domain/users'
import { validateUserProfileBulkUpdate } from '~/utils/bulk-management-validation'

withDefaults(defineProps<{
  selectedCount: number
  isSubmitting?: boolean
  errorMessage?: string
}>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UserProfileBulkUpdateValues): void
}>()

const enabled = reactive<Record<keyof UserProfileBulkUpdateValues, boolean>>({
  avatar_url: false,
  is_active: false,
})
const avatarUrl = ref('')
const isActive = ref(true)
const validationError = ref('')

const onSubmit = () => {
  const result = validateUserProfileBulkUpdate({
    enabled,
    avatarUrl: avatarUrl.value,
    isActive: isActive.value,
  })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
