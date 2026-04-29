<template>
  <BaseModal
    :title="DEPLOYMENTS_CREATE_MODAL_TITLE"
    :description="DEPLOYMENTS_CREATE_MODAL_DESCRIPTION"
    size="xl"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.deploymentArea"
          :label="DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_PLACEHOLDER"
          :error="errors.deploymentArea"
          required
        />
        <BaseTextField
          v-model="form.assignmentRole"
          :label="DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_PLACEHOLDER"
          :error="errors.assignmentRole"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.operationName"
          :label="DEPLOYMENTS_CREATE_OPERATION_NAME_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_OPERATION_NAME_PLACEHOLDER"
          :error="errors.operationName"
        />
        <BaseSelect
          v-model="form.statusId"
          :label="DEPLOYMENTS_CREATE_STATUS_ID_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_STATUS_ID_PLACEHOLDER"
          :options="DEPLOYMENTS_CREATE_STATUS_OPTIONS"
          :error="errors.statusId"
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseDatePicker v-model="form.startDate" :label="DEPLOYMENTS_CREATE_START_DATE_LABEL" :error="errors.startDate" />
        <BaseDatePicker v-model="form.endDate" :label="DEPLOYMENTS_CREATE_END_DATE_LABEL" :error="errors.endDate" />
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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

        <BaseGeoMap
          :title="DEPLOYMENTS_CREATE_MAP_TITLE"
          :subtitle="DEPLOYMENTS_CREATE_MAP_SUBTITLE"
          :latitude="Number.parseFloat(form.deploymentAreaLatitude)"
          :longitude="Number.parseFloat(form.deploymentAreaLongitude)"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.location"
          :label="DEPLOYMENTS_CREATE_LOCATION_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_LOCATION_PLACEHOLDER"
          :error="errors.location"
        />
        <BaseTextField
          v-model="form.supervisorId"
          :label="DEPLOYMENTS_CREATE_SUPERVISOR_ID_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_SUPERVISOR_ID_PLACEHOLDER"
          :error="errors.supervisorId"
        />
      </div>

      <BaseTextArea
        v-model="form.defaultRemarks"
        :label="DEPLOYMENTS_CREATE_REMARKS_LABEL"
        :placeholder="DEPLOYMENTS_CREATE_REMARKS_PLACEHOLDER"
        :error="errors.defaultRemarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ TRAININGS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ TRAININGS_MODAL_CREATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_LABEL,
  DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_PLACEHOLDER,
  DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_LABEL,
  DEPLOYMENTS_CREATE_DEPLOYMENT_AREA_PLACEHOLDER,
  DEPLOYMENTS_CREATE_END_DATE_LABEL,
  DEPLOYMENTS_CREATE_LOCATION_LABEL,
  DEPLOYMENTS_CREATE_LATITUDE_LABEL,
  DEPLOYMENTS_CREATE_LATITUDE_PLACEHOLDER,
  DEPLOYMENTS_CREATE_LOCATION_PLACEHOLDER,
  DEPLOYMENTS_CREATE_LONGITUDE_LABEL,
  DEPLOYMENTS_CREATE_LONGITUDE_PLACEHOLDER,
  DEPLOYMENTS_CREATE_MAP_SUBTITLE,
  DEPLOYMENTS_CREATE_MAP_TITLE,
  DEPLOYMENTS_CREATE_MODAL_DESCRIPTION,
  DEPLOYMENTS_CREATE_MODAL_TITLE,
  DEPLOYMENTS_CREATE_OPERATION_NAME_LABEL,
  DEPLOYMENTS_CREATE_OPERATION_NAME_PLACEHOLDER,
  DEPLOYMENTS_CREATE_REMARKS_LABEL,
  DEPLOYMENTS_CREATE_REMARKS_PLACEHOLDER,
  DEPLOYMENTS_CREATE_START_DATE_LABEL,
  DEPLOYMENTS_CREATE_STATUS_OPTIONS,
  DEPLOYMENTS_CREATE_STATUS_ID_LABEL,
  DEPLOYMENTS_CREATE_STATUS_ID_PLACEHOLDER,
  DEPLOYMENTS_CREATE_SUPERVISOR_ID_LABEL,
  DEPLOYMENTS_CREATE_SUPERVISOR_ID_PLACEHOLDER,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_CREATE_LABEL,
} from '~/constants/page.constants'
import type { CreateDeploymentPayload } from '~/types/domain/deployment'
import { validateCreateDeploymentForm } from '~/utils/deployment-validation'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'

withDefaults(defineProps<{ isSubmitting?: boolean; warningMessage?: string; errorMessage?: string }>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateDeploymentPayload): void
}>()

const form = reactive({
  deploymentArea: '',
  assignmentRole: '',
  deploymentAreaLatitude: '',
  deploymentAreaLongitude: '',
  operationName: '',
  startDate: '',
  endDate: '',
  statusId: '',
  location: '',
  supervisorId: '',
  defaultRemarks: '',
})

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateCreateDeploymentForm(form)

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
