<template>

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


</script>
