<template>

</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS } from '~/constants/page.constants'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentStatusPayload } from '~/types/domain/incident'
import type { SelectOption } from '~/types/domain/misc'
import { getInvestigationStatusSuggestionsEndpoint } from '~/utils/incident-endpoints'
import { validateUpdateEquipmentIncidentStatusForm } from '~/utils/incident-validation'

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
  (event: 'submit', payload: UpdateEquipmentIncidentStatusPayload): void
}>()

const form = reactive({
  investigationStatusId: props.incident.investigationStatusId ?? '',
})
const investigationStatusOptions = ref<SelectOption[]>([...EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS])

onMounted(async () => {
  const response = await getInvestigationStatusSuggestionsEndpoint()
  investigationStatusOptions.value = response.items.map((item) => ({
    label: item.name,
    value: item.id,
  }))
})

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentStatusForm(form)
  emit('submit', result.payload)
}
</script>
