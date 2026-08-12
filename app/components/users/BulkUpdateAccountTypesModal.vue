<template>

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
</script>
