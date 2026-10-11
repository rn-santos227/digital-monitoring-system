import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useIncidentsStore } from '@/app/stores/incidents'
import type { CreateEquipmentIncidentPayload } from '@/app/types/domain/incident'

beforeEach(() => setActivePinia(createPinia()))
afterEach(() => vi.unstubAllGlobals())

describe('incident create and KPI loading state', () => {
  const payload: CreateEquipmentIncidentPayload = {
    incidentNo: 'INC-1',
    equipmentAssetId: 'asset',
    incidentTypeId: 'Damage',
    incidentDate: '2026-10-04',
    description: 'Damaged equipment',
  }

  it('shows the create spinner only for the duration of the create request', async () => {
    let complete: ((value: unknown) => void) | undefined
    vi.stubGlobal(
      '$fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            complete = resolve
          }),
      ),
    )
    const store = useIncidentsStore()
    store.createError = 'Previous failure'
    const pending = store.createEquipmentIncident(payload)
    expect(store.isCreating).toBe(true)
    expect(store.createError).toBe('')
    complete?.({
      ok: true,
      id: 'incident',
      item: { id: 'incident', incidentNo: 'INC-1' },
    })
    await pending
    expect(store.isCreating).toBe(false)
    expect(store.items[0]?.id).toBe('incident')
  })

  it('releases create busy state after rejection and preserves failure feedback', async () => {
    const error = Object.assign(new Error('Create rejected'), {
      statusMessage: 'Create rejected',
    })
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue(error))
    const store = useIncidentsStore()
    await expect(store.createEquipmentIncident(payload)).rejects.toBe(error)
    expect(store.isCreating).toBe(false)
    expect(store.createError).toBe('Create rejected')
  })

  it('loads KPI counts once without disturbing create form state', async () => {
    const fetch = vi.fn().mockResolvedValue({
      totalIncidents: 3,
      unresolvedIncidents: 2,
      incidentsThisMonth: 1,
    })
    vi.stubGlobal('$fetch', fetch)
    const store = useIncidentsStore()
    store.createError = 'Existing create error'
    await store.fetchEquipmentIncidentKpisOnce()
    await store.fetchEquipmentIncidentKpisOnce()
    expect(fetch).toHaveBeenCalledOnce()
    expect(store.isCreating).toBe(false)
    expect(store.createError).toBe('Existing create error')
    expect(store.kpis.totalIncidents).toBe(3)
  })
})
