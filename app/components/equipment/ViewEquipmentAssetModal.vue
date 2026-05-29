<template>
  <BaseModal
    title="View Equipment Asset"
    description="Review equipment asset details and status information."
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseCard title="Asset Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Asset tag</dt>
            <dd class="font-medium text-slate-900">{{ asset.assetTag }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Equipment item</dt>
            <dd class="font-medium text-slate-900">{{ asset.equipmentItemCode }} - {{ asset.equipmentItemName }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Serial number</dt>
            <dd class="font-medium text-slate-900">{{ asset.serialNo || 'N/A' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Batch number</dt>
            <dd class="font-medium text-slate-900">{{ asset.batchNo || 'N/A' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Procurement date</dt>
            <dd class="font-medium text-slate-900">{{ formattedProcurementDate }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Acquisition cost</dt>
            <dd class="font-medium text-slate-900">{{ formattedAcquisitionCost }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard title="Operational Status">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Asset status</dt>
            <dd class="font-medium text-slate-900">{{ asset.assetStatusName }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Condition status</dt>
            <dd class="font-medium text-slate-900">{{ asset.conditionStatusName || 'N/A' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Serviceability status</dt>
            <dd class="font-medium text-slate-900">{{ asset.serviceabilityStatusName || 'N/A' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Current location</dt>
            <dd class="font-medium text-slate-900">{{ asset.currentLocation || 'N/A' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Fund source</dt>
            <dd class="font-medium text-slate-900">{{ asset.fundSource || 'N/A' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Updated at</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(asset.updatedAt) }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard v-if="asset.remarks" title="Remarks">
        <p class="text-sm leading-6 text-slate-700">{{ asset.remarks }}</p>
      </BaseCard>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">Close</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import type { EquipmentAssetListItem } from '~/types/domain/equipment'

const props = defineProps<{ asset: EquipmentAssetListItem }>()
const emit = defineEmits<{ (event: 'close'): void }>()
const { formatDate } = useDateDisplay()

const formattedProcurementDate = computed(() => {
  return props.asset.procurementDate ? formatDate(props.asset.procurementDate) : 'N/A'
})

const formattedAcquisitionCost = computed(() => {
  if (props.asset.acquisitionCost === null) {
    return 'N/A'
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(props.asset.acquisitionCost)
})
</script>
