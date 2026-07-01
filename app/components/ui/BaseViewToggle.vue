<template>
  <BaseTab
    :model-value="modelValue"
    :items="LIST_VIEW_MODE_ITEMS"
    :aria-label="ariaLabel"
    :show-labels="false"
    @update:model-value="emit('update:modelValue', $event as ListViewMode)"
  />
</template>

<script setup lang="ts">
import BaseTab from '~/components/ui/BaseTab.vue'
import { LIST_VIEW_MODE_ITEMS, type ListViewMode } from '~/constants/ui.constants'

withDefaults(defineProps<{
  modelValue: ListViewMode
  ariaLabel?: string
}>(), {
  ariaLabel: 'List view mode',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: ListViewMode): void
}>()
</script>
