<template>
  <BaseModal
    :title="DEPLOYMENTS_VIEW_MODAL_TITLE"
    :description="DEPLOYMENTS_VIEW_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseTab
        :model-value="activeTab"
        :items="DEPLOYMENTS_VIEW_TAB_ITEMS"
        :aria-label="DEPLOYMENTS_VIEW_TAB_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <BaseCard v-if="activeTab === 'details'" :title="DEPLOYMENTS_VIEW_DETAILS_CARD_TITLE">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Operation Name</dt>
            <dd class="font-medium text-slate-900">{{ deployment.operationName || '-' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Assignment Role</dt>
            <dd class="font-medium text-slate-900">{{ deployment.assignmentRole || '-' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Deployment Area</dt>
            <dd class="font-medium text-slate-900">{{ deployment.deploymentArea || '-' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Location</dt>
            <dd class="font-medium text-slate-900">{{ deployment.location || '-' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium text-slate-900">{{ resolvedStatusLabel }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Supervisor Personnel ID</dt>
            <dd class="font-medium text-slate-900">{{ deployment.supervisorId || '-' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Start Date</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(deployment.startDate) || '-' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">End Date</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(deployment.endDate) || '-' }}</dd>
          </div>
          <div class="md:col-span-2">
            <dt class="text-slate-500">Default Remarks</dt>
            <dd class="font-medium text-slate-900">{{ deployment.defaultRemarks || '-' }}</dd>
          </div>
        </dl>
      </BaseCard>

      <DeploymentPersonnelTable
        v-if="activeTab === 'details'"
        :rows="deploymentPersonnelRows"
      />

      <BaseGeoMap
        v-else
        :title="DEPLOYMENTS_VIEW_MAP_TITLE"
        :subtitle="DEPLOYMENTS_VIEW_MAP_SUBTITLE"
        :latitude="deployment.deploymentAreaLatitude"
        :longitude="deployment.deploymentAreaLongitude"
      />
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">{{ DEPLOYMENTS_VIEW_MODAL_CLOSE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'
import {
  DEPLOYMENTS_VIEW_DETAILS_CARD_TITLE,
  DEPLOYMENTS_VIEW_MAP_SUBTITLE,
  DEPLOYMENTS_VIEW_MAP_TITLE,
  DEPLOYMENTS_VIEW_MODAL_CLOSE_LABEL,
  DEPLOYMENTS_VIEW_MODAL_DESCRIPTION,
  DEPLOYMENTS_VIEW_MODAL_TITLE,
  DEPLOYMENTS_VIEW_TAB_ARIA_LABEL,
  DEPLOYMENTS_VIEW_TAB_ITEMS,
} from '~/constants/page.constants'
import DeploymentPersonnelTable from '~/components/deployments/view/DeploymentPersonnelTable.vue'

const { formatDate } = useDateDisplay()

const props = defineProps<{
  deployment: DeploymentManagementListItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const activeTab = ref<'details' | 'map'>('details')

const deploymentPersonnelRows = computed(() => {
  const personnelList = props.deployment.deploymentPersonnel ?? []

  return personnelList.map((personnel) => ({
    personnelCode: String(personnel.personnelCode ?? '—'),
    fullName: String(personnel.fullName ?? '—'),
    rankName: String(personnel.rankName ?? '—'),
    serviceStatus: String(personnel.serviceStatus ?? '—'),
  }))
})

const resolvedStatusLabel = computed(() => {
  const statusName = String(props.deployment.statusName ?? '').trim()
  if (statusName.length > 0) {
    return statusName
  }
})

const onTabChange = (value: string) => {
  activeTab.value = value === 'map' ? 'map' : 'details'
}
</script>
