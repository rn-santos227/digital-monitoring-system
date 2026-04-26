<template>
  <BaseAccordion :title="TRAININGS_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="TRAINING_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="TRAINING_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="TRAININGS_FILTER_TERM_LABEL"
          :placeholder="TRAININGS_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="TRAININGS_FILTER_FIELDS_LABEL"
          :options="trainingFilterFieldOptions"
          :error="validationErrors.fields"
        />
      </div>

      <footer :class="TRAINING_FILTER_FOOTER_CLASSES">
        <div :class="TRAINING_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ TRAININGS_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ TRAININGS_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TrainingSearchQuery } from '~/types/domain/training'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  TRAININGS_FILTER_APPLY_LABEL,
  TRAININGS_FILTER_CARD_TITLE,
  TRAININGS_FILTER_FIELD_OPTIONS,
  TRAININGS_FILTER_FIELDS_LABEL,
  TRAININGS_FILTER_RESET_LABEL,
  TRAININGS_FILTER_TERM_LABEL,
  TRAININGS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  TRAINING_FILTER_ACTIONS_CLASSES,
  TRAINING_FILTER_FIELDS_GRID_CLASSES,
  TRAINING_FILTER_FOOTER_CLASSES,
  TRAINING_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface TrainingsFilterModel {
  term: string
  fields: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<TrainingSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<TrainingSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<TrainingsFilterModel>({
  term: '',
  fields: '',
})

const syncLocalValue = (value: Partial<TrainingSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const trainingFilterFieldOptions = [...TRAININGS_FILTER_FIELD_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
