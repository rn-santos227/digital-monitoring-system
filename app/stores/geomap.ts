import { defineStore } from 'pinia'
import type { ApplicationSettingsItem } from '~/types/domain/application-settings'
import type { GeoMapState } from '~/types/domain/geomap'
import { resolveGeoMapSettings } from '~/utils/geomap-settings'
import {
  DEFAULT_MAP_LATITUDE,
  DEFAULT_MAP_LONGITUDE,
  DEFAULT_MAP_MAX_ZOOM,
  DEFAULT_MAP_MIN_ZOOM,
  DEFAULT_MAP_ZOOM,
} from '~/constants/settings.constants'

const INITIAL_GEOMAP_STATE: GeoMapState = {
  defaultLatitude: DEFAULT_MAP_LATITUDE,
  defaultLongitude: DEFAULT_MAP_LONGITUDE,
  defaultZoom: DEFAULT_MAP_ZOOM,
  minZoom: DEFAULT_MAP_MIN_ZOOM,
  maxZoom: DEFAULT_MAP_MAX_ZOOM,
}

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

      Object.assign(this, resolveGeoMapSettings(settings))
    },
  },
}

export const useGeoMapStore = defineStore('geomap', geomapStoreOptions)
