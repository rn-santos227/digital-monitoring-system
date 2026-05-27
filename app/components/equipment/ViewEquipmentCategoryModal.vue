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
import { onMounted, ref } from 'vue'
import EquipmentCategoryItemsTable from '~/components/equipment/views/EquipmentCategoryItemsTable.vue'
import { getEquipmentItemsByCategoryEndpoint } from '~/utils/equipment-endpoints'
import type { EquipmentCategoryDetailItem } from '~/types/domain/equipment'

const props = defineProps<{ category: EquipmentCategoryDetailItem }>()
const emit = defineEmits<{ (event: 'close'): void }>()

const categoryItems = ref<import('~/types/domain/equipment').EquipmentItemListItem[]>([])
const isItemsLoading = ref(false)

const loadCategoryItems = async () => {
  isItemsLoading.value = true

  try {
    const response = await getEquipmentItemsByCategoryEndpoint(props.category.id, {
      page: 1,
      pageSize: 100,
    })
    categoryItems.value = response.items
  } catch {
    categoryItems.value = []
  } finally {
    isItemsLoading.value = false
  }
}

onMounted(() => {
  void loadCategoryItems()
})
</script>
