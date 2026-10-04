<template>
  <BaseModal :title="RANK_BULK_UPDATE_MODAL_TITLE" :description="RANK_BULK_UPDATE_MODAL_DESCRIPTION" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="warningMessage || RANK_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert v-if="errorMessage || validationError" :message="errorMessage || validationError" tone="danger" />
      <BaseTextField v-model="sortOrder" type="number" min="0" label="Sort Order" placeholder="Enter a non-negative whole number" required />
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
import { ref } from 'vue'
import {
  RANK_BULK_UPDATE_MODAL_DESCRIPTION,
  RANK_BULK_UPDATE_MODAL_TITLE,
  RANK_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { RankBulkUpdateValues } from '~/types/domain/rank'
import { validateRankBulkUpdate } from '~/utils/bulk-management-validation'

withDefaults(
  defineProps<{
    selectedCount: number
    isSubmitting?: boolean
    errorMessage?: string
    warningMessage?: string
  }>(),
  {
    isSubmitting: false,
    errorMessage: '',
    warningMessage: '',
  },
)
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: RankBulkUpdateValues): void
}>()
const sortOrder = ref('')
const validationError = ref('')
const onSubmit = () => {
  const result = validateRankBulkUpdate(sortOrder.value)
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
