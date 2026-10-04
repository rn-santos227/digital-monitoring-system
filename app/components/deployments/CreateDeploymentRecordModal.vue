<template>
  <BaseModal
    title="Create Deployment Record"
    description="Assign personnel to an existing deployment profile."
    size="lg"
    scroll-body
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <DeploymentSuggestionField v-model="form.deployment_id" :error="errors.deployment_id" @select="onDeploymentSelected" />
      <PersonnelSuggestionField v-model="form.personnel_id" :error="errors.personnel_id" />
      <BaseTab :model-value="activeTab" :items="CREATE_DEPLOYMENT_RECORD_TAB_ITEMS" aria-label="Create deployment record sections" @update:model-value="onTabChange" />

      <div v-if="activeTab === 'details'" class="grid gap-4 md:grid-cols-2">
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
      </div>
      <div v-else class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
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
          subtitle="Set deployment coordinates for this personnel record."
          :latitude="parsedLatitude"
          :longitude="parsedLongitude"
          mode="input"
          @update:latitude="onMapLatitudeUpdate"
          @update:longitude="onMapLongitudeUpdate"
        />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        label="Remarks"
        placeholder="Optional deployment remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Create</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { CREATE_DEPLOYMENT_RECORD_TAB_ITEMS } from '~/constants/page.constants'
import { computed, reactive, ref } from 'vue'
import { useDialog } from '~/composables/useDialog'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import type { CreateDeploymentRecordPayload, DeploymentManagementListItem } from '~/types/domain/deployment'
import { validateCreateDeploymentRecordForm } from '~/utils/deployment-validation'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'

withDefaults(
  defineProps<{
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
  (event: 'submit', payload: CreateDeploymentRecordPayload): void
}>()

const activeTab = ref<'details' | 'location'>('details')

interface CreateDeploymentRecordForm {
  personnel_id: string
  deployment_id: string
  assignment_role: string
  deployment_area: string
  deployment_area_latitude: string
  deployment_area_longitude: string
  start_date: string
  end_date: string
  remarks: string
}

const form = reactive<CreateDeploymentRecordForm>({
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
const onTabChange = (value: string) => {
  activeTab.value = value === 'location' ? 'location' : 'details'
}

const onSubmit = () => {
  const result = validateCreateDeploymentRecordForm(form)

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
