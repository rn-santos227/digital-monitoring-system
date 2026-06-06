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

const DEFAULT_USAGE_PAGINATION: UsagePaginationState = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

const createPaginationState = (): UsagePaginationState => ({ ...DEFAULT_USAGE_PAGINATION })

const { formatDate } = useDateDisplay()
const route = useRoute()
const authStore = useAuthStore()

const activeTab = ref<EquipmentItemProfileTabId>('personnel')
const equipmentItem = ref<EquipmentItemListItem | null>(null)
const pageError = ref('')

const personnelRows = ref<EquipmentItemPersonnelUsageListItem[]>([])
const companyRows = ref<EquipmentItemCompanyUsageListItem[]>([])
const battalionRows = ref<EquipmentItemBattalionUsageListItem[]>([])

const personnelPagination = ref<UsagePaginationState>(createPaginationState())
const companyPagination = ref<UsagePaginationState>(createPaginationState())
const battalionPagination = ref<UsagePaginationState>(createPaginationState())

const isLoadingPersonnel = ref(false)
const isLoadingCompanies = ref(false)
const isLoadingBattalions = ref(false)

const canViewEquipmentItems = computed(() => {
  return authStore.hasPermissionAccess(EQUIPMENT_ITEMS_PAGE_REQUIRED_PERMISSIONS.view)
})

const equipmentItemId = computed(() => {
  const idValue = route.params.id
  return Array.isArray(idValue) ? (idValue[0] ?? '') : (idValue ?? '')
})

const applyPagination = (target: typeof personnelPagination, response: UsagePaginationState) => {
  target.value = {
    page: response.page,
    pageSize: response.pageSize,
    totalItems: response.totalItems,
    totalPages: response.totalPages,
  }
}

const loadPersonnelUsage = async (page = personnelPagination.value.page, pageSize = personnelPagination.value.pageSize) => {
  const id = equipmentItemId.value

  if (!id) {
    return
  }

  isLoadingPersonnel.value = true

  try {
    const response = await getEquipmentItemPersonnelEndpoint(id, { page, pageSize })
    personnelRows.value = response.items
    applyPagination(personnelPagination, response)
  } finally {
    isLoadingPersonnel.value = false
  }
}

</script>
