<template>
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
</script>
