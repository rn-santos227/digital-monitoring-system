<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { RankListQuery, RankSearchCondition } from '~/types/domain/rank'
import {
  RANK_FILTER_CARD_TITLE,
  RANK_FILTER_FIELD_OPTIONS,
  RANK_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<RankListQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<RankListQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = RANK_FILTER_FIELD_OPTIONS.filter(option => option.value)
const conditions = computed<RankSearchCondition[]>(() => {
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

})
</script>
