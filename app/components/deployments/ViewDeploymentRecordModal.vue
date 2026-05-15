<template>
  <BaseModal
    title="Deployment Record"
    description="View deployment record details."
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseTab
        :model-value="activeTab"
        :items="VIEW_RECORD_TAB_ITEMS"
        aria-label="Deployment record view tabs"
        @update:model-value="onTabChange"
      />

      <BaseCard v-if="activeTab === 'details'" title="Record Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Record No.</dt>
            <dd class="font-medium">{{ deploymentRecord.recordNo || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Personnel</dt>
            <dd class="font-medium">{{ deploymentRecord.personnelName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Operation</dt>
            <dd class="font-medium">{{ deploymentRecord.operationName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Assignment Role</dt>
            <dd class="font-medium">{{ deploymentRecord.assignmentRole || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Deployment Area</dt>
            <dd class="font-medium">{{ deploymentRecord.deploymentArea || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Location</dt>
            <dd class="font-medium">{{ deploymentRecord.location || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium">{{ deploymentRecord.statusName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Start Date</dt>
            <dd class="font-medium">{{ formatDate(deploymentRecord.startDate) }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">End Date</dt>
            <dd class="font-medium">{{ formatDate(deploymentRecord.startDate) }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-slate-500">Remarks</dt>
            <dd class="font-medium">{{ deploymentRecord.remarks || '—' }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseGeoMap
        v-else
        title="Deployment Geolocation"
        subtitle="Recorded deployment coordinates for this deployment record."
        :latitude="deploymentRecord.deploymentAreaLatitude"
        :longitude="deploymentRecord.deploymentAreaLongitude"
      />
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">Close</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import type { BaseTabItem } from '~/constants/ui.constants'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'

const { formatDate } = useDateDisplay()

const VIEW_RECORD_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'details', label: 'Details' },
  { id: 'map', label: 'Geomap' },
])

defineProps<{
  deploymentRecord: DeploymentManagementListItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const activeTab = ref<'details' | 'map'>('details')

const onTabChange = (value: string) => {
  activeTab.value = value === 'map' ? 'map' : 'details'
}
</script>
