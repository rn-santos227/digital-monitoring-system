<template>

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import {
  EQUIPMENT_INCIDENT_PROFILE_PAGE_SUBTITLE,
  EQUIPMENT_INCIDENT_PROFILE_PAGE_TITLE,
  EQUIPMENT_INCIDENTS_PAGE_REQUIRED_PERMISSIONS,
  EQUIPMENT_INCIDENTS_PAGE_SECTION_CLASSES,
} from '~/constants/page.constants'
import {
  PERSONNEL_PROFILE_GRID_CLASSES,
  PERSONNEL_PROFILE_PAGE_HEADER_CLASSES,
} from '~/constants/shared.constants'
import { usePrintIncidentsHandler } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { AuditLogListItem } from '~/types/domain/audit'
import type { EquipmentIncidentListItem } from '~/types/domain/incident'
import { getEquipmentIncidentByIdEndpoint } from '~/utils/incident-endpoints'
import { searchAuditLogsEndpoint } from '~/utils/audit-endpoints'

const { formatDate } = useDateDisplay()
const route = useRoute()
const authStore = useAuthStore()
const { printEquipmentIncidentProfile } = usePrintIncidentsHandler()

const incident = ref<EquipmentIncidentListItem | null>(null)
const incidentAuditLogs = ref<AuditLogListItem[]>([])
const pageError = ref('')
const auditError = ref('')
const isLoadingAuditLogs = ref(false)

const canViewEquipmentIncidents = computed(() => {
  return authStore.hasPermissionAccess(EQUIPMENT_INCIDENTS_PAGE_REQUIRED_PERMISSIONS.view)
})

const incidentId = computed(() => {
  const idValue = route.params.id
  return Array.isArray(idValue) ? (idValue[0] ?? '') : (idValue ?? '')
})

const statusLabel = computed(() => incident.value?.investigationStatusName ?? 'Not set')
const equipmentItemLabel = computed(() => {
  const currentIncident = incident.value
  if (!currentIncident) {
    return 'Not Set'
  }

  return [currentIncident.equipmentCode, currentIncident.equipmentName].filter(Boolean).join(' — ') || 'Not set'
})

const personnelLabel = computed(() => {
  const currentIncident = incident.value
  if (!currentIncident?.personnelId) {
    return 'Not Assigned'
  }

  return [currentIncident.personnelCode, currentIncident.personnelName].filter(Boolean).join(' — ') || currentIncident.personnelId
})

const deploymentLabel = computed(() => {
  const currentIncident = incident.value
  if (!currentIncident?.deploymentId) {
    return 'Not Assigned'
  }

  return [currentIncident.deploymentRecordNo, currentIncident.deploymentName].filter(Boolean).join(' — ') || currentIncident.deploymentId
})

const handlePrintEquipmentIncidentProfile = () => {
  return printEquipmentIncidentProfile(incident.value)
}

const loadIncidentAuditLogs = async (id: string) => {
  isLoadingAuditLogs.value = true
  auditError.value = ''

  try {
    const response = await searchAuditLogsEndpoint({
      page: 1,
      pageSize: 25,
      term: id,
      fields: 'recordId',
    })
    incidentAuditLogs.value = response.items.filter((item) => item.tableName === 'equipment_incidents')
  } catch {
    auditError.value = 'Unable to load incident update and status-change audit logs.'
  } finally {
    isLoadingAuditLogs.value = false
  }
}
</script>
