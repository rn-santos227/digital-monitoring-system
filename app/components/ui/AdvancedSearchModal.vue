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
</script>
