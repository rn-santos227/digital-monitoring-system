<template>
  <footer
    v-if="hasPagination"
    :class="BASE_TABLE_PAGINATION_WRAPPER_CLASSES"
  >
    <p>Page {{ currentPage }} of {{ totalPages }}</p>

    <div :class="BASE_TABLE_PAGINATION_BUTTONS_CLASSES">
      <BaseButton
        icon-only
        :icon="ChevronLeftIcon"
        size="sm"
        variant="secondary"
        aria-label="Go to previous page"
        :disabled="!canGoPrevious"
        @click="emit('update:currentPage', currentPage - 1)"
      />

      <BaseButton
        v-for="page in visiblePages"
        :key="page"
        size="sm"
        :variant="page === currentPage ? 'primary' : 'secondary'"
        :aria-label="`Go to page ${page}`"
        @click="emit('update:currentPage', page)"
      >
        {{ page }}
      </BaseButton>

      <BaseButton
        icon-only
        :icon="ChevronRightIcon"
        size="sm"
        variant="secondary"
        aria-label="Go to next page"
        :disabled="!canGoNext"
        @click="emit('update:currentPage', currentPage + 1)"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { toRef } from 'vue'
import {
  BASE_TABLE_PAGINATION_BUTTONS_CLASSES,
  BASE_TABLE_PAGINATION_WRAPPER_CLASSES
} from '~/constants/ui.constants'
import { usePagination } from '~/composables/usePagination'

const props = withDefaults(
  defineProps<{
    currentPage?: number
    totalPages?: number
    maxVisiblePages?: number
  }>(),
  {
    currentPage: 1,
    totalPages: 1,
    maxVisiblePages: 5
  }
)

const emit = defineEmits<{
  (event: 'update:currentPage', value: number): void
}>()

const { hasPagination, canGoNext, canGoPrevious, visiblePages } = usePagination(
  toRef(props, 'currentPage'),
  toRef(props, 'totalPages'),
  toRef(props, 'maxVisiblePages')
)
</script>
