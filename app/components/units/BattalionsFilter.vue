<template>
  <BaseAccordion :title="BATTALIONS_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="UNITS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="UNITS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="BATTALIONS_FILTER_TERM_LABEL"
          :placeholder="BATTALIONS_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="BATTALIONS_FILTER_FIELDS_LABEL"
          :options="battalionFilterFieldOptions"
          :error="validationErrors.fields"
        />

        <BaseSelect
          v-model="localValue.status"
          :label="BATTALIONS_FILTER_STATUS_LABEL"
          :options="battalionFilterStatusOptions"
        />
      </div>

      <footer :class="UNITS_FILTER_FOOTER_CLASSES">
        <div :class="UNITS_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ BATTALIONS_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ BATTALIONS_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { BattalionSearchQuery } from '~/types/domain/units'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  BATTALIONS_FILTER_APPLY_LABEL,
  BATTALIONS_FILTER_CARD_TITLE,
  BATTALIONS_FILTER_FIELD_OPTIONS,
  BATTALIONS_FILTER_FIELDS_LABEL,
  BATTALIONS_FILTER_RESET_LABEL,
  BATTALIONS_FILTER_STATUS_LABEL,
  BATTALIONS_FILTER_STATUS_OPTIONS,
  BATTALIONS_FILTER_TERM_LABEL,
  BATTALIONS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  UNITS_FILTER_ACTIONS_CLASSES,
  UNITS_FILTER_FIELDS_GRID_CLASSES,
  UNITS_FILTER_FOOTER_CLASSES,
  UNITS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface BattalionsFilterModel {
  term: string
  fields: string
  status: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<BattalionSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<BattalionSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<BattalionsFilterModel>({
  term: '',
  fields: '',
  status: '',
})

const syncLocalValue = (value: Partial<BattalionSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''

  if (value.isActive === true) {
    localValue.status = 'active'
    return
  }

  if (value.isActive === false) {
    localValue.status = 'inactive'
    return
  }

  localValue.status = ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const battalionFilterFieldOptions = [...BATTALIONS_FILTER_FIELD_OPTIONS]
const battalionFilterStatusOptions = [...BATTALIONS_FILTER_STATUS_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
    isActive: localValue.status === 'active' ? true : localValue.status === 'inactive' ? false : undefined,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
