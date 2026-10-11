<template>
  <BaseCard v-for="group in DASHBOARD_DISPLAY_GROUPS" :key="group.key" :title="group.label">
    <div :class="DASHBOARD_DISPLAY_OPTIONS_CLASSES">
      <BaseCheckbox
        v-for="option in group.options"
        :key="option.key"
        :model-value="modelValue[group.key].some((key) => key === option.key)"
        :label="option.label"
        :disabled="disabled || !isOptionAllowed(group, option.key)"
        @update:model-value="onSelectionChange(group.key, option.key, $event)"
      />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import {
  DASHBOARD_DISPLAY_GROUPS,
  DASHBOARD_WIDGET_OPTIONS,
  DASHBOARD_WIDGET_PERMISSIONS,
} from '~/constants/page.constants'
import { DASHBOARD_DISPLAY_OPTIONS_CLASSES } from '~/constants/shared.constants'
import type { DashboardDisplayGroup } from '~/constants/ui.constants'
import type {
  DashboardDisplaySettings,
  DashboardWidgetId,
} from '~/types/domain/dashboard'
import { useAuthStore } from '~/stores/auth'
import {
  normalizeDashboardDisplay,
  toggleDashboardSelection,
} from '~/utils/dashboard-display'

const props = withDefaults(defineProps<{
  modelValue: DashboardDisplaySettings
  disabled?: boolean
}>(), { disabled: false })
const emit = defineEmits<{
  (event: 'update:modelValue', value: DashboardDisplaySettings): void
}>()
const authStore = useAuthStore()

const isOptionAllowed = (
  group: DashboardDisplayGroup<keyof DashboardDisplaySettings, DashboardWidgetId>,
  optionKey: string,
): boolean => {
  const widget = group.widget
    ?? DASHBOARD_WIDGET_OPTIONS.find((item) => item.key === optionKey)?.key
  return widget ? authStore.hasPermissionAccess(DASHBOARD_WIDGET_PERMISSIONS[widget]) : false
}
const onSelectionChange = (
  groupKey: keyof DashboardDisplaySettings,
  key: string,
  selected: boolean,
) => {
  const group = DASHBOARD_DISPLAY_GROUPS.find((item) => item.key === groupKey)
  if (!group || props.disabled || !isOptionAllowed(group, key)) return
  emit('update:modelValue', normalizeDashboardDisplay({
    ...props.modelValue,
    [groupKey]: toggleDashboardSelection<string>(props.modelValue[groupKey], key, selected),
  }))
}
</script>
