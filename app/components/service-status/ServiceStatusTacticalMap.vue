<template>
  <BaseCard :class="SERVICE_STATUS_TACTICAL_CARD_CLASSES">
    <div :class="SERVICE_STATUS_TACTICAL_HEADER_CLASSES">
      <div>
        <h3 :class="SERVICE_STATUS_TACTICAL_TITLE_CLASSES">Tactical Map</h3>
        <p :class="SERVICE_STATUS_TACTICAL_SUBTITLE_CLASSES">Select pin or table row to view personnel details.</p>
      </div>
    </div>
    <div :class="SERVICE_STATUS_TACTICAL_MAP_CLASSES">
      <svg :class="SERVICE_STATUS_TACTICAL_GRID_CLASSES" viewBox="0 0 1000 650" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="1000" height="650" fill="#0f172a" />
        <rect width="1000" height="650" fill="url(#grid)" />
      </svg>

      <button
        v-for="group in groupedPins"
        :key="group.id"
        :class="SERVICE_STATUS_TACTICAL_PIN_BUTTON_CLASSES"
        :style="{ left: `${group.x}%`, top: `${group.y}%` }"
        @click="onPinClick(group)"
      >
        <span :class="SERVICE_STATUS_TACTICAL_PIN_WRAPPER_CLASSES">
          <img :src="serviceStatusPinIcon" alt="Personnel map pin" :class="SERVICE_STATUS_TACTICAL_PIN_ICON_CLASSES">
          <span
            v-if="group.items.length > 1"
            :class="SERVICE_STATUS_TACTICAL_PIN_BADGE_CLASSES"
          >{{ group.items.length }}</span>
        </span>
      </button>

      <aside
        v-if="selectedItem"
        :class="SERVICE_STATUS_TACTICAL_PANEL_CLASSES"
      >
        <h4 :class="SERVICE_STATUS_TACTICAL_PANEL_TITLE_CLASSES">Personnel Snapshot</h4>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES">Personnel</p>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_VALUE_PRIMARY_CLASSES">{{ selectedItem.personnelName ?? 'Unnamed Personnel' }}</p>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES">Operation</p>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_VALUE_CLASSES">{{ selectedItem.operationName ?? 'Unspecified' }}</p>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES">Deployment Area</p>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_VALUE_CLASSES">{{ selectedItem.deploymentArea }}</p>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES">Coordinates</p>
        <p :class="SERVICE_STATUS_TACTICAL_PANEL_VALUE_CLASSES">{{ selectedItem.latitude }}, {{ selectedItem.longitude }}</p>
      </aside>

      <div
        v-if="clusterSelection.length > 0"
        :class="SERVICE_STATUS_TACTICAL_CLUSTER_CLASSES"
      >
        <p :class="SERVICE_STATUS_TACTICAL_CLUSTER_TITLE_CLASSES">Overlapping Coordinates</p>
        <ul :class="SERVICE_STATUS_TACTICAL_CLUSTER_LIST_CLASSES">
          <li v-for="option in clusterSelection" :key="option.personnelId">
            <button :class="SERVICE_STATUS_TACTICAL_CLUSTER_BUTTON_CLASSES" @click="selectItem(option)">
              {{ option.personnelName ?? 'Unnamed Personnel' }} · {{ option.operationName ?? 'Unspecified' }}
            </button>
          </li>
        </ul>
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
