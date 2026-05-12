import type { ApplicationSettingsItem } from '~/types/domain/application-settings'
import type { GeoMapState } from '~/types/domain/geomap'

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

export const resolveGeoMapSettings = (settings: ApplicationSettingsItem): Partial<GeoMapState> => {
  const latitude = Number(settings.mapDefaultLatitude)
  const longitude = Number(settings.mapDefaultLongitude)
  const minZoom = clamp(Number(settings.mapMinZoom), 1, 22)
  const maxZoom = clamp(Number(settings.mapMaxZoom), minZoom, 22)
  const defaultZoom = clamp(Number(settings.mapDefaultZoom), minZoom, maxZoom)

  return {
    ...(Number.isFinite(latitude) ? { defaultLatitude: latitude } : {}),
    ...(Number.isFinite(longitude) ? { defaultLongitude: longitude } : {}),
    minZoom,
    maxZoom,
    defaultZoom,
  }
}
