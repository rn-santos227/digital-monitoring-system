<template>
  <BaseModal
    :title="TRAININGS_UPDATE_MODAL_TITLE"
    :description="TRAININGS_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseTextField
        v-model="form.trainingTitle"
        :label="TRAININGS_CREATE_TITLE_LABEL"
        :placeholder="TRAININGS_CREATE_TITLE_PLACEHOLDER"
        :error="errors.trainingTitle"
        required
      />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.trainingCategoryId"
          :label="TRAININGS_CREATE_CATEGORY_LABEL"
          :placeholder="TRAININGS_CREATE_CATEGORY_PLACEHOLDER"
          :error="errors.trainingCategoryId"
        />

        <BaseTextField
          v-model="form.statusId"
          :label="TRAININGS_CREATE_STATUS_LABEL"
          :placeholder="TRAININGS_CREATE_STATUS_PLACEHOLDER"
          :error="errors.statusId"
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.levelId"
          :label="TRAININGS_CREATE_LEVEL_LABEL"
          :placeholder="TRAININGS_CREATE_LEVEL_PLACEHOLDER"
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
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ TRAININGS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  TRAININGS_CREATE_CATEGORY_LABEL,
  TRAININGS_CREATE_CATEGORY_PLACEHOLDER,
  TRAININGS_CREATE_END_DATE_LABEL,
  TRAININGS_CREATE_LEVEL_LABEL,
  TRAININGS_CREATE_LEVEL_PLACEHOLDER,
  TRAININGS_CREATE_REMARKS_LABEL,
  TRAININGS_CREATE_REMARKS_PLACEHOLDER,
  TRAININGS_CREATE_START_DATE_LABEL,
  TRAININGS_CREATE_STATUS_LABEL,
  TRAININGS_CREATE_STATUS_PLACEHOLDER,
  TRAININGS_CREATE_TITLE_LABEL,
  TRAININGS_CREATE_TITLE_PLACEHOLDER,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_UPDATE_LABEL,
  TRAININGS_UPDATE_MODAL_DESCRIPTION,
  TRAININGS_UPDATE_MODAL_TITLE,
} from '~/constants/page.constants'
import type { UpdateTrainingPayload } from '~/types/domain/training'
import { validateUpdateTrainingForm } from '~/utils/training-validation'

const props = withDefaults(defineProps<{
  initialValues: {
    trainingTitle: string
    trainingCategoryId: string
    statusId: string
    levelId: string
    startDate: string
    endDate: string
    defaultRemarks: string
  }
  isSubmitting?: boolean
}>(), {
  isSubmitting: false,
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateTrainingPayload): void
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

watch(() => props.initialValues, (value) => {
  form.trainingTitle = value.trainingTitle
  form.trainingCategoryId = value.trainingCategoryId
  form.statusId = value.statusId
  form.levelId = value.levelId
  form.startDate = value.startDate
  form.endDate = value.endDate
  form.defaultRemarks = value.defaultRemarks
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateUpdateTrainingForm(form)

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
