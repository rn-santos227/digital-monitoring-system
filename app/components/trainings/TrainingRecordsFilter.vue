<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { TrainingRecordSearchCondition, TrainingRecordSearchQuery } from '~/types/domain/training'
import {
  TRAINING_RECORDS_FILTER_CARD_TITLE,
  TRAINING_RECORDS_FILTER_FIELD_OPTIONS,
  TRAINING_RECORDS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

</script>
