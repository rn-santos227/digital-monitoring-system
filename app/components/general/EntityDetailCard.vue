<template>
  <BaseCard padding="md" class="flex h-full min-h-80 flex-col">
    <div class="flex flex-1 flex-col gap-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{{ eyebrow }}</p>
          <h2 class="line-clamp-2 text-xl font-semibold text-slate-900">{{ title }}</h2>
        </div>
        <BaseChip :tone="statusTone">{{ status }}</BaseChip>
      </div>

      <p v-if="description" class="line-clamp-3 text-sm leading-6 text-slate-600">{{ description }}</p>

      <dl class="grid grid-cols-2 gap-3 text-sm">
        <div v-for="detail in details" :key="detail.label" class="rounded-xl bg-slate-50 p-3">
          <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ detail.label }}</dt>
          <dd class="mt-1 line-clamp-2 font-semibold text-slate-900">{{ detail.value ?? '—' }}</dd>
        </div>
      </dl>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import type { DataTableAction, UiTone } from '~/constants/ui.constants'

export interface EntityCardDetail {
  label: string
  value: string | number | null | undefined
}

withDefaults(defineProps<{
  eyebrow: string
  title: string
  status: string
  statusTone?: UiTone
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
