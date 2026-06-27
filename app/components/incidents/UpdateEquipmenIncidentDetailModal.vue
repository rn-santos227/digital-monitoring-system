<template>

</template>


<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS } from '~/constants/page.constants'
import type { SelectOption } from '~/types/domain/misc'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentDetailsPayload } from '~/types/domain/incident'
import { getIncidentTypeSuggestionsEndpoint } from '~/utils/incident-endpoints'
import { validateUpdateEquipmentIncidentDetailsForm } from '~/utils/incident-validation'

const props = withDefaults(
  defineProps<{
    incident: EquipmentIncidentListItem
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
  (event: 'submit', payload: UpdateEquipmentIncidentDetailsPayload): void
}>()

const form = reactive({
  incidentNo: props.incident.incidentNo,
  incidentTypeId: props.incident.incidentTypeId,
  incidentDate: props.incident.incidentDate,
  description: props.incident.description,
  resolution: props.incident.resolution ?? '',
  remarks: props.incident.remarks ?? '',
})
const errors = reactive<Record<string, string>>({})
const incidentTypeOptions = ref<SelectOption[]>([...EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS])

onMounted(async () => {
  const response = await getIncidentTypeSuggestionsEndpoint()
  incidentTypeOptions.value = response.items.map((item) => ({
    label: item.name,
    value: item.id,
  }))
})

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentDetailsForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (result.payload) {
    emit('submit', result.payload)
  }
}
</script>
