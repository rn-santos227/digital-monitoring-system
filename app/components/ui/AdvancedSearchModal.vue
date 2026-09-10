<template>
  <BaseModal
    title="Advanced Search"
    description="Build a list of conditions to narrow the records shown."
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-5" @submit.prevent="applySearch">
      <BaseAlert
        v-if="errorMessage"
        title="Search values required"
        :message="errorMessage"
      />

      <BaseRadioGroup
        v-model="draft.match"
        label="Results must match"
        name="advanced-search-match"
        :options="matchOptions"
      />

      <section class="space-y-3" aria-labelledby="advanced-search-conditions-heading">
        <div class="flex items-center justify-between gap-3">
          <h3 id="advanced-search-conditions-heading" class="text-sm font-semibold text-slate-800">
            Conditions
          </h3>
          <BaseButton type="button" variant="secondary" size="sm" icon-name="plus" @click="addCondition()">
            Add condition
          </BaseButton>
        </div>

        <div
          v-for="(condition, index) in draft.conditions"
          :key="condition.id"
          :class="ADVANCED_SEARCH_CONDITION_GRID_CLASSES"
        >
          <BaseSelect v-model="condition.field" :label="`Field ${index + 1}`" :options="fields" />
          <BaseSelect v-model="condition.operator" label="Operator" :options="operatorOptions" />
          <div :class="condition.operator === 'between' ? 'grid grid-cols-[1fr_auto_1fr] items-start gap-2' : ''">
            <BaseTextField
              v-model="condition.value"
              :label="condition.operator === 'between' ? 'From' : 'Value'"
              :type="fieldType(condition.field)"
              :placeholder="ADVANCED_SEARCH_VALUE_PLACEHOLDER"
              :helper-text="condition.operator === 'between' ? '' : ADVANCED_SEARCH_VALUE_HELPER_TEXT"
            />
            <span v-if="condition.operator === 'between'" class="mt-8 text-sm text-slate-500">to</span>
            <BaseTextField
              v-if="condition.operator === 'between'"
              v-model="condition.valueTo"
              label="To"
              :type="fieldType(condition.field)"
            />
          </div>
        </div>
      </section>
    </form>

    <template #footer>
      <div class="flex justify-between gap-3">
        <BaseButton type="button" variant="ghost" @click="clearSearch">Clear all</BaseButton>
        <div class="flex gap-2">
          <BaseButton type="button" variant="secondary" @click="emit('close')">Cancel</BaseButton>
          <BaseButton type="button" @click="applySearch">Apply search</BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ADVANCED_SEARCH_CONDITION_GRID_CLASSES,
  ADVANCED_SEARCH_MATCH_OPTIONS,
  ADVANCED_SEARCH_OPERATOR_OPTIONS,
  ADVANCED_SEARCH_REMOVE_BUTTON_CLASSES,
  ADVANCED_SEARCH_VALUE_HELPER_TEXT,
  ADVANCED_SEARCH_VALUE_PLACEHOLDER,
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
  valueTo: condition?.valueTo ?? '',
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

const addCondition = (index = draft.conditions.length) => draft.conditions.splice(index, 0, createCondition())
const fieldType = (field: string): 'date' | 'text' => {
  const selectedField = props.fields.find(option => option.value === field)

  return selectedField && 'dataType' in selectedField && selectedField.dataType === 'date'
    ? 'date'
    : 'text'
}
const removeCondition = (id: string) => {
  if (draft.conditions.length > 1) {
    draft.conditions = draft.conditions.filter(condition => condition.id !== id)
  }
}

const applySearch = () => {
  const conditions = draft.conditions
    .map(condition => ({ ...condition, value: condition.value.trim(), valueTo: condition.valueTo?.trim() }))
    .filter(condition => condition.value && (condition.operator !== 'between' || condition.valueTo))

  if (!conditions.length) {
    errorMessage.value = 'Enter a value for at least one search condition.'
    return
  }

  errorMessage.value = ''
  emit('apply', { match: draft.match, conditions })
}

const clearSearch = () => emit('clear')
</script>
