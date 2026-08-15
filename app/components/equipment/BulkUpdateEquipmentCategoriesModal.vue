<template>

</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  EQUIPMENT_BULK_UPDATE_WARNING,
  EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_DESCRIPTION,
  EQUIPMENT_CATEGORIES_BULK_UPDATE_MODAL_TITLE,
} from '~/constants/page.constants'
import type { EquipmentCategoryBulkUpdateValues } from '~/types/domain/equipment'
import { validateEquipmentBulkUpdate } from '~/utils/bulk-management-validation'

</script>
