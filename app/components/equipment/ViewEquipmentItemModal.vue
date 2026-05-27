<template>
  <BaseModal
    title="View Equipment Item"
    description="Review equipment item details."
    scroll-body
    @close="emit('close')"
  >
    <BaseCard title="Equipment Item Information">
      <dl class="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <dt class="text-slate-500">Equipment code</dt>
          <dd class="font-medium text-slate-900">{{ item.equipmentCode }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Name</dt>
          <dd class="font-medium text-slate-900">{{ item.name }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Category</dt>
          <dd class="font-medium text-slate-900">{{ item.categoryCode }} — {{ item.categoryName }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Status</dt>
          <dd class="font-medium text-slate-900">{{ item.isActive ? 'Active' : 'Inactive' }}</dd>
        </div>
      </dl>
    </BaseCard>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">Close</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { EquipmentItemListItem } from '~/types/domain/equipment'

defineProps<{ item: EquipmentItemListItem }>()
const emit = defineEmits<{ (event: 'close'): void }>()
</script>
