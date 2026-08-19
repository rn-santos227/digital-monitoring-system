<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ENGAGEMENTS_BULK_UPDATE_MODAL_TITLE,
  ENGAGEMENTS_BULK_UPDATE_MODAL_DESCRIPTION,
  ENGAGEMENTS_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { EngagementBulkUpdateValues } from '~/types/domain/engagement'
import { validateEngagementBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey = 'start_date' | 'end_date' | 'default_remarks'

const fields: readonly {
  key: FieldKey
  label: string
  type: 'date' | 'text' | 'textarea'
}[] = Object.freeze([
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'default_remarks', label: 'Default Remarks', type: 'textarea' },
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
</script>
