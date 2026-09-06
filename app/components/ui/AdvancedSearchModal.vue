<template>
  <BaseModal
    title="Advanced Search"
    description="Build a list of conditions to narrow the records shown."
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-5" @submit.prevent="applySearch">
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
          <BaseButton type="button" variant="secondary" size="sm" icon-name="plus" @click="addCondition">
            Add condition
          </BaseButton>
        </div>

        <div
          v-for="(condition, index) in draft.conditions"
          :key="condition.id"
          class="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)_minmax(0,1.25fr)_auto] md:items-end"
        >
          <BaseSelect v-model="condition.field" :label="`Field ${index + 1}`" :options="fields" />
          <BaseSelect v-model="condition.operator" label="Operator" :options="operatorOptions" />
          <BaseTextField v-model="condition.value" label="Value" placeholder="Enter a value" />
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
  const conditions = draft.conditions
    .map(condition => ({ ...condition, value: condition.value.trim() }))
    .filter(condition => condition.value)

  if (!conditions.length) {
    errorMessage.value = 'Enter a value for at least one search condition.'
    return
  }

  errorMessage.value = ''
  emit('apply', { match: draft.match, conditions })
}

const clearSearch = () => emit('clear')
</script>
