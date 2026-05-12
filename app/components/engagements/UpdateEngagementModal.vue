<template>
  <BaseModal
    title="Update Engagement"
    description="Update engagement profile details."
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.engagementTitle"
          label="Engagement Title"
          placeholder="Enter engagement title"
          :error="errors.engagementTitle"
          required
        />

        <BaseSelect
          v-model="form.engagementTypeId"
          label="Engagement Type"
          placeholder="Select engagement type"
          :options="ENGAGEMENT_CREATE_TYPE_OPTIONS"
          :error="errors.engagementTypeId"
          required
        />

        <BaseSelect
          v-model="form.levelId"
          label="Level"
          placeholder="Select level"
          :options="ENGAGEMENT_CREATE_LEVEL_OPTIONS"
          :error="errors.levelId"
        />

        <BaseSelect
          v-model="form.statusId"
          label="Status"
          placeholder="Select status"
          :options="ENGAGEMENT_CREATE_STATUS_OPTIONS"
          :error="errors.statusId"
          required
        />

        <BaseDatePicker v-model="form.startDate" label="Start Date" :error="errors.startDate" />
        <BaseDatePicker v-model="form.endDate" label="End Date" :error="errors.endDate" />
      </div>

      <BaseTextArea
        v-model="form.defaultRemarks"
        label="Default Remarks"
        placeholder="Enter remarks"
        :error="errors.defaultRemarks"
      />
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
import { reactive, watch } from 'vue'
import {
  ENGAGEMENT_CREATE_LEVEL_OPTIONS,
  ENGAGEMENT_CREATE_STATUS_OPTIONS,
  ENGAGEMENT_CREATE_TYPE_OPTIONS,
} from '~/constants/page.constants'
import type { CreateEngagementPayload } from '~/types/domain/engagement'
import { validateCreateEngagementForm } from '~/utils/engagement-validation'

interface EngagementUpdateFormValues {
  engagementTitle: string
  engagementTypeId: string
  levelId: string
  statusId: string
  startDate: string
  endDate: string
  defaultRemarks: string
}

const props = withDefaults(defineProps<{
  initialValues: EngagementUpdateFormValues
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
  (event: 'submit', payload: CreateEngagementPayload): void
}>()

const form = reactive<EngagementUpdateFormValues>({ ...props.initialValues })
const errors = reactive<Record<string, string>>({})

watch(() => props.initialValues, (nextValues) => {
  Object.assign(form, nextValues)
}, { deep: true })

const onSubmit = () => {
  const result = validateCreateEngagementForm(form)

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
