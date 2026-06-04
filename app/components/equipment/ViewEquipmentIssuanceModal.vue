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
        </dl>
      </BaseCard>
    </div>
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
