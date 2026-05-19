<template>
  <BaseModal
    title="Quick Assign Engagement"
    description="Assign the selected personnel to an existing engagement profile."
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert
        v-if="errorMessage"
        tone="danger"
        :message="errorMessage"
      />

      <EngagementSuggestionField
        v-model="form.engagement_id"
        label="Engagement"
        placeholder="Search engagement profile"
        helper-text="Select an engagement profile for this personnel assignment."
        :error="errors.engagement_id"
        @select="onEngagementSelected"
      />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.certificate_no"
          label="Certificate No"
          :error="errors.certificate_no"
        />
        <BaseDatePicker
          v-model="form.valid_until"
          label="Valid Until"
          :error="errors.valid_until"
        />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        label="Remarks"
        placeholder="Optional engagement remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Assign</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import EngagementSuggestionField from '~/components/general/EngagementSuggestionField.vue'
import type { CreateEngagementRecordPayload, EngagementManagementListItem } from '~/types/domain/engagement'
import { validateQuickAssignEngagementForm } from '~/utils/service-status-validation'

withDefaults(defineProps<{ isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: Omit<CreateEngagementRecordPayload, 'personnel_id'>): void
}>()

const form = reactive({
  engagement_id: '',
  certificate_no: '',
  valid_until: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})

const onEngagementSelected = (engagement: EngagementManagementListItem | null) => {
  if (!engagement) {
    return
  }

  if (!form.remarks) {
    form.remarks = engagement.defaultRemarks ?? ''
  }
}

const onSubmit = () => {
  const result = validateQuickAssignEngagementForm(form)

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
