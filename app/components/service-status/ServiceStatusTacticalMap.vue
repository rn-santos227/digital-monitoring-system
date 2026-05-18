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

</script>
