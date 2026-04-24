<template>
  <BaseCard :title="title" :subtitle="subtitle">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <div v-if="isLoading" class="space-y-2" aria-busy="true" aria-live="polite">
          <div class="h-9 w-24 animate-pulse rounded bg-slate-200" />
          <div class="h-4 w-40 animate-pulse rounded bg-slate-100" />
        </div>
        <div v-else class="space-y-1">
          <p :class="DASHBOARD_METRIC_VALUE_CLASSES">{{ displayValue }}</p>
          <p
            v-if="displayContext"
            :class="[
              DASHBOARD_METRIC_CHANGE_CLASSES,
              hasError ? 'text-amber-600' : toneStyles.context,
            ]"
          >
            {{ displayContext }}
          </p>
        </div>
      </div>

      <div :class="['shrink-0 rounded-xl p-2', toneStyles.iconWrapper]">
        <div v-if="isLoading" class="h-6 w-6 animate-pulse rounded bg-slate-200" />
        <BaseIcon v-else :name="iconName" size="lg" :class="toneStyles.icon" />
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { IconName } from '~/types/domain/misc'
import { KPI_TONE_STYLES, type KpiTone } from '~/constants/ui.constants'
import {
  DASHBOARD_METRIC_CHANGE_CLASSES,
  DASHBOARD_METRIC_VALUE_CLASSES,
} from '~/constants/page.constants'

export type KpiCardLoaderResult = {
  value: number | string
  context?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    loader: () => Promise<KpiCardLoaderResult>
    iconName?: IconName
    tone?: KpiTone
    fallbackValue?: string
    fallbackContext?: string
  }>(),
  {
    subtitle: '',
    iconName: 'squares',
    tone: 'emerald',
    fallbackValue: '—',
    fallbackContext: 'Unable to load metric.',
  },
)

const toneStyles = computed(() => KPI_TONE_STYLES[props.tone])
const isLoading = ref(true)
const hasError = ref(false)
const displayValue = ref(props.fallbackValue)
const displayContext = ref('')

const loadValue = async (): Promise<void> => {
  isLoading.value = true
  hasError.value = false

  try {
    const result = await props.loader()
    displayValue.value = typeof result.value === 'number'
      ? new Intl.NumberFormat('en-US').format(result.value)
      : result.value
    displayContext.value = result.context ?? ''
  } catch {
    hasError.value = true
    displayValue.value = props.fallbackValue
    displayContext.value = props.fallbackContext
  } finally {
    isLoading.value = false
  }
}

watch(() => props.loader, async () => {
  await loadValue()
}, { immediate: true })
</script>
