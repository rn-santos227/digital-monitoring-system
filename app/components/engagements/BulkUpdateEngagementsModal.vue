<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ENGAGEMENTS_BULK_UPDATE_MODAL_TITLE,
  ENGAGEMENTS_BULK_UPDATE_MODAL_DESCRIPTION,
  ENGAGEMENTS_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { EngagementBulkUpdateValues } from '~/types/domain/engagement'
import { validateEngagementBulkUpdate } from '~/utils/bulk-management-validation'
</script>
