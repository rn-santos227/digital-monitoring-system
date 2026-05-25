<template>
  <BaseModal
    title="View Equipment Category"
    description="Review equipment category details."
    scroll-body
    @close="emit('close')"
  >
    <BaseCard title="Equipment Category Information">
      <dl class="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <dt class="text-slate-500">Code</dt>
          <dd class="font-medium text-slate-900">{{ category.code }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Name</dt>
          <dd class="font-medium text-slate-900">{{ category.name }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Status</dt>
          <dd class="font-medium text-slate-900">{{ category.isActive ? 'Active' : 'Inactive' }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Equipment Items</dt>
          <dd class="font-medium text-slate-900">{{ category.itemCount }}</dd>
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
import type { EquipmentCategoryDetailItem } from '~/types/domain/equipment'

defineProps<{ category: EquipmentCategoryDetailItem }>()
const emit = defineEmits<{ (event: 'close'): void }>()
</script>
