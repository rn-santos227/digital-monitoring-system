<template>
  <BaseModal
    :title="TRAININGS_VIEW_MODAL_TITLE"
    :description="TRAININGS_VIEW_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseCard title="Training Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Training</dt>
            <dd class="font-medium text-slate-900">{{ training.trainingTitle }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Category</dt>
            <dd class="font-medium text-slate-900">{{ training.trainingCategoryName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Level</dt>
            <dd class="font-medium text-slate-900">{{ training.levelName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium text-slate-900">{{ training.statusName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Start Date</dt>
            <dd class="font-medium text-slate-900">{{ training.startDate || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">End Date</dt>
            <dd class="font-medium text-slate-900">{{ training.endDate || '—' }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-slate-500">Default Remarks</dt>
            <dd class="font-medium text-slate-900">{{ training.defaultRemarks || '—' }}</dd>
          </div>
        </dl>
      </BaseCard>

      <TrainingPersonnelTable :rows="personnelRows" :is-loading="isPersonnelLoading" />
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">{{ TRAININGS_VIEW_MODAL_CLOSE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { TrainingListItem } from '~/types/domain/training'
import {
  TRAININGS_VIEW_MODAL_CLOSE_LABEL,
  TRAININGS_VIEW_MODAL_DESCRIPTION,
  TRAININGS_VIEW_MODAL_TITLE,
} from '~/constants/page.constants'
import TrainingPersonnelTable from '~/components/trainings/view/TrainingPersonnelTable.vue'

defineProps<{
  training: TrainingListItem
  personnelRows: readonly Record<string, unknown>[]
  isPersonnelLoading?: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>
