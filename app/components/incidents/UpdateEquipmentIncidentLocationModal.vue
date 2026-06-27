<template>
  <BaseModal
    title="Update Incident Location"
    description="Update the reported incident location and map coordinates."
    scroll-body
    size="xl"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <div class="space-y-4">
          <BaseTextField v-model="form.location" label="Location" :error="errors.location" />

          <div class="grid gap-4 md:grid-cols-2">
            <BaseTextField v-model="latitudeInput" type="number" label="Latitude" :error="errors.locationLatitude" />
            <BaseTextField v-model="longitudeInput" type="number" label="Longitude" :error="errors.locationLongitude" />
          </div>
        </div>

        <BaseGeoMap
          title="Incident Location Map"
          subtitle="Click the map or drag the pin to set the reported incident coordinates."
          :latitude="form.locationLatitude"
          :longitude="form.locationLongitude"
          mode="input"
          class="min-h-105"
          @update:latitude="onMapLatitudeUpdate"
          @update:longitude="onMapLongitudeUpdate"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update Location</BaseButton>
      </div>
    </template>
  </BaseModal>
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
