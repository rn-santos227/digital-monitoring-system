<template>

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


</script>
