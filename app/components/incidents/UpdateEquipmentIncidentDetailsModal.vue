<template>
  <BaseModal
    title="Update Incident Details"
    description="Update core incident classification, description, and resolution notes."
    scroll-body
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.incidentNo" label="Incident number" :error="errors.incidentNo" required />
        <BaseDatePicker v-model="form.incidentDate" label="Incident date" :error="errors.incidentDate" required />
      </div>

      <BaseSelect
        v-model="form.incidentTypeId"
        label="Incident type"
        placeholder="Select incident type"
        :options="incidentTypeOptions"
        :error="errors.incidentTypeId"
        required
      />
      <BaseTextArea v-model="form.description" label="Description" :error="errors.description" required />
      <BaseTextArea v-model="form.resolution" label="Resolution" />
      <BaseTextArea v-model="form.remarks" label="Remarks" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update Details</BaseButton>
      </div>
    </template>
  </BaseModal>
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
