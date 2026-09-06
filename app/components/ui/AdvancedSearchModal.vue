<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ADVANCED_SEARCH_MATCH_OPTIONS,
  ADVANCED_SEARCH_OPERATOR_OPTIONS,
  type AdvancedSearchCondition,
  type AdvancedSearchField,
  type AdvancedSearchMatch,
  type AdvancedSearchValue,
} from '~/constants/ui.constants'

const props = defineProps<{
  fields: readonly AdvancedSearchField[]
  modelValue: AdvancedSearchValue
}>()

const emit = defineEmits<{
  (event: 'apply', value: AdvancedSearchValue): void
  (event: 'clear'): void
  (event: 'close'): void
}>()

let nextConditionId = 0
const createCondition = (condition?: Partial<AdvancedSearchCondition>): AdvancedSearchCondition => ({
  id: condition?.id ?? `advanced-condition-${nextConditionId++}`,
  field: condition?.field ?? props.fields[0]?.value ?? '',
  operator: condition?.operator ?? 'contains',
  value: condition?.value ?? '',
})

const draft = reactive<{ match: AdvancedSearchMatch; conditions: AdvancedSearchCondition[] }>({
  match: props.modelValue.match,
  conditions: props.modelValue.conditions.length
    ? props.modelValue.conditions.map(createCondition)
    : [createCondition()],
})
const errorMessage = ref('')
const matchOptions = [...ADVANCED_SEARCH_MATCH_OPTIONS]
const operatorOptions = [...ADVANCED_SEARCH_OPERATOR_OPTIONS]

const addCondition = () => draft.conditions.push(createCondition())
const removeCondition = (id: string) => {
  if (draft.conditions.length > 1) {
    draft.conditions = draft.conditions.filter(condition => condition.id !== id)
  }
}

const applySearch = () => {

}

const clearSearch = () => emit('clear')
</script>
