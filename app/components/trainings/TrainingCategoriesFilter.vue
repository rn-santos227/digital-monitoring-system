<template>
  <section class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div>
      <h2 class="text-sm font-semibold text-slate-900">{{ TRAINING_CATEGORIES_FILTER_CARD_TITLE }}</h2>
      <p class="mt-1 text-sm text-slate-600">
        {{ conditionSummary }}
      </p>
    </div>
    <div class="flex gap-2">
      <BaseButton
        v-if="activeConditionCount"
        type="button"
        variant="ghost"
        size="sm"
        @click="emitReset"
      >
        {{ TRAINING_CATEGORIES_FILTER_RESET_LABEL }}
      </BaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { TrainingCategorySearchCondition, TrainingCategorySearchQuery } from '~/types/domain/training'
import {
  TRAINING_CATEGORIES_FILTER_CARD_TITLE,
  TRAINING_CATEGORIES_FILTER_FIELD_OPTIONS,
  TRAINING_CATEGORIES_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<TrainingCategorySearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<TrainingCategorySearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = TRAINING_CATEGORIES_FILTER_FIELD_OPTIONS
const conditions = computed<TrainingCategorySearchCondition[]>(() => {
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
    return Array.isArray(parsed) ? parsed as TrainingCategorySearchCondition[] : []
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
</script>
