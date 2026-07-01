<template>

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BaseInlineLoader from '~/components/ui/BaseInlineLoader.vue'

const props = withDefaults(defineProps<{
  canLoadMore?: boolean
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
}>(), {
  canLoadMore: false,
  isLoading: false,
  isEmpty: false,
  emptyMessage: 'No records found.',
})


</script>
