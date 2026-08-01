<template>

</template>

<script lang="ts">
import { BULK_DELETE_ACTION_CLASSES } from '~/constants/shared.constants'

withDefaults(defineProps<{
  selectedCount: number
  singularLabel?: string
  pluralLabel?: string
  isDeleting?: boolean
}>(), {
  singularLabel: 'record',
  pluralLabel: 'records',
  isDeleting: false,
})

const emit = defineEmits<{
  (event: 'clear'): void
  (event: 'delete'): void
}>()
</script>
