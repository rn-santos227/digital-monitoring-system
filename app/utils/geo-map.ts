export type GeoMapMarker = {
  setLatLng: (coords: [number, number]) => void
  getLatLng: () => { lat: number; lng: number }
  on: (eventName: string, handler: () => void) => void
}

export type GeoMapInstance = {
  setView: (coords: [number, number], zoom: number) => unknown
  panTo: (coords: [number, number]) => unknown
  remove: () => unknown
}

export type GeoMapApi = {
  map: (element: HTMLDivElement) => GeoMapInstance
  tileLayer: (url: string, options: Record<string, unknown>) => { addTo: (map: GeoMapInstance) => unknown }
  marker: (
    coords: [number, number],
    options: Record<string, unknown>
  ) => { addTo: (map: GeoMapInstance) => GeoMapMarker }
}

const LEAFLET_STYLES_SELECTOR = 'link[data-leaflet-styles="true"]'
const LEAFLET_SCRIPT_SELECTOR = 'script[data-leaflet-script="true"]'

export const normalizeCoordinateValue = (value: number | null | undefined): number => (
  typeof value === 'number' ? value : Number.NaN
)

export const loadLeafletApi = async (): Promise<GeoMapApi | null> => {
  if (typeof window === 'undefined') {
    return null
  }

  const globalLeaflet = (window as typeof window & { L?: GeoMapApi }).L
  if (globalLeaflet) {
    return globalLeaflet
  }

  if (!document.querySelector(LEAFLET_STYLES_SELECTOR)) {
    const styleTag = document.createElement('link')
    styleTag.rel = 'stylesheet'
    styleTag.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    styleTag.setAttribute('data-leaflet-styles', 'true')
    document.head.appendChild(styleTag)
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(LEAFLET_SCRIPT_SELECTOR) as HTMLScriptElement | null

    if (existingScript) {
      if ((window as typeof window & { L?: GeoMapApi }).L) {
        resolve()
        return
      }

      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Leaflet script failed to load.')), {
        once: true,
      })
      return
    }

    const scriptTag = document.createElement('script')
    scriptTag.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    scriptTag.async = true
    scriptTag.setAttribute('data-leaflet-script', 'true')
    scriptTag.addEventListener('load', () => resolve(), { once: true })
    scriptTag.addEventListener('error', () => reject(new Error('Leaflet script failed to load.')), {
      once: true,
    })
    document.body.appendChild(scriptTag)
  })

  return (window as typeof window & { L?: GeoMapApi }).L ?? null
}
