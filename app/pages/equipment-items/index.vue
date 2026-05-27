<template>

</template>

<script setup lang="ts">
import EquipmentItemsFilter from '~/components/equipment/EquipmentItemsFilter.vue'
import EquipmentItemsTable from '~/components/equipment/EquipmentItemsTable.vue'
import { useEquipmentItems } from '~/composables/useEquipmentItems'
import {
  EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES,
  EQUIPMENT_ITEMS_PAGE_SUBTITLE,
  EQUIPMENT_ITEMS_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useEquipmentPageHandlers, useEquipmentSearchHandlers } from '~/handlers'
import type { EquipmentItemSearchQuery } from '~/types/domain/equipment'

const { filters, tableRows, pagination, isLoading, error, loadEquipmentItems } = useEquipmentItems()
const { handleFilterReset } = useEquipmentPageHandlers(filters)
const { handleFilterApply } = useEquipmentSearchHandlers(filters)

</script>
