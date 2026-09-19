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
</script>
