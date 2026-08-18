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

      <div v-for="field in fields" :key="field.key" class="space-y-2 rounded-lg border border-slate-200 p-3">
        <BaseCheckbox v-model="enabled[field.key]" :label="field.label" />

        <EquipmentAssetsSuggestionField
          v-if="field.key === 'equipment_asset_id'"
          v-model="values.equipment_asset_id"
          :disabled="!enabled.equipment_asset_id"
        />

        <PersonnelSuggestionField
          v-else-if="field.key === 'personnel_id'"
          v-model="values.personnel_id"
          label="Personnel"
          :disabled="!enabled.personnel_id"
        />

        <DeploymentSuggestionField
          v-else-if="field.key === 'deployment_id'"
          v-model="values.deployment_id"
          :disabled="!enabled.deployment_id"
        />

        <BaseSelect
          v-else-if="field.key === 'incident_type_id'"
          :model-value="values.incident_type_id ?? ''"
          label="Incident type"
          :options="incidentTypeOptions"
          :disabled="!enabled.incident_type_id"
          @update:model-value="setNullableStringValue('incident_type_id', $event)"
        />

        <BaseSelect
          v-else-if="field.key === 'investigation_status_id'"
          :model-value="values.investigation_status_id ?? ''"
          label="Investigation status"
          :options="investigationStatusOptions"
          :disabled="!enabled.investigation_status_id"
          @update:model-value="setNullableStringValue('investigation_status_id', $event)"
        />

        <BaseDatePicker
          v-else-if="field.type === 'date'"
          :model-value="values.incident_date"
          :label="field.label"
          :disabled="!enabled.incident_date"
          @update:model-value="setStringValue('incident_date', $event)"
        />
      </div>
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

interface IncidentBulkUpdateFormValues {
  equipment_asset_id: string | null
  personnel_id: string | null
  deployment_id: string | null
  incident_type_id: string | null
  incident_date: string
  location: string | null
  location_latitude: number | null
  location_longitude: number | null
  description: string
  investigation_status_id: string | null
  resolution: string | null
  remarks: string | null
}

const values = reactive<IncidentBulkUpdateFormValues>({
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

const setFieldEnabled = (
  key: keyof EquipmentIncidentBulkUpdateValues,
  value: boolean,
) => {
  enabled[key] = value
}

const setStringValue = (key: keyof EquipmentIncidentBulkUpdateValues, value: string) => {
  Reflect.set(values, key, value)
}

const setNullableStringValue = (
  key: keyof EquipmentIncidentBulkUpdateValues,
  value: string | null,
) => {
  Reflect.set(values, key, value)
}

const setFieldValue = (key: keyof EquipmentIncidentBulkUpdateValues, value: string, type?: string) => {
  Reflect.set(values, key, type === 'number' ? (value === '' ? null : Number(value)) : value)
}

const onSubmit = () => {
  const result = validateIncidentBulkUpdate({ enabled, values })
  validationError.value = result.error
  if (result.payload) emit('submit', result.payload)
}
</script>
