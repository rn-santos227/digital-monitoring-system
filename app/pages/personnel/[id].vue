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
          <div class="flex justify-end">
            <PrintDataListButton
              table-name="personnel"
              table-label="Personnel Profile"
              :filters="{ id: personnel.id }"
              :get-print-data="handlePrintPersonnelProfile"
              show-label
            />
          </div>

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

            <BaseCard title="Personal Overview">
              <div :class="PERSONNEL_PROFILE_GRID_CLASSES">
                <p><span class="font-semibold">Personnel Code:</span> {{ personnel.personnelCode }}</p>
                <p><span class="font-semibold">Serial Number:</span> {{ personnel.serviceNumber }}</p>
                <p><span class="font-semibold">Name:</span> {{ personnel.fullName }}</p>
                <p><span class="font-semibold">Sex:</span> {{ personnel.sex }}</p>
                <p><span class="font-semibold">Birthdate:</span> {{ formatDate(personnel.birthdate, 'Not set') }}</p>
                <p><span class="font-semibold">Age:</span> {{ personnel.age ?? 'Not available' }}</p>
                <p><span class="font-semibold">Position:</span> {{ personnel.position ?? 'Not set' }}</p>
                <p><span class="font-semibold">Date Enlisted:</span> {{ formatDate(personnel.dateEnlisted, 'Not set') }}</p>
                <p><span class="font-semibold">Contact Number:</span> {{ personnel.contactNumber ?? 'Not set' }}</p>
                <p><span class="font-semibold">Employment Status:</span> {{ personnel.employmentStatus }}</p>
                <p><span class="font-semibold">Created At:</span> {{ formatDate(personnel.createdAt) }}</p>
                <p><span class="font-semibold">Updated At:</span> {{ formatDate(personnel.updatedAt) }}</p>
              </div>
            </BaseCard>
          </div>

          <BaseTab
            :model-value="activeTab"
            :items="PERSONNEL_PROFILE_TAB_ITEMS"
            :aria-label="PERSONNEL_PROFILE_TABS_ARIA_LABEL"
            @update:model-value="onTabChange"
          />

         <div v-if="activeTab === 'training' || activeTab === 'deployment' || activeTab === 'engagement' || activeTab === 'equipment-assignment'" class="mb-4 flex justify-end">
            <BaseButton v-if="activeTab === 'deployment' && canAssignDeployment" @click="activeAssignModal = 'deployment'">
              Quick Assign Deployment
            </BaseButton>
            <BaseButton v-if="activeTab === 'engagement' && canAssignEngagement" @click="activeAssignModal = 'engagement'">
              Quick Assign Engagement
            </BaseButton>
            <BaseButton v-if="activeTab === 'equipment-assignment' && canAssignEquipment" @click="activeAssignModal = 'equipment'">
              Quick Assign Equipment
            </BaseButton>
            <BaseButton v-if="activeTab === 'training' && canAssignTraining" @click="activeAssignModal = 'training'">
              Quick Assign Training
            </BaseButton>
          </div>

          <DeploymentTable v-if="activeTab === 'deployment'" :rows="deploymentRows" />
          <EngagementTable v-else-if="activeTab === 'engagement'" :rows="engagementRows" />
          <EquipmentAssignmentTable v-else-if="activeTab === 'equipment-assignment'" :rows="equipmentAssignmentRows" />
          <TrainingTable v-else :rows="trainingRows" />

          <QuickAssignDeploymentModal
            v-if="activeAssignModal === 'deployment' && canAssignDeployment"
            :is-submitting="isSubmitting"
            :error-message="assignError"
            @close="onCloseAssignModal"
            @submit="onSubmitAssignDeployment"
          />

          <QuickAssignEngagementModal
            v-if="activeAssignModal === 'engagement' && canAssignEngagement"
            :is-submitting="isSubmitting"
            :error-message="assignError"
            @close="onCloseAssignModal"
            @submit="onSubmitAssignEngagement"
          />

          <QuickAssignTrainingModal
            v-if="activeAssignModal === 'training' && canAssignTraining"
            :is-submitting="isSubmitting"
            :error-message="assignError"
            @close="onCloseAssignModal"
            @submit="onSubmitAssignTraining"
          />

          <QuickAssignEquipmentModal
            v-if="activeAssignModal === 'equipment' && canAssignEquipment"
            :personnel-id="personnelId"
            :is-submitting="isSubmitting"
            :error-message="assignError"
            @close="onCloseAssignModal"
            @submit="onSubmitAssignEquipment"
          />
        </template>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import { usePersonnelProfileHandlers, usePersonnelProfileLoader } from '~/handlers/personnel'
import {
  DEPLOYMENT_PRIVILEGES,
  ENGAGEMENT_PRIVILEGES,
  EQUIPMENT_PRIVILEGES,
  TRAINING_PRIVILEGES,
} from '~/constants/privileges.constants'
import type {
  PersonnelProfileTrainingRow,
  PersonnelProfileDeploymentRow,
  PersonnelProfileEngagementRow,
  PersonnelProfileEquipmentRow,
} from '~/constants/ui.constants'
import { createCurrentValuePrintHandler } from '~/handlers/shared'
import { computed, ref, watch } from 'vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import { useDialog } from '~/composables/useDialog'
import { useAssignments } from '~/composables/useAssignments'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import DeploymentTable from '~/components/personnel/PersonnelDeploymentsTable.vue'
import EngagementTable from '~/components/personnel/PersonnelEngagementsTable.vue'
import EquipmentAssignmentTable from '~/components/personnel/PersonnelEquipmentAssignmentsTable.vue'
import TrainingTable from '~/components/personnel/PersonnelTrainingsTable.vue'
import QuickAssignDeploymentModal from '~/components/service-status/QuickAssignDeploymentModal.vue'
import QuickAssignEngagementModal from '~/components/service-status/QuickAssignEngagementModal.vue'
import QuickAssignTrainingModal from '~/components/service-status/QuickAssignTrainingModal.vue'
import QuickAssignEquipmentModal from '~/components/service-status/QuickAssignEquipmentModal.vue'
import {
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PROFILE_PAGE_SUBTITLE,
  PERSONNEL_PROFILE_PAGE_TITLE,
  PERSONNEL_PROFILE_TAB_ITEMS,
  PERSONNEL_PROFILE_TABS_ARIA_LABEL,
} from '~/constants/page.constants'
import {
  PERSONNEL_PROFILE_GRID_CLASSES,
  PERSONNEL_PROFILE_PAGE_HEADER_CLASSES,
  PERSONNEL_PROFILE_PAGE_SECTION_CLASSES,
} from '~/constants/shared.constants'
import { useAuthStore } from '~/stores/auth'
import { usePersonnelStore } from '~/stores/personnel'
import type { PersonnelDetail, PersonnelProfileTabId } from '~/types/domain/personnel'
import type { ActiveServiceStatusModal } from '~/types/domain/service-status'
import { usePrintPersonnelHandler } from '~/handlers'

const { formatDate } = useDateDisplay()
const { showDialog } = useDialog()
const { isSubmitting, error: assignError, assignDeployment, assignEngagement, assignTraining, assignEquipment } = useAssignments()
const route = useRoute()
const authStore = useAuthStore()
const personnelStore = usePersonnelStore()
const { printPersonnelProfile } = usePrintPersonnelHandler()

const activeTab = ref<PersonnelProfileTabId>('training')
const personnel = ref<(PersonnelDetail & { fullName: string }) | null>(null)
const personnelError = ref('')
const trainingRows = ref<PersonnelProfileTrainingRow[]>([])
const deploymentRows = ref<PersonnelProfileDeploymentRow[]>([])
const engagementRows = ref<PersonnelProfileEngagementRow[]>([])
const equipmentAssignmentRows = ref<PersonnelProfileEquipmentRow[]>([])
const activeAssignModal = ref<ActiveServiceStatusModal>(null)

const canAssignDeployment = computed(() => authStore.hasAnyPermissionAccess(DEPLOYMENT_PRIVILEGES.manage))
const canAssignEngagement = computed(() => authStore.hasAnyPermissionAccess(ENGAGEMENT_PRIVILEGES.manage))
const canAssignTraining = computed(() => authStore.hasAnyPermissionAccess(TRAINING_PRIVILEGES.manage))
const canAssignEquipment = computed(() => authStore.hasAnyPermissionAccess(EQUIPMENT_PRIVILEGES.mutateIssuance))

const canViewPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.view)
})

const personnelId = computed(() => {
  const idValue = route.params.id
  return Array.isArray(idValue) ? (idValue[0] ?? '') : (idValue ?? '')
})

const handlePrintPersonnelProfile = createCurrentValuePrintHandler(personnel, printPersonnelProfile)

const {
  loadPersonnelProfile,
} = usePersonnelProfileLoader({
  personnelStore,
  personnel,
  trainingRows,
  deploymentRows,
  engagementRows,
  equipmentAssignmentRows,
})

watch([canViewPersonnel, personnelId], async ([hasAccess, id]) => {
  if (!hasAccess || !id) {
    return
  }

  personnelError.value = ''

  try {
    await loadPersonnelProfile(id)
  } catch {
    personnelError.value = personnelStore.error || 'Unable to load personnel profile.'
  }
}, { immediate: true })

const {
  onCloseAssignModal,
  onSubmitAssignDeployment,
  onSubmitAssignEngagement,
  onSubmitAssignEquipment,
  onSubmitAssignTraining,
  onTabChange,
} = usePersonnelProfileHandlers({
  personnelId,
  activeTab,
  activeAssignModal,
  assignDeployment,
  assignEngagement,
  assignEquipment,
  assignTraining,
  reloadProfile: loadPersonnelProfile,
  showDialog,
})

</script>
