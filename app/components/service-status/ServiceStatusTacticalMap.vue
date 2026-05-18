<template>
  <BaseCard :class="SERVICE_STATUS_TACTICAL_CARD_CLASSES">

  </BaseCard>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import {
  SERVICE_STATUS_TACTICAL_CARD_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_BUTTON_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_LIST_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_TITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_HEADER_CLASSES,
  SERVICE_STATUS_TACTICAL_MAP_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_TITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_VALUE_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_VALUE_PRIMARY_CLASSES,
  SERVICE_STATUS_TACTICAL_SUBTITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_TITLE_CLASSES,
} from '~/constants/ui.constants'
import serviceStatusPinIcon from '~/assets/icons/service-status-pin.svg'
import { useGeoMap } from '~/composables/useGeoMap'
import { loadLeafletApi } from '~/utils/geo-map'
import type { PersonnelLocationItem } from '~/types/domain/personnel'


type LeafletMarker = {
  on: (eventName: string, callback: () => void) => void
  addTo: (map: LeafletMap) => LeafletMarker
  remove: () => void
}

type LeafletMap = {
  setView: (coords: [number, number], zoom: number) => unknown
  fitBounds: (bounds: [[number, number], [number, number]], options?: Record<string, unknown>) => unknown
  remove: () => unknown
}

type LeafletApi = {
  map: (element: HTMLDivElement) => LeafletMap
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: LeafletMap) => unknown }
  marker: (coords: [number, number], options: Record<string, unknown>) => LeafletMarker
  divIcon: (options: Record<string, unknown>) => unknown
  latLngBounds: (coords: [number, number][]) => { isValid: () => boolean; getSouthWest: () => { lat: number; lng: number }; getNorthEast: () => { lat: number; lng: number } }
}

const props = defineProps<{ items: PersonnelLocationItem[]; selectedPersonnelId: string | null }>()
const emit = defineEmits<{ (event: 'select', item: PersonnelLocationItem): void }>()

const mapElement = ref<HTMLDivElement | null>(null)
const mapInstance = ref<LeafletMap | null>(null)
const leafletApi = ref<LeafletApi | null>(null)
const mapLoadError = ref('')
const markerRecords = ref<Array<{ marker: LeafletMarker; items: PersonnelLocationItem[] }>>([])
const selectedClusterKey = ref<string | null>(null)
const { center: geoMapCenter, defaultZoom: geoMapDefaultZoom, maxZoom: geoMapMaxZoom } = useGeoMap()

const selectedItem = computed(() => props.items.find(item => item.personnelId === props.selectedPersonnelId) ?? null)

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

  return Array.from(groups.entries()).map(([id, items]) => {
    const sample = items[0]
    return {
      id,
      items,
      latitude: sample?.latitude ?? 0,
      longitude: sample?.longitude ?? 0,
    }
  })
})

const selectedClusterItems = computed(() => {
  if (!selectedClusterKey.value) {
    return []
  }
  const selectedGroup = groupedPins.value.find(group => group.id === selectedClusterKey.value)
  return selectedGroup?.items ?? []
})

const selectItem = (item: PersonnelLocationItem | null) => {
  if (!item) {
    return
  }
  emit('select', item)
}

const buildPinMarkup = (count: number) => {
  const badgeMarkup = count > 1
    ? '<span class="absolute -right-2 -top-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">' + count + '</span>'
    : ''

  return '<div class="relative">'
    + '<span class="block h-5 w-5 rounded-full border-2 border-white bg-emerald-500 shadow-lg"></span>'
    + badgeMarkup
    + '</div>'
}

const clearMarkers = () => {
  for (const record of markerRecords.value) {
    record.marker.remove()
  }
  markerRecords.value = []
}

const renderMarkers = () => {
  if (!leafletApi.value || !mapInstance.value) {
    return
  }

  clearMarkers()
  for (const group of groupedPins.value) {
    const icon = leafletApi.value.divIcon({
      className: 'service-status-leaflet-pin',
      html: buildPinMarkup(group.items.length),
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    const marker = leafletApi.value.marker([group.latitude, group.longitude], { icon })
    marker.addTo(mapInstance.value)
    marker.on('click', () => {
      selectedClusterKey.value = group.id
      selectItem(group.items[0] ?? null)
    })

    markerRecords.value.push({ marker, items: group.items })
  }
}
</script>
