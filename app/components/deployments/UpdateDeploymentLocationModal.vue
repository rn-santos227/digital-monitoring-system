<template>
  <BaseModal
    :title="DEPLOYMENTS_UPDATE_MODAL_TITLE"
    :description="DEPLOYMENTS_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    @close="onCloseRequest"
  >
    <form :class="DEPLOYMENTS_CREATE_MODAL_FORM_CLASSES" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div :class="DEPLOYMENTS_CREATE_MODAL_LAYOUT_CLASSES">
        <div :class="DEPLOYMENTS_CREATE_MODAL_FORM_PANE_CLASSES">
          <BaseTextField
            v-model="form.deploymentArea"
            :label="DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_LABEL"
            :placeholder="DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_PLACEHOLDER"
            :error="errors.deploymentArea"
            required
          />

          <div class="grid gap-4 md:grid-cols-2">
            <BaseTextField
              v-model="form.deploymentAreaLatitude"
              :label="DEPLOYMENTS_CREATE_LATITUDE_LABEL"
              :placeholder="DEPLOYMENTS_CREATE_LATITUDE_PLACEHOLDER"
              :error="errors.deploymentAreaLatitude"
            />
            <BaseTextField
              v-model="form.deploymentAreaLongitude"
              :label="DEPLOYMENTS_CREATE_LONGITUDE_LABEL"
              :placeholder="DEPLOYMENTS_CREATE_LONGITUDE_PLACEHOLDER"
              :error="errors.deploymentAreaLongitude"
            />
          </div>

          <BaseTextField
            v-model="form.location"
            :label="DEPLOYMENTS_CREATE_LOCATION_LABEL"
            :placeholder="DEPLOYMENTS_CREATE_LOCATION_PLACEHOLDER"
            :error="errors.location"
          />
        </div>

        <div :class="DEPLOYMENTS_CREATE_MODAL_MAP_PANE_CLASSES">
          <BaseGeoMap
            :title="DEPLOYMENTS_CREATE_MAP_TITLE"
            :subtitle="DEPLOYMENTS_CREATE_MAP_SUBTITLE"
            :latitude="Number.parseFloat(form.deploymentAreaLatitude)"
            :longitude="Number.parseFloat(form.deploymentAreaLongitude)"
            mode="input"
            class="h-full"
            @update:latitude="onMapLatitudeUpdate"
            @update:longitude="onMapLongitudeUpdate"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onResetForm">Reset</BaseButton>
        <BaseButton variant="ghost" @click="onCloseRequest">{{ TRAININGS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ TRAININGS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import {
  DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_LABEL,
  DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_PLACEHOLDER,
  DEPLOYMENTS_CREATE_LATITUDE_LABEL,
  DEPLOYMENTS_CREATE_LATITUDE_PLACEHOLDER,
  DEPLOYMENTS_CREATE_LOCATION_LABEL,
  DEPLOYMENTS_CREATE_LOCATION_PLACEHOLDER,
  DEPLOYMENTS_CREATE_LONGITUDE_LABEL,
  DEPLOYMENTS_CREATE_LONGITUDE_PLACEHOLDER,
  DEPLOYMENTS_CREATE_MAP_SUBTITLE,
  DEPLOYMENTS_CREATE_MAP_TITLE,
  DEPLOYMENTS_UPDATE_MODAL_DESCRIPTION,
  DEPLOYMENTS_UPDATE_MODAL_TITLE,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import {
  DEPLOYMENTS_CREATE_MODAL_FORM_CLASSES,
  DEPLOYMENTS_CREATE_MODAL_FORM_PANE_CLASSES,
  DEPLOYMENTS_CREATE_MODAL_LAYOUT_CLASSES,
  DEPLOYMENTS_CREATE_MODAL_MAP_PANE_CLASSES,
} from '~/constants/shared.constants'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import type { CreateDeploymentPayload } from '~/types/domain/deployment'
import { validateCreateDeploymentForm } from '~/utils/deployment-validation'
import { requestCloseForChangedValues, resetFormValues } from '~/utils/form-close-guard'

interface DeploymentFormValues {
  deploymentArea: string
  assignmentRole: string
  deploymentAreaLatitude: string
  deploymentAreaLongitude: string
  operationName: string
  startDate: string
  endDate: string
  statusId: string
  location: string
  supervisorId: string
  defaultRemarks: string
}

const props = withDefaults(defineProps<{
  initialValues: DeploymentFormValues
  isSubmitting?: boolean
  warningMessage?: string
  errorMessage?: string
}>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateDeploymentPayload): void
}>()

const form = reactive<DeploymentFormValues>({ ...props.initialValues })
const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

watch(() => props.initialValues, (nextValues) => {
  Object.assign(form, nextValues)
}, { deep: true })

const onMapLatitudeUpdate = (value: number) => {
  form.deploymentAreaLatitude = value.toFixed(6)
}

const onMapLongitudeUpdate = (value: number) => {
  form.deploymentAreaLongitude = value.toFixed(6)
}

const onSubmit = () => {
  const result = validateCreateDeploymentForm(form)
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, result.errors)

  if (result.payload) {
    emit('submit', result.payload)
  }
}

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForChangedValues({
    formValues: form,
    originalValues: props.initialValues,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}

const onResetForm = () => {
  resetFormValues(
    form,
    props.initialValues,
  )
}
</script>
