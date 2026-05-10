<template>
  <main class="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
    <section :class="PERSONNEL_PROFILE_PAGE_SECTION_CLASSES">
      <header :class="PERSONNEL_PROFILE_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ PERSONNEL_PROFILE_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ PERSONNEL_PROFILE_PAGE_SUBTITLE }}</p>
      </header>

      <BaseAlert
        v-if="!canViewPersonnel"
        message="You do not have permission to view personnel records."
        tone="warning"
      />

      <template v-else>
        <BaseAlert v-if="personnelError" :message="personnelError" tone="danger" />

        <template v-if="personnel">
          <div class="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <BaseCard>
              <div class="flex flex-col items-center gap-4 text-center">
                <BaseImage size="lg" :alt="personnel.fullName" :fallback-text="personnel.fullName" />
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold text-slate-900">{{ personnel.fullName }}</h2>
                  <p class="text-sm text-slate-600">{{ personnel.rankName }} · {{ personnel.personnelCode }}</p>
                </div>
                <div class="w-full space-y-2 rounded-xl bg-slate-50 p-3 text-left text-sm">
                  <p><span class="font-semibold">Serial Number:</span> {{ personnel.serviceNumber }}</p>
                  <p><span class="font-semibold">Company:</span> {{ personnel.companyName ?? 'Unassigned' }}</p>
                  <p><span class="font-semibold">Battalion:</span> {{ personnel.battalionName ?? 'Unassigned' }}</p>
                  <p><span class="font-semibold">Service Status:</span> {{ personnel.serviceStatus }}</p>
                </div>
              </div>
            </BaseCard>

            <BaseCard :title="PERSONNEL_PROFILE_TAB_CARD_TITLES.core">
              <div :class="PERSONNEL_PROFILE_GRID_CLASSES">
                <p><span class="font-semibold">Personnel Code:</span> {{ personnel.personnelCode }}</p>
                <p><span class="font-semibold">Serial Number:</span> {{ personnel.serviceNumber }}</p>
                <p><span class="font-semibold">Name:</span> {{ personnel.fullName }}</p>
                <p><span class="font-semibold">Sex:</span> {{ personnel.sex }}</p>
                <p><span class="font-semibold">Birthdate:</span> {{ personnel.birthdate ?? 'Not set' }}</p>
                <p><span class="font-semibold">Age:</span> {{ personnel.age ?? 'Not available' }}</p>
                <p><span class="font-semibold">Position:</span> {{ personnel.position ?? 'Not set' }}</p>
                <p><span class="font-semibold">Date Enlisted:</span> {{ personnel.dateEnlisted ?? 'Not set' }}</p>
                <p><span class="font-semibold">Contact Number:</span> {{ personnel.contactNumber ?? 'Not set' }}</p>
                <p><span class="font-semibold">Employment Status:</span> {{ personnel.employmentStatus }}</p>
                <p><span class="font-semibold">Created At:</span> {{ personnel.createdAt }}</p>
                <p><span class="font-semibold">Updated At:</span> {{ personnel.updatedAt }}</p>
              </div>
            </BaseCard>
          </div>

          <BaseTab
            :model-value="activeTab"
            :items="PERSONNEL_PROFILE_TAB_ITEMS"
            :aria-label="PERSONNEL_PROFILE_TABS_ARIA_LABEL"
            @update:model-value="onTabChange"
          />

          <TrainingTable v-if="activeTab === 'training'" :rows="trainingRows" />
          <DeploymentTable v-else-if="activeTab === 'deployment'" :rows="deploymentRows" />
          <EngagementTable v-else-if="activeTab === 'engagement'" :rows="engagementRows" />
          <EquipmentAssignmentTable v-else-if="activeTab === 'equipment-assignment'" />
          <BaseCard v-else :title="PERSONNEL_PROFILE_TAB_CARD_TITLES.core">
            <p class="text-sm text-slate-600">
              Use the profile  tabs to review training records, deployment records, engagement records, and equipment assignments.
            </p>
          </BaseCard>
        </template>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DeploymentTable from '~/components/personnel/PersonnelDeploymentsTable.vue'
import EngagementTable from '~/components/personnel/PersonnelEngagementsTable.vue'
import EquipmentAssignmentTable from '~/components/personnel/PersonnelEquipmentAssignmentsTable.vue'
import TrainingTable from '~/components/personnel/PersonnelTrainingsTable.vue'
import {
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PROFILE_PAGE_SUBTITLE,
  PERSONNEL_PROFILE_PAGE_TITLE,
  PERSONNEL_PROFILE_TAB_CARD_TITLES,
  PERSONNEL_PROFILE_TAB_ITEMS,
  PERSONNEL_PROFILE_TABS_ARIA_LABEL,
} from '~/constants/page.constants'
import {
  PERSONNEL_PROFILE_GRID_CLASSES,
  PERSONNEL_PROFILE_PAGE_HEADER_CLASSES,
  PERSONNEL_PROFILE_PAGE_SECTION_CLASSES,
} from '~/constants/shared.constants'
import { useAuthStore } from '~/stores/auth'
import { 
  getPersonnelDeploymentRecordsEndpoint,
  getPersonnelEngagementRecordsEndpoint,
  getPersonnelTrainingRecordsEndpoint
} from '~/utils/personnel-endpoints'
import { usePersonnelStore } from '~/stores/personnel'
import type { 
  PersonnelDeploymentRecordListItem,
  PersonnelDetail,
  PersonnelEngagementRecordListItem,
  PersonnelProfileTabId,
  PersonnelTrainingRecordListItem
} from '~/types/domain/personnel'

const route = useRoute()
const authStore = useAuthStore()
const personnelStore = usePersonnelStore()

const activeTab = ref<PersonnelProfileTabId>('core')
const personnel = ref<(PersonnelDetail & { fullName: string }) | null>(null)
const personnelError = ref('')
const trainingRows = ref<{ id: string; courseName: string; provider: string; completedAt: string; remarks: string }[]>([])
const deploymentRows = ref<{ id: string; location: string; operationName: string; startedAt: string; endedAt: string; status: string }[]>([])
const engagementRows = ref<{ id: string; eventType: string; location: string; recordedAt: string; outcome: string }[]>([])

const canViewPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.view)
})

const personnelId = computed(() => {
  const idValue = route.params.id
  return Array.isArray(idValue) ? (idValue[0] ?? '') : (idValue ?? '')
})

watch([canViewPersonnel, personnelId], async ([hasAccess, id]) => {
  if (!hasAccess || !id) {
    return
  }

  personnelError.value = ''

  try {
    const response = await personnelStore.fetchPersonnelById(id)
      const [trainingResponse, deploymentResponse, engagementResponse] = await Promise.all([
      getPersonnelTrainingRecordsEndpoint(id),
      getPersonnelDeploymentRecordsEndpoint(id),
      getPersonnelEngagementRecordsEndpoint(id),
    ])
    const fullName = [response.firstName, response.middleName, response.lastName].filter(Boolean).join(' ')
    personnel.value = {
      ...response,
      fullName,
    }
    trainingRows.value = trainingResponse.items.map((item: PersonnelTrainingRecordListItem) => ({
      id: item.id,
      courseName: item.title,
      provider: item.category ?? 'N/A',
      completedAt: item.endDate ?? item.validUntil ?? item.startDate ?? 'Not set',
      remarks: item.remarks ?? '—',
    }))
    deploymentRows.value = deploymentResponse.items.map((item: PersonnelDeploymentRecordListItem) => ({
      id: item.id,
      location: item.location ?? item.deploymentArea,
      operationName: item.operationName ?? 'N/A',
      startedAt: item.startDate,
      endedAt: item.endDate ?? 'Ongoing',
      status: item.status,
    }))
    engagementRows.value = engagementResponse.items.map((item: PersonnelEngagementRecordListItem) => ({
      id: item.id,
      eventType: item.type,
      location: item.title,
      recordedAt: item.dateStart ?? 'Not set',
      outcome: item.status,
    }))
  } catch {
    personnelError.value = personnelStore.error || 'Unable to load personnel profile.'
  }
}, { immediate: true })

const onTabChange = (nextTab: string) => {
  if (nextTab === 'core' || nextTab === 'training' || nextTab === 'deployment' || nextTab === 'engagement' || nextTab === 'equipment-assignment') {
    activeTab.value = nextTab
  }
}
</script>
