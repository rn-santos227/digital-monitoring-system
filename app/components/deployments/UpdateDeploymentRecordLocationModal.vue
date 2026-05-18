<template>
  <BaseModal
    title="Update Deployment Record Location"
    description="Update deployment area coordinates and location."
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField :model-value="initialValues.personnelName" label="Personnel" disabled />
        <BaseTextField :model-value="initialValues.operationName" label="Deployment" disabled />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.deployment_area" label="Deployment Area" :error="errors.deployment_area" />
        <BaseTextField v-model="form.location" label="Location" :error="errors.location" />
        <BaseTextField v-model="form.deployment_area_latitude" label="Deployment Latitude" :error="errors.deployment_area_latitude" />
        <BaseTextField v-model="form.deployment_area_longitude" label="Deployment Longitude" :error="errors.deployment_area_longitude" />
      </div>

      <BaseGeoMap
        title="Deployment Geomap"
        subtitle="Adjust deployment coordinates for this record."
        :latitude="parsedLatitude"
        :longitude="parsedLongitude"
        mode="input"
        @update:latitude="onMapLatitudeUpdate"
        @update:longitude="onMapLongitudeUpdate"
      />
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
import { computed, reactive, watch } from 'vue'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import type { DeploymentRecordFormValues, UpdateDeploymentRecordPayload } from '~/types/domain/deployment'
import { validateUpdateDeploymentRecordForm } from '~/utils/deployment-validation'

const props = withDefaults(defineProps<{ initialValues: DeploymentRecordFormValues; isSubmitting?: boolean; errorMessage?: string }>(), { isSubmitting: false, errorMessage: '' })
const emit = defineEmits<{ (event: 'close'): void; (event: 'submit', payload: UpdateDeploymentRecordPayload): void }>()

const form = reactive({ deployment_area: '', deployment_area_latitude: '', deployment_area_longitude: '', start_date: '', end_date: '', assignment_role: '', location: '', remarks: '' })
const errors = reactive<Record<string, string>>({})

watch(() => props.initialValues, (value) => {
  form.deployment_area = value.deploymentArea
  form.deployment_area_latitude = value.deploymentAreaLatitude
  form.deployment_area_longitude = value.deploymentAreaLongitude
  form.location = value.location
  form.start_date = value.startDate
  form.end_date = value.endDate
  form.assignment_role = value.assignmentRole
  form.remarks = value.remarks
}, { immediate: true, deep: true })

const parsedLatitude = computed(() => Number.parseFloat(form.deployment_area_latitude))
const parsedLongitude = computed(() => Number.parseFloat(form.deployment_area_longitude))

const onMapLatitudeUpdate = (value: number) => { form.deployment_area_latitude = value.toFixed(6) }
const onMapLongitudeUpdate = (value: number) => { form.deployment_area_longitude = value.toFixed(6) }

const onSubmit = () => {
  const result = validateUpdateDeploymentRecordForm(form)
  Object.keys(errors).forEach((key) => { delete errors[key] })
  Object.assign(errors, result.errors)
  if (!result.payload) return
  emit('submit', {
    deployment_area: result.payload.deployment_area,
    deployment_area_latitude: result.payload.deployment_area_latitude,
    deployment_area_longitude: result.payload.deployment_area_longitude,
    location: result.payload.location,
  })
}
</script>
