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
</script>
