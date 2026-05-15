<template>
  <BaseModal
    title="Engagement"
    description="View engagement profile details."
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseCard title="Engagement Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Title</dt>
            <dd class="font-medium">{{ engagement.engagementTitle || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Type</dt>
            <dd class="font-medium">{{ engagement.engagementCategoryName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Level</dt>
            <dd class="font-medium">{{ engagement.levelName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium">{{ engagement.statusName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Start Date</dt>
            <dd class="font-medium">{{ formatDate(engagement.startDate) }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">End Date</dt>
            <dd class="font-medium">{{ formatDate(engagement.endDate) }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-slate-500">Default Remarks</dt>
            <dd class="font-medium">{{ engagement.defaultRemarks || '—' }}</dd>
          </div>
        </dl>
      </BaseCard>

      <EngagementPersonnelTable :rows="personnelRows" />
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">Close</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useDateDisplay } from '~/composables/useDateDisplay'
import EngagementPersonnelTable from '~/components/engagements/views/EngagementPersonnelTable.vue'
import type { EngagementManagementListItem } from '~/types/domain/engagement'

const { formatDate } = useDateDisplay()

defineProps<{
  engagement: EngagementManagementListItem
  personnelRows: readonly Record<string, unknown>[]
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>
