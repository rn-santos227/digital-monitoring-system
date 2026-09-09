<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { BattalionSearchCondition, BattalionSearchQuery } from '~/types/domain/units'
import {
  BATTALIONS_FILTER_CARD_TITLE,
  BATTALIONS_FILTER_FIELD_OPTIONS,
  BATTALIONS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<BattalionSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<BattalionSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = BATTALIONS_FILTER_FIELD_OPTIONS.filter(option => option.value)
const conditions = computed<BattalionSearchCondition[]>(() => {
  if (!props.modelValue.conditions) {
    return props.modelValue.term
      ? [{
          id: 'legacy-condition',
          field: props.modelValue.fields || fieldOptions[0]?.value || '',
          operator: 'contains',
          value: props.modelValue.term || '',
        }]
      : []
  }

  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? parsed as BattalionSearchCondition[] : []
  } catch {
    return []
  }
})
const activeConditionCount = computed(() => conditions.value.length)
const advancedSearchValue = computed<AdvancedSearchValue>(() => ({
  match: props.modelValue.match ?? 'all',
  conditions: conditions.value,
}))

const emitApply = (value: AdvancedSearchValue) => {
  emit('apply', { conditions: JSON.stringify(value.conditions), match: value.match })
  isModalOpen.value = false
}
</script>
