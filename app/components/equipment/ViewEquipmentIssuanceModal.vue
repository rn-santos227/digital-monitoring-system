<template>
  <BaseModal
    title="View Equipment Issuance"
    description="Review equipment issuance details, assignment, return timeline, and status information."
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <BaseCard title="Issuance Information">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Issue no.</dt>
            <dd class="font-medium text-slate-900">{{ issuance.issueNo }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Issuance status</dt>
            <dd class="font-medium text-slate-900">{{ issuance.statusName }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Issue date</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(issuance.issueDate) }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Expected return date</dt>
            <dd class="font-medium text-slate-900">{{ formattedExpectedReturnDate }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Actual return date</dt>
            <dd class="font-medium text-slate-900">{{ formattedActualReturnDate }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Quantity issued</dt>
            <dd class="font-medium text-slate-900">{{ issuance.quantityIssued }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard title="Equipment Assignment">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Asset tag</dt>
            <dd class="font-medium text-slate-900">{{ issuance.equipmentAssetTag }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Equipment item</dt>
            <dd class="font-medium text-slate-900">{{ issuance.equipmentItemName }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Issued to</dt>
            <dd class="font-medium text-slate-900">{{ issuance.issuedToPersonnelName }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Issued by</dt>
            <dd class="font-medium text-slate-900">{{ issuance.issuedByPersonnelName }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Deployment record</dt>
            <dd class="font-medium text-slate-900">{{ issuance.deploymentLabel || 'Not assigned' }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard title="Locations">
        <dl class="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt class="text-slate-500">Issued location</dt>
            <dd class="font-medium text-slate-900">{{ issuance.issuedLocation || 'Not specified' }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Return location</dt>
            <dd class="font-medium text-slate-900">{{ issuance.returnLocation || 'Not specified' }}</dd>
          </div>
        </dl>
      </BaseCard>

      <BaseCard v-if="issuance.remarks" title="Remarks">
        <p class="text-sm leading-6 text-slate-700">{{ issuance.remarks }}</p>
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
import type { EquipmentIssuanceListItem } from '~/types/domain/equipment'

const props = defineProps<{ issuance: EquipmentIssuanceListItem }>()
const emit = defineEmits<{ (event: 'close'): void }>()
const { formatDate } = useDateDisplay()

const formattedExpectedReturnDate = computed(() => {
  return props.issuance.expectedReturnDate ? formatDate(props.issuance.expectedReturnDate) : 'N/A'
})

const formattedActualReturnDate = computed(() => {
  return props.issuance.actualReturnDate ? formatDate(props.issuance.actualReturnDate) : 'N/A'
})
</script>
