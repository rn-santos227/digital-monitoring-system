<template>
  <BaseModal
    :title="ENGAGEMENT_RECORDS_BULK_UPDATE_MODAL_TITLE"
    :description="ENGAGEMENT_RECORDS_BULK_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert :message="ENGAGEMENTS_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert
        v-if="errorMessage || validationError"
        :message="errorMessage || validationError"
        tone="danger"
      />
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="field in fields"
          :key="field.key"
          class="space-y-2 rounded-lg border border-slate-200 p-3"
        >
          <BaseCheckbox v-model="enabled[field.key]" :label="field.label" />
          <BaseDatePicker
            v-if="field.type === 'date'"
            v-model="form[field.key]"
            :label="field.label"
            :disabled="!enabled[field.key]"
          />
          <BaseTextArea
            v-else-if="field.type === 'textarea'"
            v-model="form[field.key]"
            :label="field.label"
            :disabled="!enabled[field.key]"
          />
          <BaseTextField
            v-else
            v-model="form[field.key]"
            :label="field.label"
            :disabled="!enabled[field.key]"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">
          Update {{ selectedCount }} selected
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ENGAGEMENT_RECORDS_BULK_UPDATE_MODAL_TITLE,
  ENGAGEMENT_RECORDS_BULK_UPDATE_MODAL_DESCRIPTION,
  ENGAGEMENTS_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { EngagementBulkUpdateValues } from '~/types/domain/engagement'
import { validateEngagementBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey = 'role' | 'start_date' | 'end_date' | 'remarks'

const fields: readonly {
  key: FieldKey
  label: string
  type: 'date' | 'text' | 'textarea'
}[] = Object.freeze([
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'remarks', label: 'Remarks', type: 'textarea' },
])

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
  (event: 'submit', payload: EngagementBulkUpdateValues): void
}>()

const form = reactive<Record<FieldKey, string>>({
  role: '',
  start_date: '',
  end_date: '',
  remarks: '',
})

const enabled = reactive<Record<FieldKey, boolean>>({
  role: false,
  start_date: false,
  end_date: false,
  remarks: false,
})

const validationError = ref('')

const onSubmit = () => {
  const result = validateEngagementBulkUpdate({
    fields: fields.map((field) => field.key),
    form,
    enabled,
  })
  validationError.value = result.error

  if (result.payload) {
    emit('submit', result.payload)
  }
}
</script>
