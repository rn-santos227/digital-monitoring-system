<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { PersonnelSearchCondition, PersonnelSearchQuery } from '~/types/domain/personnel'
import {
  PERSONNEL_FILTER_CARD_TITLE,
  PERSONNEL_FILTER_FIELD_OPTIONS,
  PERSONNEL_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<PersonnelSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<PersonnelSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = PERSONNEL_FILTER_FIELD_OPTIONS.filter(option => option.value)

const conditions = computed<PersonnelSearchCondition[]>(() => {
  if (!props.modelValue.conditions) {
    return props.modelValue.term
      ? [{ id: 'legacy-condition', field: props.modelValue.fields || fieldOptions[0]?.value || '', operator: 'contains', value: props.modelValue.term }]
      : []
  }

  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? parsed as PersonnelSearchCondition[] : []
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
