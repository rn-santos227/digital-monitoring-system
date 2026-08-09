<template>
  <div :class="BULK_DELETE_ACTION_CLASSES">
    <p class="text-sm font-medium text-slate-700">
      {{ selectedCount }} {{ selectedCount === 1 ? singularLabel : pluralLabel }} selected
    </p>
    <div class="flex flex-wrap gap-2">
      <BaseButton size="sm" variant="secondary" :disabled="isDeleting" @click="emit('clear')">
        Clear selection
      </BaseButton>
      <BaseButton
        size="sm"
        variant="danger"
        icon-name="trash"
        :disabled="isDeleting || selectedCount === 0"
        @click="emit('delete')"
      >
        {{ isDeleting ? 'Deleting...' : `Delete selected ${pluralLabel}` }}
      </BaseButton>
    </div>
  </div>
</template>


<script setup lang="ts">
import { BULK_DELETE_ACTION_CLASSES } from '~/constants/shared.constants'

withDefaults(defineProps<{
  selectedCount: number
  singularLabel?: string
  pluralLabel?: string
  isDeleting?: boolean
  showUpdate?: boolean
}>(), {
  singularLabel: 'record',
  pluralLabel: 'records',
  isDeleting: false,
  showUpdate: false,
})

const emit = defineEmits<{
  (event: 'clear'): void
  (event: 'delete'): void
  (event: 'update'): void
}>()
</script>
