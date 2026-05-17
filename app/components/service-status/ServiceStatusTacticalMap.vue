<template>
  <BaseCard class="p-4">
    <div :class="SERVICE_STATUS_TACTICAL_HEADER_CLASSES">
      <div>
        <h3 :class="SERVICE_STATUS_TACTICAL_TITLE_CLASSES">Tactical Map</h3>
        <p :class="SERVICE_STATUS_TACTICAL_SUBTITLE_CLASSES">Select pin or table row to view personnel details.</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import {
  SERVICE_STATUS_TACTICAL_CARD_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_BUTTON_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_LIST_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_TITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_GRID_CLASSES,
  SERVICE_STATUS_TACTICAL_HEADER_CLASSES,
  SERVICE_STATUS_TACTICAL_MAP_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_TITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_VALUE_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_VALUE_PRIMARY_CLASSES,
  SERVICE_STATUS_TACTICAL_PIN_BADGE_CLASSES,
  SERVICE_STATUS_TACTICAL_PIN_BUTTON_CLASSES,
  SERVICE_STATUS_TACTICAL_PIN_ICON_CLASSES,
  SERVICE_STATUS_TACTICAL_PIN_WRAPPER_CLASSES,
  SERVICE_STATUS_TACTICAL_SUBTITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_TITLE_CLASSES,
} from '~/constants/ui.constants'
import serviceStatusPinIcon from '~/assets/icons/service-status-pin.svg'
import type { PersonnelLocationItem } from '~/types/domain/personnel'

const props = defineProps<{ items: PersonnelLocationItem[]; selectedPersonnelId: string | null }>()
const emit = defineEmits<{ (event: 'select', item: PersonnelLocationItem): void }>()

const clusterSelection = ref<PersonnelLocationItem[]>([])

const groupedPins = computed(() => {
  const groups = new Map<string, PersonnelLocationItem[]>()

  for (const item of props.items) {
    if (item.latitude === null || item.longitude === null) {
      continue
    }

    const key = `${item.latitude.toFixed(5)}:${item.longitude.toFixed(5)}`
    const current = groups.get(key) ?? []
    current.push(item)
    groups.set(key, current)
  }

  return Array.from(groups.entries()).map(([key, items]) => {
    const latitude = items[0]?.latitude ?? 0
    const longitude = items[0]?.longitude ?? 0
    return {
      id: key,
      items,
      x: ((longitude + 180) / 360) * 100,
      y: ((90 - latitude) / 180) * 100,
    }
  })
})

const selectedItem = computed(() => props.items.find(item => item.personnelId === props.selectedPersonnelId) ?? null)

const onPinClick = (group: { items: PersonnelLocationItem[] }) => {
  if (group.items.length === 1) {
    selectItem(group.items[0] ?? null)
    return
  }

  clusterSelection.value = group.items
}

const selectItem = (item: PersonnelLocationItem | null) => {
  if (!item) {
    return
  }

  clusterSelection.value = []
  emit('select', item)
}
</script>
