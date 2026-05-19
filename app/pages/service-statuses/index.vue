<template>
  <main :class="SERVICE_STATUS_PAGE_MAIN_CLASSES">
    <header :class="SERVICE_STATUS_PAGE_HEADER_CLASSES">
      <h1 :class="SERVICE_STATUS_PAGE_TITLE_CLASSES">{{ SERVICE_STATUSES_PAGE_TITLE }}</h1>
      <p :class="SERVICE_STATUS_PAGE_SUBTITLE_CLASSES">{{ SERVICE_STATUSES_PAGE_SUBTITLE }}</p>
    </header>

    <BaseTab
      :model-value="activeTab"
      :items="SERVICE_STATUSES_PAGE_TAB_ITEMS"
      :aria-label="SERVICE_STATUSES_PAGE_TABS_ARIA_LABEL"
      @update:model-value="activeTab = $event"
    />

    <BaseAlert v-if="errorMessage" tone="danger" :message="errorMessage" />

    <BaseInlineLoader v-if="isLoading" message="Loading personnel locations..." />
    <template v-else-if="activeTab === 'service-map'">
      <section class="mt-4">
        <PersonnelFilter
          :model-value="personnelFilter"
          @apply="onApplyPersonnelFilter"
          @reset="onResetPersonnelFilter"
        />
      </section>

      <section :class="SERVICE_STATUS_PAGE_CONTENT_CLASSES">
        <ServiceStatusTacticalMap
          :class="SERVICE_STATUS_PAGE_MAP_WRAPPER_CLASSES"
          :items="filteredLocationItems"
          :selected-personnel-id="selectedPersonnelId"
        /> 
      </section>
    </template>

    <template v-else>
      <section class="mt-4">
        <PersonnelFilter
          :model-value="personnelFilter"
          @apply="onApplyPersonnelFilter"
          @reset="onResetPersonnelFilter"
        />

        <ServiceStatusPersonnelTable
          :items="filteredLocationItems"
          @assign-deployment="onOpenAssignDeployment"
          @assign-engagement="onOpenAssignEngagement"
          @assign-training="onOpenAssignTraining"
        />
      </section>
    </template>

    <QuickAssignDeploymentModal
      v-if="activeModal === 'deployment'"
      :is-submitting="isSubmitting"
      :error-message="modalErrorMessage || assignmentError"
      @close="onCloseModal"
      @submit="onSubmitAssignDeployment"
    />

    <QuickAssignEngagementModal
      v-if="activeModal === 'engagement'"
      :is-submitting="isSubmitting"
      :error-message="modalErrorMessage || assignmentError"
      @close="onCloseModal"
      @submit="onSubmitAssignEngagement"
    />

    <QuickAssignTrainingModal
      v-if="activeModal === 'training'"
      :is-submitting="isSubmitting"
      :error-message="modalErrorMessage || assignmentError"
      @close="onCloseModal"
      @submit="onSubmitAssignTraining"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDialog } from '~/composables/useDialog'
import { useAssignments } from '~/composables/useAssignments'
import { useServiceStatusAssignmentHandler } from '~/handlers/service-status'
import QuickAssignDeploymentModal from '~/components/service-status/QuickAssignDeploymentModal.vue'
import QuickAssignEngagementModal from '~/components/service-status/QuickAssignEngagementModal.vue'
import QuickAssignTrainingModal from '~/components/service-status/QuickAssignTrainingModal.vue'
import ServiceStatusPersonnelTable from '~/components/service-status/ServiceStatusPersonnelTable.vue'
import ServiceStatusTacticalMap from '~/components/service-status/ServiceStatusTacticalMap.vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseInlineLoader from '~/components/ui/BaseInlineLoader.vue'
import BaseTab from '~/components/ui/BaseTab.vue'
import PersonnelFilter from '~/components/personnel/PersonnelFilter.vue'
import {
  SERVICE_STATUS_PAGE_CONTENT_CLASSES,
  SERVICE_STATUS_PAGE_HEADER_CLASSES,
  SERVICE_STATUS_PAGE_MAIN_CLASSES,
  SERVICE_STATUS_PAGE_MAP_WRAPPER_CLASSES,
  SERVICE_STATUS_PAGE_SUBTITLE_CLASSES,
  SERVICE_STATUS_PAGE_TITLE_CLASSES,
  SERVICE_STATUSES_PAGE_SUBTITLE,
  SERVICE_STATUSES_PAGE_TAB_ITEMS,
  SERVICE_STATUSES_PAGE_TABS_ARIA_LABEL,
  SERVICE_STATUSES_PAGE_TITLE,
} from '~/constants/page.constants'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'
import { fetchPersonnelLocationsEndpoint } from '~/utils/service-status-endpoints'
import type { ActiveServiceStatusModal } from '~/types/domain/service-status'

const { showDialog } = useDialog()
const {
  isSubmitting,
  error: assignmentError,
  assignDeployment,
  assignEngagement,
  assignTraining,
} = useAssignments()

const activeTab = ref('service-map')
const isLoading = ref(false)
const errorMessage = ref('')
const locationItems = ref<PersonnelLocationItem[]>([])
const selectedPersonnelId = ref<string | null>(null)
const activeModal = ref<ActiveServiceStatusModal>(null)
const modalErrorMessage = ref('')
const personnelFilter = ref<{ term?: string; fields?: string }>({})

const filteredLocationItems = computed(() => {
  const query = (personnelFilter.value.term ?? '').trim().toLowerCase()

  if (!query) {
    return locationItems.value
  }

  const selectedFields = (personnelFilter.value.fields ?? '')
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean)

  return locationItems.value.filter((item) => {
    const fieldValueMap: Record<string, string> = {
      personnelCode: (item as PersonnelLocationItem & { personnelCode?: string | null }).personnelCode ?? '',
      serviceNumber: (item as PersonnelLocationItem & { serviceNumber?: string | null }).serviceNumber ?? '',
      email: (item as PersonnelLocationItem & { email?: string | null }).email ?? '',
      lastName: (item as PersonnelLocationItem & { lastName?: string | null }).lastName ?? '',
      firstName: (item as PersonnelLocationItem & { firstName?: string | null }).firstName ?? '',
      rankName: (item as PersonnelLocationItem & { rankName?: string | null }).rankName ?? '',
      personnelName: item.personnelName ?? '',
    }
    const haystack = selectedFields.length > 0
      ? selectedFields.map((field) => fieldValueMap[field] ?? '').join(' ')
      : Object.values(fieldValueMap).join(' ')

    return haystack.toLowerCase().includes(query)
  })
})

const onApplyPersonnelFilter = (value: { term?: string; fields?: string }) => {
  personnelFilter.value = {
    term: value.term ?? '',
    fields: value.fields ?? '',
  }
}

const onResetPersonnelFilter = () => {
  personnelFilter.value = {}
}

const loadLocations = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    locationItems.value = await fetchPersonnelLocationsEndpoint()
    selectedPersonnelId.value = locationItems.value[0]?.personnelId ?? null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load personnel locations.'
    errorMessage.value = message
  } finally {
    isLoading.value = false
  }
}

const {
  onOpenAssignDeployment,
  onOpenAssignEngagement,
  onOpenAssignTraining,
  onCloseModal,
  onSubmitAssignDeployment,
  onSubmitAssignEngagement,
  onSubmitAssignTraining,
} = useServiceStatusAssignmentHandler({
  selectedPersonnelId,
  activeModal,
  modalErrorMessage,
  showDialog,
  assignDeployment: async (personnelId, payload: Omit<CreateDeploymentRecordPayload, 'personnel_id'>) => {
    await assignDeployment(personnelId, { ...payload, personnel_id: personnelId })
  },
  assignEngagement: async (personnelId, payload: Omit<CreateEngagementRecordPayload, 'personnel_id'>) => {
    await assignEngagement(personnelId, { ...payload, personnel_id: personnelId })
  },
  assignTraining: async (personnelId, payload: Omit<CreateTrainingRecordPayload, 'personnelId'>) => {
    await assignTraining(personnelId, { ...payload, personnelId: personnelId })
  },
  reload: loadLocations,
})

onMounted(async () => {
  await loadLocations()
})
</script>
