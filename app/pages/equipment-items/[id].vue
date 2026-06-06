<template>

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EquipmentItemBattalionsUsageTable from '~/components/equipment/views/EquipmentItemBattalionsUsageTable.vue'
import EquipmentItemCompaniesUsageTable from '~/components/equipment/views/EquipmentItemCompaniesUsageTable.vue'
import EquipmentItemPersonnelUsageTable from '~/components/equipment/views/EquipmentItemPersonnelUsageTable.vue'
import {
  EQUIPMENT_ITEM_PROFILE_PAGE_SUBTITLE,
  EQUIPMENT_ITEM_PROFILE_PAGE_TITLE,
  EQUIPMENT_ITEM_PROFILE_TAB_ITEMS,
  EQUIPMENT_ITEM_PROFILE_TABS_ARIA_LABEL,
  EQUIPMENT_ITEMS_PAGE_REQUIRED_PERMISSIONS,
  EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES,
} from '~/constants/page.constants'
import {
  PERSONNEL_PROFILE_GRID_CLASSES,
  PERSONNEL_PROFILE_PAGE_HEADER_CLASSES,
} from '~/constants/shared.constants'
import { useDateDisplay } from '~/composables/useDateDisplay'
import { useAuthStore } from '~/stores/auth'
import type {
  EquipmentItemBattalionUsageListItem,
  EquipmentItemCompanyUsageListItem,
  EquipmentItemListItem,
  EquipmentItemPersonnelUsageListItem,
  EquipmentItemProfileTabId,
} from '~/types/domain/equipment'
import {
  getEquipmentItemBattalionsEndpoint,
  getEquipmentItemByIdEndpoint,
  getEquipmentItemCompaniesEndpoint,
  getEquipmentItemPersonnelEndpoint,
} from '~/utils/equipment-endpoints'

interface UsagePaginationState {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
</script>
