<template>
  <BaseModal
    :title="AUDIT_MODAL_TITLE"
    :description="AUDIT_MODAL_DESCRIPTION"
    size="xl"
    @close="emit('close')"
  >
    <div :class="AUDIT_MODAL_CONTENT_CLASSES">
      <BaseInlineLoader v-if="isLoading" label="Loading audit details..." />

      <p v-else-if="error" class="text-sm text-rose-600">{{ error }}</p>

      <p v-else-if="!auditLog" class="text-sm text-slate-500">{{ AUDIT_MODAL_EMPTY_LOG_MESSAGE }}</p>

      <template v-else>
        <section :class="AUDIT_MODAL_SUMMARY_GRID_CLASSES">
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">Action</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ auditLog.action }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">Entity</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ auditLog.tableName }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">Record ID</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ auditLog.recordId ?? 'N/A' }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">Status Code</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ auditLog.statusCode ?? 'N/A' }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">IP Address</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ auditLog.ipAddress ?? 'N/A' }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">Actor</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ actorLabel }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">Actor Email</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ actorEmail }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">User ID</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ auditLog.userId ?? 'N/A' }}</p>
          </div>
          <div>
            <p :class="AUDIT_MODAL_SUMMARY_LABEL_CLASSES">Timestamp</p>
            <p :class="AUDIT_MODAL_SUMMARY_VALUE_CLASSES">{{ formattedTimestamp }}</p>
          </div>
        </section>

        <BaseAccordion :title="AUDIT_MODAL_OLD_DATA_SECTION_LABEL">
          <pre :class="AUDIT_MODAL_CODE_BLOCK_CLASSES">{{ oldDataBlock }}</pre>
        </BaseAccordion>

        <BaseAccordion :title="AUDIT_MODAL_NEW_DATA_SECTION_LABEL">
          <pre :class="AUDIT_MODAL_CODE_BLOCK_CLASSES">{{ newDataBlock }}</pre>
        </BaseAccordion>

        <BaseAccordion :title="AUDIT_MODAL_REQUEST_SECTION_LABEL" :initially-open="true">
          <pre :class="AUDIT_MODAL_CODE_BLOCK_CLASSES">{{ requestBlock }}</pre>
        </BaseAccordion>

        <BaseAccordion :title="AUDIT_MODAL_RESPONSE_SECTION_LABEL">
          <pre :class="AUDIT_MODAL_CODE_BLOCK_CLASSES">{{ responseBlock }}</pre>
        </BaseAccordion>

        <BaseAccordion :title="AUDIT_MODAL_HEADERS_SECTION_LABEL">
          <pre :class="AUDIT_MODAL_CODE_BLOCK_CLASSES">{{ headersBlock }}</pre>
        </BaseAccordion>

        <BaseAccordion :title="AUDIT_MODAL_METADATA_SECTION_LABEL">
          <pre :class="AUDIT_MODAL_CODE_BLOCK_CLASSES">{{ metadataBlock }}</pre>
        </BaseAccordion>
      </template>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton type="button" variant="ghost" @click="emit('close')">{{ AUDIT_MODAL_CLOSE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  AUDIT_MODAL_CLOSE_LABEL,
  AUDIT_MODAL_DESCRIPTION,
  AUDIT_MODAL_EMPTY_LOG_MESSAGE,
  AUDIT_MODAL_HEADERS_SECTION_LABEL,
  AUDIT_MODAL_METADATA_SECTION_LABEL,
  AUDIT_MODAL_NEW_DATA_SECTION_LABEL,
  AUDIT_MODAL_OLD_DATA_SECTION_LABEL,
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

const actorLabel = computed(() => {
  const actorName = props.auditLog?.actor?.fullName?.trim()

  if (actorName) {
    return actorName
  }

  const actorEmail = props.auditLog?.actor?.email?.trim()
  return actorEmail || 'System'
})

const actorEmail = computed(() => props.auditLog?.actor?.email?.trim() || 'N/A')

const formattedTimestamp = computed(() => {
  if (!props.auditLog?.createdAt) {
    return 'N/A'
  }

  return formatAuditTimestamp(props.auditLog.createdAt)
})

const oldDataBlock = computed(() => formatAuditJson(props.auditLog?.oldData ?? null))
const newDataBlock = computed(() => formatAuditJson(props.auditLog?.newData ?? null))
const requestBlock = computed(() => formatAuditJson(props.auditLog?.requestData ?? null))
const responseBlock = computed(() => formatAuditJson(props.auditLog?.responseData ?? null))
const headersBlock = computed(() => formatAuditJson(props.auditLog?.requestHeaders ?? null))
const metadataBlock = computed(() => formatAuditJson(props.auditLog?.metadata ?? null))
</script>
