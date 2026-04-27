<template>
  <BaseAccordion :title="TRAINING_RECORDS_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="TRAINING_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="TRAINING_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="TRAINING_RECORDS_FILTER_TERM_LABEL"
          :placeholder="TRAINING_RECORDS_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="TRAINING_RECORDS_FILTER_FIELDS_LABEL"
          :options="recordFilterFieldOptions"
          :error="validationErrors.fields"
        />
      </div>

      <footer :class="TRAINING_FILTER_FOOTER_CLASSES">
        <div :class="TRAINING_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ TRAINING_RECORDS_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ TRAINING_RECORDS_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TrainingRecordSearchQuery } from '~/types/domain/training'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  TRAINING_RECORDS_FILTER_APPLY_LABEL,
  TRAINING_RECORDS_FILTER_CARD_TITLE,
  TRAINING_RECORDS_FILTER_FIELD_OPTIONS,
  TRAINING_RECORDS_FILTER_FIELDS_LABEL,
  TRAINING_RECORDS_FILTER_RESET_LABEL,
  TRAINING_RECORDS_FILTER_TERM_LABEL,
  TRAINING_RECORDS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  TRAINING_FILTER_ACTIONS_CLASSES,
  TRAINING_FILTER_FIELDS_GRID_CLASSES,
  TRAINING_FILTER_FOOTER_CLASSES,
  TRAINING_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface TrainingRecordsFilterModel {
  term: string
  fields: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<TrainingRecordSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<TrainingRecordSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<TrainingRecordsFilterModel>({
  term: '',
  fields: '',
})

const syncLocalValue = (value: Partial<TrainingRecordSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const recordFilterFieldOptions = [...TRAINING_RECORDS_FILTER_FIELD_OPTIONS]

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
