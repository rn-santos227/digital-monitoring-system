<template>
  <BaseCard padding="md" class="flex h-full min-h-80 flex-col">
    <div class="flex flex-1 flex-col gap-4">
      
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import type { DataTableAction, UiVariant } from '~/constants/ui.constants'

export interface EntityCardDetail {
  label: string
  value: string | number | null | undefined
}

withDefaults(defineProps<{
  eyebrow: string
  title: string
  status: string
  statusTone?: UiVariant
  description?: string
  details: readonly EntityCardDetail[]
  actions: readonly DataTableAction[]
}>(), {
  statusTone: 'info',
  description: '',
})

const emit = defineEmits<{
  (event: 'action', actionKey: string): void
}>()
</script>
