<template>
  <footer :class="BASE_TABLE_PAGINATION_WRAPPER_CLASSES">
    <div :class="BASE_TABLE_PAGINATION_STATUS_CLASSES">
      <p>{{ statusLabel }}</p>
      <p>Page {{ normalizedCurrentPage }} of {{ normalizedTotalPages }}</p>
    </div>

    <div :class="BASE_TABLE_PAGINATION_CONTROLS_CLASSES">
      <div v-if="showPageSizeSelector" class="flex items-center gap-2">
        <span>Items per page</span>
        <BaseSelect
          :model-value="String(pageSize)"
          :options="normalizedPageSizeOptions"
          @update:model-value="onPageSizeChange"
        />
      </div>

      <div :class="BASE_TABLE_PAGINATION_BUTTONS_CLASSES">
        <BaseButton
          icon-only
          :icon="ChevronLeftIcon"
          size="sm"
          variant="secondary"
          aria-label="Go to previous page"
          :disabled="!canGoPrevious"
          @click="emit('update:currentPage', normalizedCurrentPage - 1)"
        />

        <BaseButton
          v-for="page in visiblePages"
          :key="page"
          size="sm"
          :variant="page === normalizedCurrentPage ? 'primary' : 'secondary'"
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
          @click="emit('update:currentPage', normalizedCurrentPage + 1)"
        />
      </div>

      <div v-if="showPageJump" class="flex items-center gap-2">
        <span>Jump to page</span>
        <div class="w-20">
          <BaseTextField
            v-model="pageJumpInput"
            type="number"
            placeholder="1"
            @keyup.enter="handlePageJump"
          />
        </div>
        <BaseButton size="sm" variant="secondary" @click="handlePageJump">
          Go
        </BaseButton>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { computed, ref, toRef, watch } from 'vue'
import {
  BASE_TABLE_PAGINATION_BUTTONS_CLASSES,
  BASE_TABLE_PAGINATION_CONTROLS_CLASSES,
  BASE_TABLE_PAGINATION_STATUS_CLASSES,
  BASE_TABLE_PAGINATION_WRAPPER_CLASSES
} from '~/constants/ui.constants'
import { TABLE_PAGE_SIZE_OPTIONS } from '~/constants/table.constants'
import { usePagination } from '~/composables/usePagination'

const props = withDefaults(
  defineProps<{
    currentPage?: number
    totalPages?: number
    maxVisiblePages?: number
    totalItems?: number
    pageSize?: number
    pageSizeOptions?: readonly number[]
    showPageSizeSelector?: boolean
    showPageJump?: boolean
  }>(),
  {
    currentPage: 1,
    totalPages: 1,
    maxVisiblePages: 5,
    totalItems: 0,
    pageSize: 10,
    pageSizeOptions: () => TABLE_PAGE_SIZE_OPTIONS,
    showPageSizeSelector: true,
    showPageJump: true,
  }
)

const emit = defineEmits<{
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()

const normalizedCurrentPage = computed(() => Math.max(1, props.currentPage))
const normalizedTotalPages = computed(() => Math.max(1, props.totalPages))
const normalizedTotalItems = computed(() => Math.max(0, props.totalItems))

const { canGoNext, canGoPrevious, visiblePages } = usePagination(
  normalizedCurrentPage,
  normalizedTotalPages,
  toRef(props, 'maxVisiblePages')
)

const normalizedPageSizeOptions = computed(() => {
  return props.pageSizeOptions.map((value) => ({
    value: String(value),
    label: String(value),
  }))
})

const statusLabel = computed(() => {
  if (normalizedTotalItems.value === 0) {
    return 'Showing 0 to 0 of 0 records'
  }

  const startIndex = (normalizedCurrentPage.value - 1) * props.pageSize + 1
  const endIndex = Math.min(normalizedCurrentPage.value * props.pageSize, normalizedTotalItems.value)

  return `Showing ${startIndex} to ${endIndex} of ${normalizedTotalItems.value} records`
})

const pageJumpInput = ref(String(normalizedCurrentPage.value))

watch(normalizedCurrentPage, (nextPage) => {
  pageJumpInput.value = String(nextPage)
})

const onPageSizeChange = (nextPageSizeValue: string) => {
  const nextPageSize = Number(nextPageSizeValue)

  if (!Number.isFinite(nextPageSize) || nextPageSize <= 0 || nextPageSize === props.pageSize) {
    return
  }

  emit('update:pageSize', nextPageSize)
}

const handlePageJump = () => {
  const requestedPage = Number(pageJumpInput.value)

  if (!Number.isFinite(requestedPage)) {
    pageJumpInput.value = String(normalizedCurrentPage.value)
    return
  }

  const normalizedRequestedPage = Math.min(
    normalizedTotalPages.value,
    Math.max(1, Math.trunc(requestedPage))
  )

  emit('update:currentPage', normalizedRequestedPage)
}
</script>
