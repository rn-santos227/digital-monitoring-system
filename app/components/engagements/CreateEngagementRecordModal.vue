<template>
  <BaseModal
    title="Create Engagement Record"
    description="Assign personnel to an existing engagement profile."
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 md:grid-cols-2">
        <EngagementSuggestionField
          v-model="form.engagement_id"
          label="Engagement"
          placeholder="Search engagement profile"
          helper-text="Select an engagement profile to link this personnel record."
          :error="errors.engagement_id"
          @select="onEngagementSelected"
        />
        <PersonnelSuggestionField v-model="form.personnel_id" :error="errors.personnel_id" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.role" label="Role" :error="errors.role" />
        <BaseTextField v-model="form.location" label="Location" :error="errors.location" />
        <BaseDatePicker v-model="form.start_date" label="Start Date" :error="errors.start_date" />
        <BaseDatePicker v-model="form.end_date" label="End Date" :error="errors.end_date" />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        label="Remarks"
        placeholder="Optional engagement remarks"
        :error="errors.remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Create</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import EngagementSuggestionField from '~/components/general/EngagementSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import type { CreateEngagementRecordPayload, EngagementManagementListItem } from '~/types/domain/engagement'
import { validateCreateEngagementRecordForm } from '~/utils/engagement-validation'

withDefaults(defineProps<{ isSubmitting?: boolean }>(), {
  isSubmitting: false,
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateEngagementRecordPayload): void
}>()

const form = reactive({
  personnel_id: '',
  engagement_id: '',
  role: '',
  location: '',
  start_date: '',
  end_date: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})

const onEngagementSelected = (engagement: EngagementManagementListItem | null) => {
  if (!engagement) {
    return
  }

  form.role = engagement.engagementCategoryName ?? ''
  form.location = engagement.levelName ?? ''
  form.start_date = engagement.startDate ?? ''
  form.end_date = engagement.endDate ?? ''
}

const onSubmit = () => {
  const result = validateCreateEngagementRecordForm(form)

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
