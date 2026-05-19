<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import EngagementSuggestionField from '~/components/general/EngagementSuggestionField.vue'
import type { CreateEngagementRecordPayload, EngagementManagementListItem } from '~/types/domain/engagement'
import { validateQuickAssignEngagementForm } from '~/utils/service-status-validation'

withDefaults(defineProps<{ isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: Omit<CreateEngagementRecordPayload, 'personnel_id'>): void
}>()

const form = reactive({
  engagement_id: '',
  certificate_no: '',
  valid_until: '',
  remarks: '',
})


</script>