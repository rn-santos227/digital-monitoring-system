<template>
  <BaseModal
    :title="TRAININGS_CREATE_MODAL_TITLE"
    :description="TRAININGS_CREATE_MODAL_DESCRIPTION"
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert
        v-if="warningMessage"
        :message="warningMessage"
        tone="warning"
      />
      <BaseAlert
        v-if="errorMessage"
        :message="errorMessage"
        tone="danger"
      />
      <BaseTextField
        v-model="form.trainingTitle"
        :label="TRAININGS_CREATE_TITLE_LABEL"
        :placeholder="TRAININGS_CREATE_TITLE_PLACEHOLDER"
        :error="errors.trainingTitle"
        required
      />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseSuggestionField
          v-model="form.trainingCategoryId"
          :label="TRAININGS_CREATE_CATEGORY_LABEL"
          :placeholder="TRAININGS_CREATE_CATEGORY_PLACEHOLDER"
          :options="trainingCategorySuggestionOptions"
          :empty-message="TRAININGS_CREATE_CATEGORY_EMPTY_MESSAGE"
          :error="errors.trainingCategoryId"
        />

        <BaseSelect
          v-model="form.statusId"
          :label="TRAININGS_CREATE_STATUS_LABEL"
          :placeholder="TRAININGS_CREATE_STATUS_PLACEHOLDER"
          :options="TRAININGS_CREATE_STATUS_OPTIONS"
          :error="errors.statusId"
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseSelect
          v-model="form.levelId"
          :label="TRAININGS_CREATE_LEVEL_LABEL"
          :placeholder="TRAININGS_CREATE_LEVEL_PLACEHOLDER"
          :options="TRAININGS_CREATE_LEVEL_OPTIONS"
          :error="errors.levelId"
        />

        <div class="grid gap-4 grid-cols-2">
          <BaseDatePicker
            v-model="form.startDate"
            :label="TRAININGS_CREATE_START_DATE_LABEL"
            :error="errors.startDate"
          />
          <BaseDatePicker
            v-model="form.endDate"
            :label="TRAININGS_CREATE_END_DATE_LABEL"
            :error="errors.endDate"
          />
        </div>
      </div>

      <BaseTextArea
        v-model="form.defaultRemarks"
        :label="TRAININGS_CREATE_REMARKS_LABEL"
        :placeholder="TRAININGS_CREATE_REMARKS_PLACEHOLDER"
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
import { computed, onMounted, reactive, shallowRef } from 'vue'
import {
  TRAININGS_CREATE_CATEGORY_EMPTY_MESSAGE,
  TRAININGS_CREATE_CATEGORY_LABEL,
  TRAININGS_CREATE_CATEGORY_PLACEHOLDER,
  TRAININGS_CREATE_END_DATE_LABEL,
  TRAININGS_CREATE_LEVEL_LABEL,
  TRAININGS_CREATE_LEVEL_OPTIONS,
  TRAININGS_CREATE_LEVEL_PLACEHOLDER,
  TRAININGS_CREATE_MODAL_DESCRIPTION,
  TRAININGS_CREATE_MODAL_TITLE,
  TRAININGS_CREATE_REMARKS_LABEL,
  TRAININGS_CREATE_REMARKS_PLACEHOLDER,
  TRAININGS_CREATE_START_DATE_LABEL,
  TRAININGS_CREATE_STATUS_LABEL,
  TRAININGS_CREATE_STATUS_OPTIONS,
  TRAININGS_CREATE_STATUS_PLACEHOLDER,
  TRAININGS_CREATE_TITLE_LABEL,
  TRAININGS_CREATE_TITLE_PLACEHOLDER,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_CREATE_LABEL,
} from '~/constants/page.constants'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import type { CreateTrainingPayload, TrainingCategoryListItem } from '~/types/domain/training'
import { searchTrainingCategoriesEndpoint } from '~/utils/training-endpoints'
import { validateCreateTrainingForm } from '~/utils/training-validation'

withDefaults(defineProps<{ isSubmitting?: boolean; warningMessage?: string; errorMessage?: string }>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateTrainingPayload): void
}>()

const form = reactive({
  trainingTitle: '',
  trainingCategoryId: '',
  statusId: '',
  levelId: '',
  startDate: '',
  endDate: '',
  defaultRemarks: '',
})

const trainingCategories = shallowRef<TrainingCategoryListItem[]>([])

const trainingCategorySuggestionOptions = computed<SuggestionFieldOption[]>(() => {
  return trainingCategories.value.map((item) => ({
    value: item.id,
    label: item.name,
    description: item.code,
  }))
})

onMounted(async () => {
  const response = await searchTrainingCategoriesEndpoint({ page: 1, pageSize: 1000 })
  trainingCategories.value = response.items
})

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateCreateTrainingForm(form)

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
