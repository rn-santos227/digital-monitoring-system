<template>
  <BaseModal
    :title="TRAINING_RECORDS_VIEW_MODAL_TITLE"
    :description="TRAINING_RECORDS_VIEW_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseCard title="Training Record Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Record No.</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.recordNo || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Certificate No.</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.certificateNo || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Personnel Code</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.personnelCode || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Personnel</dt>
            <dd class="font-medium text-slate-900">
              <NuxtLink
                v-if="trainingRecord.personnelId"
                :to="ROUTE_PATHS.personnelProfile(trainingRecord.personnelId)"
                class="text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                {{ trainingRecord.personnelName || '—' }}
              </NuxtLink>
              <span v-else>{{ trainingRecord.personnelName || '—' }}</span>
            </dd>
          </div>
          <div>
            <dt class="text-slate-500">Training</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.trainingTitle || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Category</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.trainingCategoryName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.statusName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Valid Until</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.validUntil || '—' }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-slate-500">Remarks</dt>
            <dd class="font-medium text-slate-900">{{ trainingRecord.remarks || '—' }}</dd>
          </div>
        </dl>
      </BaseCard>

    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">{{ TRAINING_RECORDS_VIEW_MODAL_CLOSE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { TrainingRecordListItem } from '~/types/domain/training'
import {
  TRAINING_RECORDS_VIEW_MODAL_CLOSE_LABEL,
  TRAINING_RECORDS_VIEW_MODAL_DESCRIPTION,
  TRAINING_RECORDS_VIEW_MODAL_TITLE,
} from '~/constants/page.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
defineProps<{
  trainingRecord: TrainingRecordListItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>
