<template>
  <BaseModal
    title="Create Equipment Incident"
    description="Report an equipment incident for investigation and resolution tracking."
    scroll-body
    size="xl"
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <BaseTextField v-model="form.incidentNo" label="Incident number" :error="errors.incidentNo" required />
            <EquipmentAssetsSuggestionField v-model="form.equipmentAssetId" :error="errors.equipmentAssetId" />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <BaseSelect
              v-model="form.incidentTypeId"
              label="Incident type"
              placeholder="Select incident type"
              :options="incidentTypeOptions"
              :error="errors.incidentTypeId"
              required
            />
            <BaseDatePicker v-model="form.incidentDate" label="Incident date" :error="errors.incidentDate" required />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <PersonnelSuggestionField v-model="form.personnelId" label="Related personnel" helper-text="Optional personnel involved in the incident." />
            <DeploymentSuggestionField
              v-model="form.deploymentId"
              label="Related deployment"
              helper-text="Optional deployment record connected to the incident. Coordinates are copied from the selected deployment when available."
              @select="onDeploymentSelect"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <BaseTextField v-model="form.location" label="Location" :error="errors.location" />
            <BaseTextField v-model="latitudeInput" type="number" label="Latitude" :error="errors.locationLatitude" />
            <BaseTextField v-model="longitudeInput" type="number" label="Longitude" :error="errors.locationLongitude" />
          </div>
        </div>
      </div>
    </form> 
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import EquipmentAssetsSuggestionField from '~/components/general/EquipmentAssetsSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS,
  EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS,
} from '~/constants/page.constants'
import type { SelectOption } from '~/types/domain/misc'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'
import type { CreateEquipmentIncidentPayload } from '~/types/domain/incident'
import { getIncidentTypeSuggestionsEndpoint, getInvestigationStatusSuggestionsEndpoint } from '~/utils/incident-endpoints'
import { validateCreateEquipmentIncidentForm } from '~/utils/incident-validation'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'

withDefaults(
  defineProps<{
    isSubmitting?: boolean
    warningMessage?: string
    errorMessage?: string
  }>(),
  {
    isSubmitting: false,
    warningMessage: '',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateEquipmentIncidentPayload): void
}>()

const form = reactive({
  incidentNo: '',
  equipmentAssetId: '',
  personnelId: '',
  deploymentId: '',
  incidentTypeId: '',
  incidentDate: '',
  location: '',
  locationLatitude: null as number | null,
  locationLongitude: null as number | null,
  description: '',
  investigationStatusId: '',
  resolution: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})
const incidentTypeOptions = ref<SelectOption[]>([...EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS])
const investigationStatusOptions = ref<SelectOption[]>([...EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS])
const { showDialog } = useDialog()

const latitudeInput = computed({
  get: () => form.locationLatitude === null ? '' : String(form.locationLatitude),
  set: (value: string) => {
    form.locationLatitude = value === '' ? null : Number(value)
  },
})

const longitudeInput = computed({
  get: () => form.locationLongitude === null ? '' : String(form.locationLongitude),
  set: (value: string) => {
    form.locationLongitude = value === '' ? null : Number(value)
  },
})

const updateIncidentCoordinates = (latitude: number | null, longitude: number | null) => {
  form.locationLatitude = typeof latitude === 'number' && Number.isFinite(latitude) ? latitude : null
  form.locationLongitude = typeof longitude === 'number' && Number.isFinite(longitude) ? longitude : null
}

const onMapLatitudeUpdate = (value: number) => {
  form.locationLatitude = Number(value.toFixed(6))
}

const onMapLongitudeUpdate = (value: number) => {
  form.locationLongitude = Number(value.toFixed(6))
}

const onDeploymentSelect = (deployment: DeploymentManagementListItem | null) => {
  if (!deployment) {
    return
  }

  if (!form.location && deployment.deploymentArea) {
    form.location = deployment.deploymentArea
  }

  if (deployment.deploymentAreaLatitude !== null || deployment.deploymentAreaLongitude !== null) {
    updateIncidentCoordinates(deployment.deploymentAreaLatitude, deployment.deploymentAreaLongitude)
  }
}

onMounted(async () => {
  const [incidentTypes, investigationStatuses] = await Promise.all([
    getIncidentTypeSuggestionsEndpoint(),
    getInvestigationStatusSuggestionsEndpoint(),
  ])

  incidentTypeOptions.value = incidentTypes.items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  investigationStatusOptions.value = investigationStatuses.items.map((item) => ({
    label: item.name,
    value: item.id,
  }))
})

const onSubmit = () => {
  const result = validateCreateEquipmentIncidentForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForRequiredFields({
    formValues: form,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}
</script>
