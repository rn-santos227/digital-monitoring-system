<template>
  <BaseCard>
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="clock" class="text-slate-600" />
      <h3 class="text-2xl font-semibold text-slate-900">{{ DASHBOARD_OPERATIONAL_SUMMARY_TITLE }}</h3>
    </header>

    <div :class="DASHBOARD_VALUE_GRID_CLASSES">
      <article v-for="item in values" :key="item.key" :class="DASHBOARD_VALUE_CARD_CLASSES">
        <p :class="DASHBOARD_VALUE_LABEL_CLASSES">{{ item.label }}</p>
        <p :class="DASHBOARD_VALUE_NUMBER_CLASSES">{{ item.value }}</p>
      </article>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { computed } from 'vue'
import type {
  DashboardOperationalTimeMonitoring,
  DashboardOperationalValueId,
} from '~/types/domain/dashboard'
import {
  DASHBOARD_OPERATIONAL_VALUE_OPTIONS,
  DASHBOARD_OPERATIONAL_SUMMARY_TITLE,
} from '~/constants/page.constants'
import {
  DASHBOARD_VALUE_GRID_CLASSES,
  DASHBOARD_VALUE_CARD_CLASSES,
  DASHBOARD_VALUE_LABEL_CLASSES,
  DASHBOARD_VALUE_NUMBER_CLASSES,
} from '~/constants/shared.constants'

const props = withDefaults(defineProps<{
  data: DashboardOperationalTimeMonitoring
  selectedValues?: readonly DashboardOperationalValueId[]
}>(), { selectedValues: () => DASHBOARD_OPERATIONAL_VALUE_OPTIONS.map((item) => item.key) })
const values = computed(() => DASHBOARD_OPERATIONAL_VALUE_OPTIONS
  .filter((item) => props.selectedValues.includes(item.key))
  .map((item) => ({ ...item, value: props.data.metric[item.key] })),
)
</script>
