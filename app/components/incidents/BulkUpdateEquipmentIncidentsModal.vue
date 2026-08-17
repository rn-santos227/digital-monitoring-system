<template>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import EquipmentAssetsSuggestionField from '~/components/general/EquipmentAssetsSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import {
  EQUIPMENT_INCIDENTS_BULK_UPDATE_MODAL_DESCRIPTION,
  EQUIPMENT_INCIDENTS_BULK_UPDATE_MODAL_TITLE,
  EQUIPMENT_INCIDENTS_BULK_UPDATE_WARNING,
  EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS,
  EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS,
} from '~/constants/page.constants'
import type { EquipmentIncidentBulkUpdateValues } from '~/types/domain/incident'
import type { SelectOption } from '~/types/domain/misc'
import {
  formatBulkUpdateInputValue,
  validateIncidentBulkUpdate,
} from '~/utils/bulk-management-validation'
import {
  getIncidentTypeSuggestionsEndpoint,
  getInvestigationStatusSuggestionsEndpoint,
} from '~/utils/incident-endpoints'
</script>