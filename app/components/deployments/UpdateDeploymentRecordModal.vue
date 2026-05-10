<template>
  <BaseModal
    title="Update Deployment Record"
    description="Update deployment record details."
    size="xl"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField :model-value="initialValues.personnelName" label="Personnel" disabled />
        <BaseTextField :model-value="initialValues.operationName" label="Deployment" disabled />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="UPDATE_DEPLOYMENT_RECORD_TAB_ITEMS"
        aria-label="Update deployment record sections"
        @update:model-value="onTabChange"
      />

      <template v-if="activeTab === 'details'">
        <div class="grid gap-4 md:grid-cols-2">
          <BaseTextField v-model="form.assignment_role" label="Assignment Role" :error="errors.assignment_role" />
          <BaseTextField v-model="form.deployment_area" label="Deployment Area" :error="errors.deployment_area" />
          <BaseDatePicker v-model="form.start_date" label="Start Date" :error="errors.start_date" />
          <BaseDatePicker v-model="form.end_date" label="End Date" :error="errors.end_date" />
          <BaseTextField v-model="form.location" label="Location" :error="errors.location" />
        </div>
      </template>

      <template v-else>
        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
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
        </div>
      </template>

      <BaseTextArea v-model="form.remarks" label="Remarks" :error="errors.remarks" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import type { BaseTabItem } from '~/constants/ui.constants'
import type { UpdateDeploymentRecordPayload } from '~/types/domain/deployment'
import { validateUpdateDeploymentRecordForm } from '~/utils/deployment-validation'

const UPDATE_DEPLOYMENT_RECORD_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'details', label: 'Details' },
  { id: 'location', label: 'Geomap' },
])

const props = withDefaults(defineProps<{
  initialValues: {
    personnelName: string
    operationName: string
    assignmentRole: string
    deploymentArea: string
    deploymentAreaLatitude: string
    deploymentAreaLongitude: string
    startDate: string
    endDate: string
    location: string
    remarks: string
  }
  isSubmitting?: boolean
  errorMessage?: string
}>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateDeploymentRecordPayload): void
}>()

const activeTab = ref<'details' | 'location'>('details')

interface UpdateDeploymentRecordForm {
  assignment_role: string
  deployment_area: string
  deployment_area_latitude: string
  deployment_area_longitude: string
  start_date: string
  end_date: string
  location: string
  remarks: string
}

const form = reactive<UpdateDeploymentRecordForm>({
  assignment_role: '',
  deployment_area: '',
  deployment_area_latitude: '',
  deployment_area_longitude: '',
  start_date: '',
  end_date: '',
  location: '',
  remarks: '',
})

watch(() => props.initialValues, (value) => {
  form.assignment_role = value.assignmentRole
  form.deployment_area = value.deploymentArea
  form.deployment_area_latitude = value.deploymentAreaLatitude
  form.deployment_area_longitude = value.deploymentAreaLongitude
  form.start_date = value.startDate
  form.end_date = value.endDate
  form.location = value.location
  form.remarks = value.remarks
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const parsedLatitude = computed(() => Number.parseFloat(form.deployment_area_latitude))
const parsedLongitude = computed(() => Number.parseFloat(form.deployment_area_longitude))

const onMapLatitudeUpdate = (value: number) => {
  form.deployment_area_latitude = value.toFixed(6)
}

const onMapLongitudeUpdate = (value: number) => {
  form.deployment_area_longitude = value.toFixed(6)
}

const onTabChange = (value: string) => {
  activeTab.value = value === 'location' ? 'location' : 'details'
}

const onSubmit = () => {
  const result = validateUpdateDeploymentRecordForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}
</script>
