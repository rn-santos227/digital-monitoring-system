<template>
  <BaseModal
    :title="COMPANY_VIEW_MODAL_TITLE"
    :description="COMPANY_VIEW_MODAL_DESCRIPTION"
    size="xl"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseCard title="Company Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Code</dt>
            <dd class="font-medium text-slate-900">{{ company.code }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Name</dt>
            <dd class="font-medium text-slate-900">{{ company.name }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Battalion</dt>
            <dd class="font-medium text-slate-900">{{ company.battalionName ?? company.battalionCode ?? 'Unassigned' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium text-slate-900">{{ company.isActive ? 'Active' : 'Inactive' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Assigned Personnel</dt>
            <dd class="font-medium text-slate-900">{{ personnel.length }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Equipment Assets</dt>
            <dd class="font-medium text-slate-900">{{ equipment.length }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseTab
        :model-value="activeTab"
        :items="COMPANY_VIEW_TAB_ITEMS"
        :aria-label="UNITS_VIEW_TAB_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <UnitsPersonnelTable v-if="activeTab === 'personnel'" :rows="personnel" :is-loading="isLoading" />
      <UnitsEquipmentAssignmentTable v-else :rows="equipment" :is-loading="isLoading" />
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
import UnitsPersonnelTable from '~/components/units/view/UnitsPersonnelTable.vue'
import UnitsEquipmentAssignmentTable from '~/components/units/view/UnitsEquipmentAssignmentTable.vue'
import {
  COMPANY_VIEW_TAB_ITEMS,
  COMPANY_VIEW_MODAL_DESCRIPTION,
  COMPANY_VIEW_MODAL_TITLE,
  UNITS_VIEW_MODAL_CLOSE_LABEL,
  UNITS_VIEW_TAB_ARIA_LABEL,
} from '~/constants/page.constants'
import type { CompanyDetailItem, UnitEquipmentAssetListItem, UnitPersonnelListItem } from '~/types/domain/units'
import {
  getCompanyEquipmentEndpoint,
  getCompanyPersonnelEndpoint,
} from '~/utils/units-endpoints'

const props = defineProps<{
  company: CompanyDetailItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const activeTab = ref<'personnel' | 'equipment'>('personnel')
const isLoading = ref(false)
const personnel = ref<UnitPersonnelListItem[]>([])
const equipment = ref<UnitEquipmentAssetListItem[]>([])

const loadCompanyAttachments = async () => {
  isLoading.value = true

  try {
    const [personnelResponse, equipmentResponse] = await Promise.all([
      getCompanyPersonnelEndpoint(props.company.id, { page: 1, pageSize: 10 }),
      getCompanyEquipmentEndpoint(props.company.id, { page: 1, pageSize: 10 }),
    ])

    personnel.value = personnelResponse.items
    equipment.value = equipmentResponse.items
  } finally {
    isLoading.value = false
  }
}

const onTabChange = (value: string) => {
  activeTab.value = value === 'equipment' ? 'equipment' : 'personnel'
}

watch(
  () => props.company.id,
  () => {
    void loadCompanyAttachments()
  },
  { immediate: true }
)
</script>
