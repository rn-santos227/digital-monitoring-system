<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import EquipmentAssetsSuggestionField from '~/components/general/EquipmentAssetsSuggestionField.vue'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentEquipmentPayload } from '~/types/domain/incident'
import { validateUpdateEquipmentIncidentEquipmentForm } from '~/utils/incident-validation'

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
  (event: 'submit', payload: UpdateEquipmentIncidentEquipmentPayload): void
}>()

const form = reactive({
  equipmentAssetId: props.incident.equipmentAssetId,
})
const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentEquipmentForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (result.payload) {
    emit('submit', result.payload)
  }
}
</script>
