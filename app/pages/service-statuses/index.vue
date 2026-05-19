<template>
  <main :class="SERVICE_STATUS_PAGE_MAIN_CLASSES">

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

</script>
