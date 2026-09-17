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
</script>
