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

withDefaults(defineProps<{
  selectedCount: number
  isSubmitting?: boolean
  errorMessage?: string
}>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: EquipmentIncidentBulkUpdateValues): void
}>()

const enabled = reactive<Record<keyof EquipmentIncidentBulkUpdateValues, boolean>>({
  equipment_asset_id: false,
  personnel_id: false,
  deployment_id: false,
  incident_type_id: false,
  incident_date: false,
  location: false,
  location_latitude: false,
  location_longitude: false,
  description: false,
  investigation_status_id: false,
  resolution: false,
  remarks: false,
})

const values = reactive<Record<keyof EquipmentIncidentBulkUpdateValues, string | number | null>>({
  equipment_asset_id: '',
  personnel_id: null,
  deployment_id: null,
  incident_type_id: '',
  incident_date: '',
  location: null,
  location_latitude: null,
  location_longitude: null,
  description: '',
  investigation_status_id: null,
  resolution: null,
  remarks: null,
})

interface IncidentBulkUpdateField {
  key: keyof EquipmentIncidentBulkUpdateValues
  label: string
  type?: 'text' | 'date' | 'number'
  multiline?: boolean
}
</script>