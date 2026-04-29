<template>
  <div :class="BASE_GEO_MAP_CONTAINER_CLASSES">
    <div :class="BASE_GEO_MAP_HEADER_CLASSES">
      <div>
        <p :class="BASE_GEO_MAP_TITLE_CLASSES">{{ title }}</p>
        <p :class="BASE_GEO_MAP_SUBTITLE_CLASSES">{{ subtitleText }}</p>
      </div>
      <a
        :href="mapLink"
        target="_blank"
        rel="noopener noreferrer"
        :class="BASE_GEO_MAP_LINK_CLASSES"
      >
        Open in Google Maps
      </a>
    </div>
    <div :class="BASE_GEO_MAP_FRAME_WRAPPER_CLASSES">
      <div ref="mapElement" :class="BASE_GEO_MAP_FRAME_CLASSES" />
      <div v-if="mapLoadError" :class="BASE_GEO_MAP_EMPTY_STATE_CLASSES">{{ mapLoadError }}</div>
    </div>
    <div :class="BASE_GEO_MAP_META_WRAPPER_CLASSES">
      <p>
        Longitude: <span :class="BASE_GEO_MAP_META_VALUE_CLASSES">{{ activeCenter.longitude.toFixed(6) }}</span>
        · Latitude: <span :class="BASE_GEO_MAP_META_VALUE_CLASSES">{{ activeCenter.latitude.toFixed(6) }}</span>
      </p>
      <p v-if="isInputMode" class="text-emerald-700">Drag the map pin to update coordinates.</p>
      <p v-else class="text-slate-500">Read-only tactical map preview.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  BASE_GEO_MAP_CONTAINER_CLASSES,
  BASE_GEO_MAP_EMPTY_STATE_CLASSES,
  BASE_GEO_MAP_FRAME_CLASSES,
  BASE_GEO_MAP_FRAME_WRAPPER_CLASSES,
  BASE_GEO_MAP_HEADER_CLASSES,
  BASE_GEO_MAP_LINK_CLASSES,
  BASE_GEO_MAP_META_VALUE_CLASSES,
  BASE_GEO_MAP_META_WRAPPER_CLASSES,
  BASE_GEO_MAP_SUBTITLE_CLASSES,
  BASE_GEO_MAP_TITLE_CLASSES,
  type BaseGeoMapPin,
} from '~/constants/ui.constants'
import {
  loadLeafletApi,
  normalizeCoordinateValue,
  type GeoMapApi,
  type GeoMapInstance,
  type GeoMapMarker,
} from '~/utils/geo-map'

type LeafletMarker = {
  setLatLng: (coords: [number, number]) => void
  getLatLng: () => { lat: number; lng: number }
  on: (eventName: string, handler: () => void) => void
}

type LeafletMap = {
  setView: (coords: [number, number], zoom: number) => unknown
  panTo: (coords: [number, number]) => unknown
  remove: () => unknown
}

type LeafletApi = {
  map: (element: HTMLDivElement) => LeafletMap
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: LeafletMap) => unknown }
  marker: (
    coords: [number, number],
    options: Record<string, unknown>
  ) => { addTo: (map: LeafletMap) => LeafletMarker }
}

const props = withDefaults(
  defineProps<{
    latitude?: number | null
    longitude?: number | null
    title?: string
    subtitle?: string
    pins?: BaseGeoMapPin[]
    mode?: 'readonly' | 'input'
    isInteractive?: boolean
  }>(),
  {
    latitude: null,
    longitude: null,
    title: 'Geospatial map',
    subtitle: '',
    pins: () => [],
    mode: 'readonly',
    isInteractive: false,
  }
)

const emit = defineEmits<{
  (event: 'update:latitude', value: number): void
  (event: 'update:longitude', value: number): void
}>()

const isInputMode = computed(() => props.mode === 'input' || props.isInteractive)

const mapElement = ref<HTMLDivElement | null>(null)
const mapLoadError = ref('')
const map = ref<LeafletMap | null>(null)
const marker = ref<LeafletMarker | null>(null)
const leafletApi = ref<LeafletApi | null>(null)

const activeCenter = computed(() => {
  const latitude = normalizeCoordinateValue(props.latitude)
  const longitude = normalizeCoordinateValue(props.longitude)

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude }
  }

  const firstPin = props.pins[0] ?? null
  if (firstPin && Number.isFinite(firstPin.latitude) && Number.isFinite(firstPin.longitude)) {
    return {
      latitude: firstPin.latitude,
      longitude: firstPin.longitude,
    }
  }

  return {
    latitude: 14.5886,
    longitude: 120.9742,
  }
})

const subtitleText = computed(
  () => props.subtitle || 'Centered on AFP General Headquarters, Camp Aguinaldo (Philippines).'
)

const mapLink = computed(
  () => `https://www.google.com/maps?q=${activeCenter.value.latitude},${activeCenter.value.longitude}`
)

const initializeMap = async () => {
  if (!mapElement.value || map.value) {
    return
  }
  try {
    leafletApi.value = await loadLeafletApi()
    if (!leafletApi.value) {
      throw new Error('Leaflet not available.')
    }

    map.value = leafletApi.value.map(mapElement.value)
    map.value.setView([activeCenter.value.latitude, activeCenter.value.longitude], 14)

    leafletApi.value
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      })
      .addTo(map.value)

    marker.value = leafletApi.value
      .marker([activeCenter.value.latitude, activeCenter.value.longitude], {
        draggable: isInputMode.value,
      })
      .addTo(map.value)

    marker.value.on('dragend', () => {
      if (!isInputMode.value || !marker.value) {
        return
      }

      const nextPoint = marker.value.getLatLng()
      emit('update:latitude', Number(nextPoint.lat.toFixed(6)))
      emit('update:longitude', Number(nextPoint.lng.toFixed(6)))
    })
  } catch {
    mapLoadError.value = 'Unable to load interactive map at the moment.'
  }
}

watch(
  () => [props.latitude, props.longitude] as const,
  ([latitude, longitude]) => {
    if (!marker.value || !map.value) {
      return
    }
    const normalizedLatitude = normalizeCoordinateValue(latitude)
    const normalizedLongitude = normalizeCoordinateValue(longitude)

    if (!Number.isFinite(normalizedLatitude) || !Number.isFinite(normalizedLongitude)) {
      return
    }

    marker.value.setLatLng([normalizedLatitude, normalizedLongitude])
    map.value.panTo([normalizedLatitude, normalizedLongitude])
  }
)

onMounted(() => {
  initializeMap()
})

onBeforeUnmount(() => {
  map.value?.remove()
  map.value = null
})
</script>
