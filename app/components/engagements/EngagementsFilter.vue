<template>

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

</script>
