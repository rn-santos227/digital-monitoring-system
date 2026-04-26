<template>
  <BaseModal
    title="Batch Upload Personnel"
    description="Scan an Excel (.xlsx) file and process personnel records from the browser."
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseFileUpload
        accept=".xlsx"
        label="Personnel Excel File"
        helper-text="SN maps to service number, AFPPOS maps to position, and blank Date Enlisted defaults to today."
        :allowed-mime-prefixes="['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']"
        :disabled="isSubmitting"
        @update:file="onFileUpdate"
      />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseSuggestionField
          v-model="employmentStatusId"
          :options="PERSONNEL_CREATE_EMPLOYMENT_STATUS_OPTIONS"
          :label="PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_LABEL"
          :placeholder="PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_PLACEHOLDER"
          :disabled="isSubmitting"
          required
        />

        <BaseSuggestionField
          v-model="serviceStatusId"
          :options="PERSONNEL_CREATE_SERVICE_STATUS_OPTIONS"
          :label="PERSONNEL_CREATE_SERVICE_STATUS_ID_LABEL"
          :placeholder="PERSONNEL_CREATE_SERVICE_STATUS_ID_PLACEHOLDER"
          :disabled="isSubmitting"
          required
        />
      </div>

      <BaseAlert
        v-if="isSubmitting"
        tone="info"
        :message="`Processing ${processedCount} of ${totalCount} records...`"
      />

      <BaseAlert
        v-if="error"
        :message="error"
        tone="danger"
      />
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" :disabled="isSubmitting" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="!file || !employmentStatusId || !serviceStatusId || isSubmitting" @click="onSubmit">Process</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_LABEL,
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_PLACEHOLDER,
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_OPTIONS,
  PERSONNEL_CREATE_SERVICE_STATUS_ID_LABEL,
  PERSONNEL_CREATE_SERVICE_STATUS_ID_PLACEHOLDER,
  PERSONNEL_CREATE_SERVICE_STATUS_OPTIONS,
} from '~/constants/page.constants'

withDefaults(defineProps<{ isSubmitting?: boolean, processedCount?: number, totalCount?: number }>(), {
  isSubmitting: false,
  processedCount: 0,
  totalCount: 0,
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: { file: File, employmentStatusId: string, serviceStatusId: string }): void
}>()

const file = ref<File | null>(null)
const employmentStatusId = ref('')
const serviceStatusId = ref('')
const error = ref('')

const onFileUpdate = (value: File | null) => {
  file.value = value
  error.value = ''
}

const onSubmit = () => {
  if (!file.value || !employmentStatusId.value || !serviceStatusId.value) {
    error.value = 'Please provide the file, employment status, and service status.'
    return
  }

  emit('submit', {
    file: file.value,
    employmentStatusId: employmentStatusId.value,
    serviceStatusId: serviceStatusId.value,
  })
}
</script>
