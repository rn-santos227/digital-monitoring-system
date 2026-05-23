<template>
  <BaseModal
    :title="ENGAGEMENT_RECORDS_VIEW_MODAL_TITLE"
    :description="ENGAGEMENT_RECORDS_VIEW_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <BaseCard title="Engagement Record Information">
      <dl class="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <dt class="text-slate-500">Record No.</dt>
          <dd class="font-medium text-slate-900">{{ record.recordNo || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Personnel</dt>
          <dd class="font-medium text-slate-900">{{ record.personnelName || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Engagement</dt>
          <dd class="font-medium text-slate-900">{{ record.engagementTitle || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Category</dt>
          <dd class="font-medium text-slate-900">{{ record.engagementCategoryName || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Level</dt>
          <dd class="font-medium text-slate-900">{{ record.levelName || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Status</dt>
          <dd class="font-medium text-slate-900">{{ record.statusName || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Start Date</dt>
          <dd class="font-medium text-slate-900">{{ record.startDate || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">End Date</dt>
          <dd class="font-medium text-slate-900">{{ record.endDate || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Role</dt>
          <dd class="font-medium text-slate-900">{{ record.role || '—' }}</dd>
        </div>

        <div>
          <dt class="text-slate-500">Location</dt>
          <dd class="font-medium text-slate-900">{{ record.location || '—' }}</dd>
        </div>

        <div class="md:col-span-2">
          <dt class="text-slate-500">Remarks</dt>
          <dd class="font-medium text-slate-900">{{ record.remarks || '—' }}</dd>
        </div>
      </dl>
    </BaseCard>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">
          {{ ENGAGEMENT_RECORDS_VIEW_MODAL_CLOSE_LABEL }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import {
  ENGAGEMENT_RECORDS_VIEW_MODAL_CLOSE_LABEL,
  ENGAGEMENT_RECORDS_VIEW_MODAL_DESCRIPTION,
  ENGAGEMENT_RECORDS_VIEW_MODAL_TITLE,
} from '~/constants/page.constants'
import type { EngagementManagementListItem } from '~/types/domain/engagement'

defineProps<{
  record: EngagementManagementListItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>
