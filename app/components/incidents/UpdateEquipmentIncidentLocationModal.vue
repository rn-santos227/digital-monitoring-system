<template>

</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentLocationPayload } from '~/types/domain/incident'
import { validateUpdateEquipmentIncidentLocationForm } from '~/utils/incident-validation'

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
  (event: 'submit', payload: UpdateEquipmentIncidentLocationPayload): void
}>()

const form = reactive({
  location: props.incident.location ?? '',
  locationLatitude: props.incident.locationLatitude,
  locationLongitude: props.incident.locationLongitude,
})
const errors = reactive<Record<string, string>>({})

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

const onMapLatitudeUpdate = (value: number) => {
  form.locationLatitude = Number(value.toFixed(6))
}

const onMapLongitudeUpdate = (value: number) => {
  form.locationLongitude = Number(value.toFixed(6))
}

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentLocationForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (result.payload) {
    emit('submit', result.payload)
  }
}
</script>
