<template>
  <section class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div>
      <h2 class="text-sm font-semibold text-slate-900">{{ TRAINING_RECORDS_FILTER_CARD_TITLE }}</h2>
      <p class="mt-1 text-sm text-slate-600">
        {{ conditionSummary }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { TrainingRecordSearchCondition, TrainingRecordSearchQuery } from '~/types/domain/training'
import {
  TRAINING_RECORDS_FILTER_CARD_TITLE,
  TRAINING_RECORDS_FILTER_FIELD_OPTIONS,
  TRAINING_RECORDS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<TrainingRecordSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<TrainingRecordSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = TRAINING_RECORDS_FILTER_FIELD_OPTIONS
const conditions = computed<TrainingRecordSearchCondition[]>(() => {
  if (!props.modelValue.conditions) {
    return props.modelValue.term
      ? [{
          id: 'legacy-condition',
          field: props.modelValue.fields || fieldOptions[0]?.value || '',
          operator: 'contains',
          value: props.modelValue.term,
        }]
      : []
  }
  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? parsed as TrainingRecordSearchCondition[] : []
  } catch {
    return []
  }
})
const activeConditionCount = computed(() => conditions.value.length)
const conditionSummary = computed(() => activeConditionCount.value
  ? `${activeConditionCount.value} advanced search condition${activeConditionCount.value === 1 ? '' : 's'} applied`
  : 'No advanced search conditions applied')
const advancedSearchValue = computed<AdvancedSearchValue>(() => ({
  match: props.modelValue.match ?? 'all',
  conditions: conditions.value,
}))

const emitApply = (value: AdvancedSearchValue) => {
  emit('apply', {
    conditions: JSON.stringify(value.conditions),
    match: value.match,
  })
  isModalOpen.value = false
}

const emitReset = () => {
  emit('reset')
  isModalOpen.value = false
}
</script>
