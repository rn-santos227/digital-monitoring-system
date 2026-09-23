<template>
  <section class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div>
      <h2 class="text-sm font-semibold text-slate-900">
        {{ EQUIPMENT_INCIDENTS_FILTER_CARD_TITLE }}
      </h2>
      <p class="mt-1 text-sm text-slate-600">{{ conditionSummary }}</p>
    </div>
    <div class="flex gap-2">
      <BaseButton
        v-if="activeConditionCount"
        type="button"
        variant="ghost"
        size="sm"
        @click="emitReset"
      >
        {{ EQUIPMENT_INCIDENTS_FILTER_RESET_LABEL }}
      </BaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  EQUIPMENT_INCIDENTS_FILTER_CARD_TITLE,
  EQUIPMENT_INCIDENTS_FILTER_FIELD_OPTIONS,
  EQUIPMENT_INCIDENTS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'
import type {
  EquipmentIncidentSearchCondition,
  EquipmentIncidentSearchQuery,
} from '~/types/domain/incident'

const props = withDefaults(defineProps<{
  modelValue: Partial<EquipmentIncidentSearchQuery>
}>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentIncidentSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = EQUIPMENT_INCIDENTS_FILTER_FIELD_OPTIONS

const conditions = computed<EquipmentIncidentSearchCondition[]>(() => {
  if (!props.modelValue.conditions) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? parsed as EquipmentIncidentSearchCondition[] : []
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
