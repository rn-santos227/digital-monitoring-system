<template>
  <BaseModal
    :title="USERS_ACCOUNT_BULK_UPDATE_MODAL_TITLE"
    :description="USERS_ACCOUNT_BULK_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="USERS_ACCOUNT_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert v-if="errorMessage || validationError" :message="errorMessage || validationError" tone="danger" />

      <div class="space-y-2 rounded-lg border border-slate-200 p-3">
        <BaseCheckbox v-model="enabled.description" :label="USERS_ACCOUNT_DESCRIPTION_LABEL" />
        <BaseTextArea
          v-model="description"
          :label="USERS_ACCOUNT_DESCRIPTION_LABEL"
          :placeholder="USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER"
          helper-text="Leave empty to clear the description for all selected account types."
          :disabled="!enabled.description"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  USERS_ACCOUNT_BULK_UPDATE_MODAL_DESCRIPTION,
  USERS_ACCOUNT_BULK_UPDATE_MODAL_TITLE,
  USERS_ACCOUNT_BULK_UPDATE_WARNING,
  USERS_ACCOUNT_DESCRIPTION_LABEL,
  USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER,
  USERS_ACCOUNT_IS_SYSTEM_DESCRIPTION,
  USERS_ACCOUNT_IS_SYSTEM_LABEL,
} from '~/constants/page.constants'
import type { AccountTypeBulkUpdateValues } from '~/types/domain/users'
import { validateAccountTypeBulkUpdate } from '~/utils/bulk-management-validation'

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
  (event: 'submit', payload: AccountTypeBulkUpdateValues): void
}>()

const enabled = reactive<Record<keyof AccountTypeBulkUpdateValues, boolean>>({
  description: false,
  is_system: false,
})
const description = ref('')
const isSystem = ref(false)
const validationError = ref('')

const onSubmit = () => {
  const result = validateAccountTypeBulkUpdate({
    enabled,
    description: description.value,
    isSystem: isSystem.value,
  })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
