import { defineStore } from 'pinia'
import type { ApplicationSettingsItem } from '~/types/domain/application-settings'
import {
  DEFAULT_MAP_LATITUDE,
  DEFAULT_MAP_LONGITUDE,
  DEFAULT_MAP_MAX_ZOOM,
  DEFAULT_MAP_MIN_ZOOM,
  DEFAULT_MAP_ZOOM,
} from '~/constants/settings.constants'

interface GeoMapState {
  defaultLatitude: number
  defaultLongitude: number
  defaultZoom: number
  minZoom: number
  maxZoom: number
}

const INITIAL_GEOMAP_STATE: GeoMapState = {
  defaultLatitude: DEFAULT_MAP_LATITUDE,
  defaultLongitude: DEFAULT_MAP_LONGITUDE,
  defaultZoom: DEFAULT_MAP_ZOOM,
  minZoom: DEFAULT_MAP_MIN_ZOOM,
  maxZoom: DEFAULT_MAP_MAX_ZOOM,
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const geomapStoreOptions = {
  state: (): GeoMapState => ({ ...INITIAL_GEOMAP_STATE }),

  getters: {
    center: (state: GeoMapState) => ({
      latitude: state.defaultLatitude,
      longitude: state.defaultLongitude,
    }),
  },

  actions: {
    syncFromApplicationSettings(this: GeoMapState, settings: ApplicationSettingsItem | null) {
      if (!settings) {
        return
      }

      const latitude = Number(settings.mapDefaultLatitude)
      const longitude = Number(settings.mapDefaultLongitude)
      const minZoom = clamp(Number(settings.mapMinZoom), 1, 22)
      const maxZoom = clamp(Number(settings.mapMaxZoom), minZoom, 22)
      const defaultZoom = clamp(Number(settings.mapDefaultZoom), minZoom, maxZoom)

      if (Number.isFinite(latitude)) this.defaultLatitude = latitude
      if (Number.isFinite(longitude)) this.defaultLongitude = longitude
      this.minZoom = minZoom
      this.maxZoom = maxZoom
      this.defaultZoom = defaultZoom
    },
  },
}

export const useGeoMapStore = defineStore('geomap', geomapStoreOptions)
