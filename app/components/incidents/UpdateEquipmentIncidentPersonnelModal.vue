<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentPersonnelPayload } from '~/types/domain/incident'
import { validateUpdateEquipmentIncidentPersonnelForm } from '~/utils/incident-validation'

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
  (event: 'submit', payload: UpdateEquipmentIncidentPersonnelPayload): void
}>()

const form = reactive({
  personnelId: props.incident.personnelId ?? '',
})

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentPersonnelForm(form)
  emit('submit', result.payload)
}
</script>
