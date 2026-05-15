import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useApplicationSettingsStore } from '~/stores/application-settings'
import { useGeoMapStore } from '~/stores/geomap'

export const useGeoMap = () => {
  const applicationSettingsStore = useApplicationSettingsStore()
  const geoMapStore = useGeoMapStore()
  const { item: settingsItem } = storeToRefs(applicationSettingsStore)
  const { center, defaultZoom, minZoom, maxZoom } = storeToRefs(geoMapStore)

  watch(
    settingsItem,
    (settings) => {
      geoMapStore.syncFromApplicationSettings(settings)
    },
    { immediate: true }
  )

  return {
    center,
    defaultZoom,
    minZoom,
    maxZoom,
  }
}
