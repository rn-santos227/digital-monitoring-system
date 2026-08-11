<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import BattalionsSuggestionField from '~/components/general/BattalionsSuggestionField.vue'
import CompaniesSuggestionField from '~/components/general/CompaniesSuggestionField.vue'
import RankSuggestionField from '~/components/general/RankSuggestionField.vue'
import {
  PERSONNEL_BULK_UPDATE_MODAL_DESCRIPTION,
  PERSONNEL_BULK_UPDATE_MODAL_TITLE,
  PERSONNEL_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { PersonnelBulkUpdateValues } from '~/types/domain/personnel'
import { validatePersonnelBulkUpdate } from '~/utils/bulk-management-validation'

type FieldKey = keyof PersonnelBulkUpdateValues
withDefaults(defineProps<{ selectedCount: number; isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})
</script>
