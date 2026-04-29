<template>
  <div :class="BASE_GEO_MAP_CONTAINER_CLASSES">
    <div :class="BASE_GEO_MAP_HEADER_CLASSES">
      <div>
        <p :class="BASE_GEO_MAP_TITLE_CLASSES">{{ title }}</p>
        <p :class="BASE_GEO_MAP_SUBTITLE_CLASSES">{{ subtitleText }}</p>
      </div>
      <a
        v-if="activeCenter"
        :href="mapLink"
        target="_blank"
        rel="noopener noreferrer"
        :class="BASE_GEO_MAP_LINK_CLASSES"
      >
        Open in Google Maps
      </a>
    </div>

    <div :class="BASE_GEO_MAP_FRAME_WRAPPER_CLASSES">
      <iframe
        v-if="activeCenter"
        :src="embedMapLink"
        :class="BASE_GEO_MAP_FRAME_CLASSES"
        title="Google map"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
      <div
        v-else
        :class="BASE_GEO_MAP_EMPTY_STATE_CLASSES"
      >
        Provide valid longitude and latitude to load the Google Map.
      </div>
    </div>

    <div :class="BASE_GEO_MAP_META_WRAPPER_CLASSES">
      <p v-if="activeCenter">
        Longitude: <span :class="BASE_GEO_MAP_META_VALUE_CLASSES">{{ activeCenter.longitude.toFixed(6) }}</span>
        · Latitude: <span :class="BASE_GEO_MAP_META_VALUE_CLASSES">{{ activeCenter.latitude.toFixed(6) }}</span>
      </p>
      <p v-if="normalizedPins.length > 0">
        Tactical deployments pinned: <span :class="BASE_GEO_MAP_META_COUNT_CLASSES">{{ normalizedPins.length }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  BASE_GEO_MAP_CONTAINER_CLASSES,
  BASE_GEO_MAP_EMPTY_STATE_CLASSES,
  BASE_GEO_MAP_FRAME_CLASSES,
  BASE_GEO_MAP_FRAME_WRAPPER_CLASSES,
  BASE_GEO_MAP_HEADER_CLASSES,
  BASE_GEO_MAP_LINK_CLASSES,
  BASE_GEO_MAP_META_COUNT_CLASSES,
  BASE_GEO_MAP_META_VALUE_CLASSES,
  BASE_GEO_MAP_META_WRAPPER_CLASSES,
  BASE_GEO_MAP_SUBTITLE_CLASSES,
  BASE_GEO_MAP_TITLE_CLASSES,
  type BaseGeoMapPin
} from '~/constants/ui.constants'

const AFP_HEADQUARTERS_COORDINATES = Object.freeze({
  latitude: 14.5886,
  longitude: 120.9742,
  label: 'AFP General Headquarters, Camp Aguinaldo'
})

const props = withDefaults(
  defineProps<{
    latitude?: number | null
    longitude?: number | null
    title?: string
    subtitle?: string
    pins?: BaseGeoMapPin[]
  }>(),
  {
    latitude: null,
    longitude: null,
    title: 'Geospatial map',
    subtitle: '',
    pins: () => []
  }
)

const normalizedPins = computed(() =>
  props.pins.filter(
    (pin) =>
      Number.isFinite(pin.latitude)
      && Number.isFinite(pin.longitude)
      && pin.latitude >= -90
      && pin.latitude <= 90
      && pin.longitude >= -180
      && pin.longitude <= 180
  )
)

const activeCenter = computed<BaseGeoMapPin | null>(() => {
  const latitude = props.latitude
  const longitude = props.longitude

  if (
    latitude !== null
    && latitude !== undefined
    && longitude !== null
    && longitude !== undefined
    && Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180
  ) {
    return {
      latitude,
      longitude,
      label: 'Current location'
    }
  }

  const firstPin = normalizedPins.value[0] ?? null

  if (!firstPin) {
    return AFP_HEADQUARTERS_COORDINATES
  }

  return {
    latitude: firstPin.latitude,
    longitude: firstPin.longitude,
    label: firstPin.label ?? 'Deployment location'
  }
})

const subtitleText = computed(() => {
  if (props.subtitle) {
    return props.subtitle
  }

  if (normalizedPins.value.length > 0) {
    return `Showing ${normalizedPins.value.length} deployment pin(s).`
  }

  return 'Centered on AFP General Headquarters, Camp Aguinaldo (Philippines).'
})

const mapLink = computed(() => {
  if (!activeCenter.value) {
    return '#'
  }

  const { latitude, longitude } = activeCenter.value
  return `https://www.google.com/maps?q=${latitude},${longitude}`
})

const embedMapLink = computed(() => {
  if (!activeCenter.value) {
    return ''
  }

  const primaryPin = normalizedPins.value[0] ?? activeCenter.value
  const markerLabel = primaryPin.label ?? 'Deployment Pin'
  const markerQuery = `${primaryPin.latitude},${primaryPin.longitude} (${markerLabel})`

  return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(markerQuery)}`
})
</script>
