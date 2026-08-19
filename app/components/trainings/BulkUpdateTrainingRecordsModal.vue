<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  TRAINING_RECORDS_BULK_UPDATE_MODAL_DESCRIPTION,
  TRAINING_RECORDS_BULK_UPDATE_MODAL_TITLE,
  TRAININGS_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { TrainingRecordBulkUpdateValues } from '~/types/domain/training'
import { validateTrainingBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey = keyof TrainingRecordBulkUpdateValues
const fields: readonly { key: FieldKey, label: string, type?: 'date' }[] = Object.freeze([
  { key: 'certificate_no', label: 'Certificate No.' },
  { key: 'valid_until', label: 'Valid Until', type: 'date' },
  { key: 'remarks', label: 'Remarks' },
])
</script>
