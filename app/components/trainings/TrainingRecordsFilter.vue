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
  modelValue: Partial<TrainingRecordSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<TrainingRecordSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = TRAINING_RECORDS_FILTER_FIELD_OPTIONS
</script>
