<template>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RANK_BULK_UPDATE_MODAL_DESCRIPTION, RANK_BULK_UPDATE_MODAL_TITLE, RANK_BULK_UPDATE_WARNING } from '~/constants/page.constants'
import type { RankBulkUpdateValues } from '~/types/domain/rank'
import { validateRankBulkUpdate } from '~/utils/bulk-management-validation'

withDefaults(defineProps<{ selectedCount: number; isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: RankBulkUpdateValues): void
}>()

</script>
