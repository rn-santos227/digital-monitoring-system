<template>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  TRAININGS_BULK_UPDATE_MODAL_DESCRIPTION,
  TRAININGS_BULK_UPDATE_MODAL_TITLE,
  TRAININGS_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { TrainingBulkUpdateValues } from '~/types/domain/training'
import { validateTrainingBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey = keyof TrainingBulkUpdateValues
const fields: readonly { key: FieldKey, label: string, type?: 'date' }[] = Object.freeze([
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'default_remarks', label: 'Default Remarks' },
])

withDefaults(defineProps<{ selectedCount: number, isSubmitting?: boolean, errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})
</script>
