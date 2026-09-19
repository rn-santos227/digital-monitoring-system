<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import { 
  DEPLOYMENT_RECORDS_FILTER_CARD_TITLE,
  DEPLOYMENT_RECORDS_FILTER_FIELD_OPTIONS,
  DEPLOYMENT_RECORDS_FILTER_RESET_LABEL
} from '~/constants/page.constants'
import type { 
  DeploymentManagementSearchQuery,
  DeploymentSearchCondition
} from '~/types/domain/deployment'

const props = withDefaults(defineProps<{ modelValue: Partial<DeploymentManagementSearchQuery> }>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<DeploymentManagementSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = DEPLOYMENT_RECORDS_FILTER_FIELD_OPTIONS
const conditions = computed<DeploymentSearchCondition[]>(() => {
  if (!props.modelValue.conditions) return []
  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? parsed as DeploymentSearchCondition[] : []
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
</script>
