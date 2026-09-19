<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  DEPLOYMENTS_FILTER_CARD_TITLE,
  DEPLOYMENTS_FILTER_FIELD_OPTIONS,
  DEPLOYMENTS_FILTER_RESET_LABEL
} from '~/constants/page.constants'
import type {
  DeploymentManagementSearchQuery,
  DeploymentSearchCondition
} from '~/types/domain/deployment'

const props = withDefaults(defineProps<{ modelValue: Partial<DeploymentManagementSearchQuery> }>(), {
  modelValue: () => ({}),
})
</script>
