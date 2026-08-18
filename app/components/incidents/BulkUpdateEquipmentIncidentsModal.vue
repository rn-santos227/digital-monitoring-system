<template>
  <BaseModal
    :title="EQUIPMENT_INCIDENTS_BULK_UPDATE_MODAL_TITLE"
    :description="EQUIPMENT_INCIDENTS_BULK_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <form class="grid gap-4 md:grid-cols-2" @submit.prevent="onSubmit">
      <BaseAlert class="md:col-span-2" :message="EQUIPMENT_INCIDENTS_BULK_UPDATE_WARNING" tone="warning" />
      <BaseAlert v-if="errorMessage || validationError" class="md:col-span-2" :message="errorMessage || validationError" tone="danger" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">
          Update {{ selectedCount }} selected
        </BaseButton>
      </div>
    </template>
  </BaseModal>
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

const fields: readonly IncidentBulkUpdateField[] = [
  { key: 'equipment_asset_id', label: 'Equipment asset' },
  { key: 'personnel_id', label: 'Personnel' },
  { key: 'deployment_id', label: 'Deployment' },
  { key: 'incident_type_id', label: 'Incident type' },
  { key: 'incident_date', label: 'Incident date', type: 'date' },
  { key: 'location', label: 'Location' },
  { key: 'location_latitude', label: 'Latitude', type: 'number' },
  { key: 'location_longitude', label: 'Longitude', type: 'number' },
  { key: 'description', label: 'Description', multiline: true },
  { key: 'investigation_status_id', label: 'Investigation status' },
  { key: 'resolution', label: 'Resolution', multiline: true },
  { key: 'remarks', label: 'Remarks', multiline: true },
]

const incidentTypeOptions = ref<SelectOption[]>([...EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS])
const investigationStatusOptions = ref<SelectOption[]>([...EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS])
const validationError = ref('')

onMounted(async () => {
  const [incidentTypes, investigationStatuses] = await Promise.all([
    getIncidentTypeSuggestionsEndpoint(),
    getInvestigationStatusSuggestionsEndpoint(),
  ])
  incidentTypeOptions.value = incidentTypes.items.map((item) => ({ label: item.name, value: item.id }))
  investigationStatusOptions.value = investigationStatuses.items.map((item) => ({ label: item.name, value: item.id }))
})

const setStringValue = (key: keyof EquipmentIncidentBulkUpdateValues, value: string) => {
  values[key] = value
}

const setFieldValue = (key: keyof EquipmentIncidentBulkUpdateValues, value: string, type?: string) => {
  values[key] = type === 'number' ? (value === '' ? null : Number(value)) : value
}

const onSubmit = () => {
  const result = validateIncidentBulkUpdate({ enabled, values })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>