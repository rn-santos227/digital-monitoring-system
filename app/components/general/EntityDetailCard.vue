<template>
  <BaseCard padding="md" class="flex h-full min-h-80 flex-col">
    <div class="flex flex-1 flex-col gap-4">
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="imageAlt"
          class="h-40 w-full object-cover"
          loading="lazy"
        >
        <div
          v-else
          class="flex h-40 w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-100 to-slate-200 text-center"
        >
          <div class="space-y-2 px-4">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-bold text-emerald-700 shadow-sm">
              {{ placeholderInitials }}
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{{ placeholderLabel }}</p>
          </div>
        </div>
      </div>

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

    <template #actions>
      <BaseButton
        v-for="action in actions"
        :key="action.key"
        :variant="action.variant"
        size="sm"
        :icon-name="action.iconName"
        icon-only
        :aria-label="action.tooltip"
        :title="action.tooltip"
        @click="emit('action', action.key)"
      />
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import type { DataTableAction, UiTone } from '~/constants/ui.constants'

export interface EntityCardDetail {
  label: string
  value: string | number | null | undefined
}

const props = withDefaults(defineProps<{
  eyebrow: string
  title: string
  status: string
  statusTone?: UiTone
  description?: string
  imageUrl?: string | null
  imageAlt?: string
  placeholderLabel?: string
  details: readonly EntityCardDetail[]
  actions: readonly DataTableAction[]
}>(), {
  statusTone: 'info',
  description: '',
  imageUrl: null,
  imageAlt: 'Entity image',
  placeholderLabel: 'Image unavailable',
})

const emit = defineEmits<{
  (event: 'action', actionKey: string): void
}>()

const getInitials = (value: string): string => {
  const words = value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)

  const firstInitial = words[0]?.[0] ?? '—'
  const secondInitial = words[1]?.[0] ?? ''

  return `${firstInitial}${secondInitial}`.toUpperCase()
}

const placeholderInitials = computed(() => getInitials(props.title || props.eyebrow))
</script>
