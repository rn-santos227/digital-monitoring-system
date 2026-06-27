<template>
  <main class="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
    <section :class="EQUIPMENT_INCIDENTS_PAGE_SECTION_CLASSES">
      <header :class="PERSONNEL_PROFILE_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_INCIDENT_PROFILE_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_INCIDENT_PROFILE_PAGE_SUBTITLE }}</p>
      </header>

      <BaseAlert
        v-if="!canViewEquipmentIncidents"
        message="You do not have permission to view equipment incident records."
        tone="warning"
      />

      <template v-else>
        <BaseAlert v-if="pageError" :message="pageError" tone="danger" />

        <template v-if="incident">
          <div class="flex justify-end">
            <PrintDataListButton
              table-name="equipment_incidents"
              table-label="Equipment Incident Profile"
              :filters="{ id: incident.id }"
              :get-print-data="handlePrintEquipmentIncidentProfile"
              show-label
            />
          </div>

          <div class="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <BaseCard>
              <div class="flex flex-col items-center gap-4 text-center">
                <BaseImage size="lg" :alt="incident.incidentNo" :fallback-text="incident.incidentNo" />
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold text-slate-900">{{ incident.incidentNo }}</h2>
                  <p class="text-sm text-slate-600">{{ incident.incidentTypeName ?? 'Unclassified' }} · {{ statusLabel }}</p>
                </div>
                <div class="w-full space-y-2 rounded-xl bg-slate-50 p-3 text-left text-sm">
                  <p><span class="font-semibold">Equipment Asset:</span> {{ incident.assetTag }}</p>
                  <p><span class="font-semibold">Equipment Item:</span> {{ equipmentItemLabel }}</p>
                  <p><span class="font-semibold">Incident Date:</span> {{ formatDate(incident.incidentDate) }}</p>
                  <p><span class="font-semibold">Location:</span> {{ incident.location ?? 'Not set' }}</p>
                </div>
              </div>
            </BaseCard>

            <BaseCard title="Incident Overview">
              <div :class="PERSONNEL_PROFILE_GRID_CLASSES">
                <p><span class="font-semibold">Incident Number:</span> {{ incident.incidentNo }}</p>
                <p><span class="font-semibold">Incident Type:</span> {{ incident.incidentTypeName ?? 'Not set' }}</p>
                <p><span class="font-semibold">Incident Type Code:</span> {{ incident.incidentTypeCode ?? 'Not set' }}</p>
                <p><span class="font-semibold">Incident Date:</span> {{ formatDate(incident.incidentDate) }}</p>
                <p><span class="font-semibold">Investigation Status:</span> {{ statusLabel }}</p>
                <p><span class="font-semibold">Equipment Asset:</span> {{ incident.assetTag }}</p>
                <p><span class="font-semibold">Equipment Code:</span> {{ incident.equipmentCode ?? 'Not set' }}</p>
                <p><span class="font-semibold">Equipment Name:</span> {{ incident.equipmentName ?? 'Not set' }}</p>
                <p><span class="font-semibold">Related Personnel:</span> {{ personnelLabel }}</p>
                <p><span class="font-semibold">Related Deployment:</span> {{ deploymentLabel }}</p>
                <p><span class="font-semibold">Created At:</span> {{ formatDate(incident.createdAt) }}</p>
                <p><span class="font-semibold">Updated At:</span> {{ formatDate(incident.updatedAt) }}</p>
              </div>
            </BaseCard>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <BaseCard title="Location Details">
              <div :class="PERSONNEL_PROFILE_GRID_CLASSES">
                <p><span class="font-semibold">Location:</span> {{ incident.location ?? 'Not set' }}</p>
                <p><span class="font-semibold">Latitude:</span> {{ incident.locationLatitude ?? 'Not set' }}</p>
                <p><span class="font-semibold">Longitude:</span> {{ incident.locationLongitude ?? 'Not set' }}</p>
                <p><span class="font-semibold">Deployment Area:</span> {{ incident.deploymentArea ?? 'Not set' }}</p>
              </div>
            </BaseCard>

            <BaseCard title="Investigation Notes">
              <div class="space-y-4 text-sm text-slate-700">
                <p><span class="font-semibold text-slate-900">Description:</span> {{ incident.description }}</p>
                <p><span class="font-semibold text-slate-900">Resolution:</span> {{ incident.resolution ?? 'No resolution recorded.' }}</p>
                <p><span class="font-semibold text-slate-900">Remarks:</span> {{ incident.remarks ?? 'No remarks recorded.' }}</p>
              </div>
            </BaseCard>
          </div>

          <BaseCard title="Updates and Status Changes">
            <BaseInlineLoader v-if="isLoadingAuditLogs" label="Loading incident updates..." />
            <BaseAlert v-else-if="auditError" :message="auditError" tone="warning" />
            <p v-else-if="incidentAuditLogs.length === 0" class="text-sm text-slate-500">
              No update or status-change audit logs were found for this incident.
            </p>
            <ol v-else class="space-y-4">
              <li v-for="auditLog in incidentAuditLogs" :key="auditLog.id" class="rounded-xl border border-slate-200 p-4">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p class="font-semibold text-slate-900">{{ auditLog.action }}</p>
                  <p class="text-xs text-slate-500">{{ formatDate(auditLog.createdAt) }}</p>
                </div>
                <p class="mt-2 text-sm text-slate-600">
                  <span class="font-semibold">Actor:</span> {{ auditLog.actor?.fullName ?? auditLog.actor?.email ?? 'System' }}
                </p>
                <p class="text-sm text-slate-600"><span class="font-semibold">Status Code:</span> {{ auditLog.statusCode ?? 'N/A' }}</p>
              </li>
            </ol>
          </BaseCard>
        </template>
      </template>
    </section>
  </main>
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

const loadIncidentProfile = async (id: string) => {
  incident.value = await getEquipmentIncidentByIdEndpoint(id)
  await loadIncidentAuditLogs(id)
}

watch([canViewEquipmentIncidents, incidentId], async ([hasAccess, id]) => {
  if (!hasAccess || !id) {
    return
  }

  pageError.value = ''

  try {
    await loadIncidentProfile(id)
  } catch {
    pageError.value = 'Unable to load equipment incident profile.'
  }
}, { immediate: true })
</script>
