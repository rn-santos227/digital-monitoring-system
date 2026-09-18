
<template>
  <section class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div>
      <h2 class="text-sm font-semibold text-slate-900">
        {{ ENGAGEMENTS_FILTER_CARD_TITLE }}
      </h2>
      <p class="mt-1 text-sm text-slate-600">{{ conditionSummary }}</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  ENGAGEMENTS_FILTER_CARD_TITLE,
  ENGAGEMENTS_FILTER_FIELD_OPTIONS,
  ENGAGEMENTS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'
import type {
  EngagementManagementSearchQuery,
  EngagementSearchCondition,
} from '~/types/domain/engagement'

const props = withDefaults(
  defineProps<{ modelValue: Partial<EngagementManagementSearchQuery> }>(),
  {
    modelValue: () => ({}),
  },
)

const emit = defineEmits<{
  (event: 'apply', value: Partial<EngagementManagementSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = ENGAGEMENTS_FILTER_FIELD_OPTIONS
const conditions = computed<EngagementSearchCondition[]>(() => {
  if (!props.modelValue.conditions) return []
  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? (parsed as EngagementSearchCondition[]) : []
  } catch {
    return []
  }
})
const activeConditionCount = computed(() => conditions.value.length)
const conditionSummary = computed(() =>
  activeConditionCount.value
    ? `${activeConditionCount.value} advanced search condition${activeConditionCount.value === 1 ? '' : 's'} applied`
    : 'No advanced search conditions applied',
)
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
