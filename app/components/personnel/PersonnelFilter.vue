<template>
  <BaseAccordion :title="PERSONNEL_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="PERSONNEL_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="PERSONNEL_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="PERSONNEL_FILTER_TERM_LABEL"
          :placeholder="PERSONNEL_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="PERSONNEL_FILTER_FIELDS_LABEL"
          :options="personnelFilterFieldOptions"
          :error="validationErrors.fields"
        />
      </div>

      <footer :class="PERSONNEL_FILTER_FOOTER_CLASSES">
        <div :class="PERSONNEL_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ PERSONNEL_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ PERSONNEL_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { PersonnelSearchQuery } from '~/types/domain/personnel'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  PERSONNEL_FILTER_APPLY_LABEL,
  PERSONNEL_FILTER_CARD_TITLE,
  PERSONNEL_FILTER_FIELD_OPTIONS,
  PERSONNEL_FILTER_FIELDS_LABEL,
  PERSONNEL_FILTER_RESET_LABEL,
  PERSONNEL_FILTER_TERM_LABEL,
  PERSONNEL_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  PERSONNEL_FILTER_ACTIONS_CLASSES,
  PERSONNEL_FILTER_FIELDS_GRID_CLASSES,
  PERSONNEL_FILTER_FOOTER_CLASSES,
  PERSONNEL_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface PersonnelFilterModel {
  term: string
  fields: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<PersonnelSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<PersonnelSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<PersonnelFilterModel>({
  term: '',
  fields: '',
})

const syncLocalValue = (value: Partial<PersonnelSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const personnelFilterFieldOptions = [...PERSONNEL_FILTER_FIELD_OPTIONS]

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
