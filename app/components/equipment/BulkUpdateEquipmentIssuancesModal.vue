<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { BulkUpdateField } from '~/constants/ui.constants'
import {
  EQUIPMENT_BULK_UPDATE_WARNING,
  EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_DESCRIPTION,
  EQUIPMENT_ISSUANCES_BULK_UPDATE_MODAL_TITLE,
  EQUIPMENT_ISSUANCES_STATUS_OPTIONS,
} from '~/constants/page.constants'
import type { EquipmentIssuanceBulkUpdateValues } from '~/types/domain/equipment'
import {
  formatBulkUpdateInputValue,
  validateEquipmentBulkUpdate,
} from '~/utils/bulk-management-validation'

</script>
