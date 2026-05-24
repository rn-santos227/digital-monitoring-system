<template>
  <BaseModal
    :title="BATTALION_VIEW_MODAL_TITLE"
    :description="BATTALION_VIEW_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseCard title="Battalion Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Code</dt>
            <dd class="font-medium text-slate-900">{{ battalion.code }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Name</dt>
            <dd class="font-medium text-slate-900">{{ battalion.name }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium text-slate-900">{{ battalion.isActive ? 'Active' : 'Inactive' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Attached Companies</dt>
            <dd class="font-medium text-slate-900">{{ companies.length }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Equipment Assets</dt>
            <dd class="font-medium text-slate-900">{{ equipment.length }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseTab
        :model-value="activeTab"
        :items="BATTALION_VIEW_TAB_ITEMS"
        :aria-label="UNITS_VIEW_TAB_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <UnitsEquipmentAssignmentTable v-if="activeTab === 'equipment'" :rows="equipment" :is-loading="isLoading" />
      <UnitsCompaniesTable v-else :rows="companies" :is-loading="isLoading" />
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">{{ UNITS_VIEW_MODAL_CLOSE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UnitsEquipmentAssignmentTable from '~/components/units/view/UnitsEquipmentAssignmentTable.vue'
import UnitsCompaniesTable from '~/components/units/view/UnitsCompaniesTable.vue'
import {
  BATTALION_VIEW_TAB_ITEMS,
  BATTALION_VIEW_MODAL_DESCRIPTION,
  BATTALION_VIEW_MODAL_TITLE,
  UNITS_VIEW_MODAL_CLOSE_LABEL,
  UNITS_VIEW_TAB_ARIA_LABEL,
} from '~/constants/page.constants'
import type { BattalionDetailItem, CompanyListItem, UnitEquipmentAssetListItem } from '~/types/domain/units'
import {
  getBattalionCompaniesEndpoint,
  getBattalionEquipmentEndpoint,
} from '~/utils/units-endpoints'

const props = defineProps<{
  battalion: BattalionDetailItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const activeTab = ref<'equipment' | 'companies'>('equipment')
const isLoading = ref(false)
const equipment = ref<UnitEquipmentAssetListItem[]>([])
const companies = ref<CompanyListItem[]>([])

const loadBattalionAttachments = async () => {
  isLoading.value = true

  try {
    const [equipmentResponse, companiesResponse] = await Promise.all([
      getBattalionEquipmentEndpoint(props.battalion.id, { page: 1, pageSize: 10 }),
      getBattalionCompaniesEndpoint(props.battalion.id, { page: 1, pageSize: 10, includeInactive: true }),
    ])

    equipment.value = equipmentResponse.items
    companies.value = companiesResponse.items
  } finally {
    isLoading.value = false
  }
}

const onTabChange = (value: string) => {
  activeTab.value = value === 'companies' ? 'companies' : 'equipment'
}

watch(
  () => props.battalion.id,
  () => {
    void loadBattalionAttachments()
  },
  { immediate: true }
)
</script>
