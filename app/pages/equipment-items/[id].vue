<template>
  <main class="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
    <section :class="EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES">
      <header :class="PERSONNEL_PROFILE_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_ITEM_PROFILE_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_ITEM_PROFILE_PAGE_SUBTITLE }}</p>
      </header>

      <BaseAlert
        v-if="!canViewEquipmentItems"
        message="You do not have permission to view equipment item records."
        tone="warning"
      />

      <template v-else>
        <BaseAlert v-if="pageError" :message="pageError" tone="danger" />

        <template v-if="equipmentItem">
          <div class="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <BaseCard>
              <div class="flex flex-col items-center gap-4 text-center">
                <BaseImage size="lg" :alt="equipmentItem.name" :fallback-text="equipmentItem.name" />
                <div class="space-y-1">
                  <h2 class="text-xl font-semibold text-slate-900">{{ equipmentItem.name }}</h2>
                  <p class="text-sm text-slate-600">{{ equipmentItem.equipmentCode }} · {{ equipmentItem.categoryName }}</p>
                </div>
                <div class="w-full space-y-2 rounded-xl bg-slate-50 p-3 text-left text-sm">
                  <p><span class="font-semibold">Category:</span> {{ equipmentItem.categoryCode }} — {{ equipmentItem.categoryName }}</p>
                  <p><span class="font-semibold">Model:</span> {{ equipmentItem.model ?? 'Not set' }}</p>
                  <p><span class="font-semibold">Manufacturer:</span> {{ equipmentItem.manufacturer ?? 'Not set' }}</p>
                  <p><span class="font-semibold">Status:</span> {{ equipmentItem.isActive ? 'Active' : 'Inactive' }}</p>
                </div>
              </div>
            </BaseCard>

            <BaseCard title="Equipment Item Overview">
              <div :class="PERSONNEL_PROFILE_GRID_CLASSES">
                <p><span class="font-semibold">Equipment Code:</span> {{ equipmentItem.equipmentCode }}</p>
                <p><span class="font-semibold">Item Name:</span> {{ equipmentItem.name }}</p>
                <p><span class="font-semibold">Category:</span> {{ equipmentItem.categoryName }}</p>
                <p><span class="font-semibold">Model:</span> {{ equipmentItem.model ?? 'Not set' }}</p>
                <p><span class="font-semibold">Manufacturer:</span> {{ equipmentItem.manufacturer ?? 'Not set' }}</p>
                <p><span class="font-semibold">Unit of Measure:</span> {{ equipmentItem.unitOfMeasure ?? 'Not set' }}</p>
                <p><span class="font-semibold">Minimum Stock Level:</span> {{ equipmentItem.minimumStockLevel }}</p>
                <p><span class="font-semibold">Serialized:</span> {{ equipmentItem.isSerialized ? 'Yes' : 'No' }}</p>
                <p><span class="font-semibold">Status:</span> {{ equipmentItem.isActive ? 'Active' : 'Inactive' }}</p>
                <p><span class="font-semibold">Created At:</span> {{ formatDate(equipmentItem.createdAt) }}</p>
                <p><span class="font-semibold">Updated At:</span> {{ formatDate(equipmentItem.updatedAt) }}</p>
                <p><span class="font-semibold">Description:</span> {{ equipmentItem.description ?? 'No description provided.' }}</p>
              </div>
            </BaseCard>
          </div>

          <BaseTab
            :model-value="activeTab"
            :items="EQUIPMENT_ITEM_PROFILE_TAB_ITEMS"
            :aria-label="EQUIPMENT_ITEM_PROFILE_TABS_ARIA_LABEL"
            @update:model-value="onTabChange"
          />
        </template>
      </template>
    </section>
  </main>
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

const loadCompanyUsage = async (page = companyPagination.value.page, pageSize = companyPagination.value.pageSize) => {
  const id = equipmentItemId.value

  if (!id) {
    return
  }

  isLoadingCompanies.value = true

  try {
    const response = await getEquipmentItemCompaniesEndpoint(id, { page, pageSize })
    companyRows.value = response.items
    applyPagination(companyPagination, response)
  } finally {
    isLoadingCompanies.value = false
  }
}

const loadBattalionUsage = async (page = battalionPagination.value.page, pageSize = battalionPagination.value.pageSize) => {
  const id = equipmentItemId.value

  if (!id) {
    return
  }

  isLoadingBattalions.value = true

  try {
    const response = await getEquipmentItemBattalionsEndpoint(id, { page, pageSize })
    battalionRows.value = response.items
    applyPagination(battalionPagination, response)
  } finally {
    isLoadingBattalions.value = false
  }
}

const loadEquipmentItemProfile = async (id: string) => {
  const response = await getEquipmentItemByIdEndpoint(id)
  equipmentItem.value = response.item
  await Promise.all([
    loadPersonnelUsage(1, personnelPagination.value.pageSize),
    loadCompanyUsage(1, companyPagination.value.pageSize),
    loadBattalionUsage(1, battalionPagination.value.pageSize),
  ])
}

watch([canViewEquipmentItems, equipmentItemId], async ([hasAccess, id]) => {
  if (!hasAccess || !id) {
    return
  }

  pageError.value = ''

  try {
    await loadEquipmentItemProfile(id)
  } catch {
    pageError.value = 'Unable to load equipment item profile.'
  }
}, { immediate: true })

const onTabChange = (nextTab: string) => {
  if (nextTab === 'personnel' || nextTab === 'companies' || nextTab === 'battalions') {
    activeTab.value = nextTab
  }
}

const onPersonnelPageChange = async (page: number) => {
  await loadPersonnelUsage(page)
}

const onPersonnelPageSizeChange = async (pageSize: number) => {
  await loadPersonnelUsage(1, pageSize)
}

const onCompanyPageChange = async (page: number) => {
  await loadCompanyUsage(page)
}

const onCompanyPageSizeChange = async (pageSize: number) => {
  await loadCompanyUsage(1, pageSize)
}

const onBattalionPageChange = async (page: number) => {
  await loadBattalionUsage(page)
}

const onBattalionPageSizeChange = async (pageSize: number) => {
  await loadBattalionUsage(1, pageSize)
}
</script>
