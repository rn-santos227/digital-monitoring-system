<template>
  <BaseModal
    title="Quick Assign Deployment"
    description="Assign the selected personnel to an existing deployment profile."
    size="lg"
    scroll-body
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert
        v-if="errorMessage"
        tone="danger"
        :message="errorMessage"
      />

      <DeploymentSuggestionField
        v-model="form.deployment_id"
        :error="errors.deployment_id"
        @select="onDeploymentSelected"
      />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.assignment_role"
          label="Assignment Role"
          :error="errors.assignment_role"
        />
        <BaseTextField
          v-model="form.deployment_area"
          label="Deployment Area"
          :error="errors.deployment_area"
        />
        <BaseDatePicker
          v-model="form.start_date"
          label="Start Date"
          :error="errors.start_date"
        />
        <BaseDatePicker
          v-model="form.end_date"
          label="End Date"
          :error="errors.end_date"
        />
        <BaseTextField
          v-model="form.deployment_area_latitude"
          label="Deployment Latitude"
          :error="errors.deployment_area_latitude"
        />
        <BaseTextField
          v-model="form.deployment_area_longitude"
          label="Deployment Longitude"
          :error="errors.deployment_area_longitude"
        />
      </div>

      <BaseGeoMap
        title="Deployment Geomap"
        subtitle="Set or adjust deployment coordinates for this assignment."
        :latitude="parsedLatitude"
        :longitude="parsedLongitude"
        mode="input"
        @update:latitude="onMapLatitudeUpdate"
        @update:longitude="onMapLongitudeUpdate"
      />

      <BaseTextArea
        v-model="form.remarks"
        label="Remarks"
        placeholder="Optional deployment remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Assign</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useDialog } from '~/composables/useDialog'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import type { CreateDeploymentRecordPayload, DeploymentManagementListItem } from '~/types/domain/deployment'
import { validateQuickAssignDeploymentForm } from '~/utils/service-status-validation'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'

withDefaults(defineProps<{ isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: Omit<CreateDeploymentRecordPayload, 'personnel_id'>): void
}>()

const form = reactive({
  deployment_id: '',
  personnel_id: '',
  assignment_role: '',
  deployment_area: '',
  deployment_area_latitude: '',
  deployment_area_longitude: '',
  start_date: '',
  end_date: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const onDeploymentSelected = (deployment: DeploymentManagementListItem | null) => {
  if (!deployment) {
    return
  }

  form.assignment_role = deployment.assignmentRole ?? ''
  form.deployment_area = deployment.deploymentArea ?? ''
  form.deployment_area_latitude = String(deployment.deploymentAreaLatitude ?? '')
  form.deployment_area_longitude = String(deployment.deploymentAreaLongitude ?? '')
}

const parsedLatitude = computed(() => Number.parseFloat(form.deployment_area_latitude))
const parsedLongitude = computed(() => Number.parseFloat(form.deployment_area_longitude))

const onMapLatitudeUpdate = (value: number) => {
  form.deployment_area_latitude = value.toFixed(6)
}

const onMapLongitudeUpdate = (value: number) => {
  form.deployment_area_longitude = value.toFixed(6)
}

const onSubmit = () => {
  const result = validateQuickAssignDeploymentForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

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
