<template>
  <BaseModal
    :title="PERSONNEL_BULK_UPDATE_MODAL_TITLE"
    :description="PERSONNEL_BULK_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="PERSONNEL_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert v-if="errorMessage || validationError" :message="errorMessage || validationError" tone="danger" />
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
import BattalionsSuggestionField from '~/components/general/BattalionsSuggestionField.vue'
import CompaniesSuggestionField from '~/components/general/CompaniesSuggestionField.vue'
import RankSuggestionField from '~/components/general/RankSuggestionField.vue'
import {
  PERSONNEL_BULK_UPDATE_MODAL_DESCRIPTION,
  PERSONNEL_BULK_UPDATE_MODAL_TITLE,
  PERSONNEL_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { PersonnelBulkUpdateValues } from '~/types/domain/personnel'
import { validatePersonnelBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey = keyof PersonnelBulkUpdateValues
withDefaults(defineProps<{ selectedCount: number; isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: PersonnelBulkUpdateValues): void
}>()
const form = reactive<Record<FieldKey, string>>({
  rank_id: '',
  company_id: '',
  battalion_id: '',
  position: '',
})
const enabled = reactive<Record<FieldKey, boolean>>({
  rank_id: false,
  company_id: false,
  battalion_id: false,
  position: false,
})
const validationError = ref('')
const onSubmit = () => {
  const result = validatePersonnelBulkUpdate({ form, enabled })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
