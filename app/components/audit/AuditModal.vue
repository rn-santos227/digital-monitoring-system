<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  AUDIT_MODAL_CLOSE_LABEL,
  AUDIT_MODAL_DESCRIPTION,
  AUDIT_MODAL_EMPTY_LOG_MESSAGE,
  AUDIT_MODAL_HEADERS_SECTION_LABEL,
  AUDIT_MODAL_METADATA_SECTION_LABEL,
  AUDIT_MODAL_REQUEST_SECTION_LABEL,
  AUDIT_MODAL_RESPONSE_SECTION_LABEL,
  AUDIT_MODAL_TITLE,
} from '~/constants/page.constants'
import {
  AUDIT_MODAL_CODE_BLOCK_CLASSES,
  AUDIT_MODAL_CONTENT_CLASSES,
  AUDIT_MODAL_SUMMARY_GRID_CLASSES,
  AUDIT_MODAL_SUMMARY_LABEL_CLASSES,
  AUDIT_MODAL_SUMMARY_VALUE_CLASSES,
} from '~/constants/shared.constants'
import type { AuditLogDetail } from '~/types/domain/audit'
import { formatAuditJson, formatAuditTimestamp } from '~/utils/audit'

const props = defineProps<{
  auditLog: AuditLogDetail | null
  isLoading: boolean
  error: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

</script>
