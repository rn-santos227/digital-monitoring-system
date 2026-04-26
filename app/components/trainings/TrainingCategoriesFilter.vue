<template>
  <BaseAccordion :title="TRAINING_CATEGORIES_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="TRAINING_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="TRAINING_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="TRAINING_CATEGORIES_FILTER_TERM_LABEL"
          :placeholder="TRAINING_CATEGORIES_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="TRAINING_CATEGORIES_FILTER_FIELDS_LABEL"
          :options="categoryFilterFieldOptions"
          :error="validationErrors.fields"
        />
      </div>

      <footer :class="TRAINING_FILTER_FOOTER_CLASSES">
        <div :class="TRAINING_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ TRAINING_CATEGORIES_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ TRAINING_CATEGORIES_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { TrainingCategorySearchQuery } from '~/types/domain/training'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  TRAINING_CATEGORIES_FILTER_APPLY_LABEL,
  TRAINING_CATEGORIES_FILTER_CARD_TITLE,
  TRAINING_CATEGORIES_FILTER_FIELD_OPTIONS,
  TRAINING_CATEGORIES_FILTER_FIELDS_LABEL,
  TRAINING_CATEGORIES_FILTER_RESET_LABEL,
  TRAINING_CATEGORIES_FILTER_TERM_LABEL,
  TRAINING_CATEGORIES_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  TRAINING_FILTER_ACTIONS_CLASSES,
  TRAINING_FILTER_FIELDS_GRID_CLASSES,
  TRAINING_FILTER_FOOTER_CLASSES,
  TRAINING_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface TrainingCategoriesFilterModel {
  term: string
  fields: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<TrainingCategorySearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<TrainingCategorySearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<TrainingCategoriesFilterModel>({
  term: '',
  fields: '',
})

const syncLocalValue = (value: Partial<TrainingCategorySearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const categoryFilterFieldOptions = [...TRAINING_CATEGORIES_FILTER_FIELD_OPTIONS]

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
