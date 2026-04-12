import { createPinia, setActivePinia } from 'pinia'
import { effectScope, nextTick, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCharts } from '@/app/composables/useCharts'
import { useApplicationSettings } from '@/app/composables/useApplicationSettings'
import { useGeoMap } from '@/app/composables/useGeoMap'
import { useApplicationSettingsStore } from '@/app/stores/application-settings'
import { useAuthStore } from '@/app/stores/auth'
import { settingsFixture } from '@/tests/helpers/settings-fixture'

beforeEach(() => setActivePinia(createPinia()))

describe('reactive chart data', () => {
  it('handles an empty dataset without division by zero', () => {
    const charts = useCharts([])
    expect(charts.totalValue.value).toBe(0)
    expect(charts.highestValue.value).toBe(0)
    expect(charts.getPercentage(1)).toBe(0)
    expect(charts.getBarWidth(1)).toBe('0%')
    expect(charts.donutChartOption.value.series).toEqual([
      expect.objectContaining({ data: [] }),
    ])
  })

  it('updates totals, labels, and each series when the dataset changes', () => {
    const data = ref([
      { label: 'Active', value: 75, color: '#123456' },
      { label: 'Inactive', value: 25 },
    ])
    const charts = useCharts(data)
    expect(charts.totalValue.value).toBe(100)
    expect(charts.highestValue.value).toBe(75)
    expect(charts.getPercentage(25)).toBe(25)
    expect(charts.getBarWidth(75)).toBe('100%')
    expect(charts.getBarWidth(1)).toBe('4%')
    expect(charts.barChartOption.value.yAxis).toMatchObject({
      data: ['Active', 'Inactive'],
    })
    expect(charts.barChartOption.value.series).toEqual([
      expect.objectContaining({
        data: [
          expect.objectContaining({ value: 75 }),
          expect.objectContaining({ value: 25 }),
        ],
      }),
    ])
    expect(charts.donutChartOption.value.series).toEqual([
      expect.objectContaining({
        data: [
          { name: 'Active', value: 75 },
          { name: 'Inactive', value: 25 },
        ],
      }),
    ])
    data.value = [{ label: 'New', value: 3 }]
    expect(charts.totalValue.value).toBe(3)
    expect(charts.lineChartOption.value.xAxis).toMatchObject({ data: ['New'] })
    expect(charts.lineChartOption.value.series).toEqual([
      expect.objectContaining({ data: [3] }),
    ])
  })
})

describe('application settings form and map synchronization', () => {
  it('copies loaded settings, normalizes the form payload, and forwards updates', async () => {
    const scope = effectScope()
    const settings = useApplicationSettingsStore()
    const auth = useAuthStore()
    vi.spyOn(auth, 'hasPermissionAccess').mockReturnValue(true)
    settings.item = { ...settingsFixture }
    const update = vi.spyOn(settings, 'update').mockResolvedValue(undefined)
    const controller = scope.run(useApplicationSettings)
    if (!controller) throw new Error('Missing settings controller')
    expect(controller.canUpdate.value).toBe(true)
    expect(controller.form.pageSize).toBe('10')
    controller.form.appName = '  New name  '
    controller.form.appDescription = ' '
    controller.form.pageSize = '20'
    controller.form.mapDefaultLatitude = '15.5'
    const payload = controller.toUpdatePayload()
    expect(payload).toMatchObject({
      appName: 'New name',
      appDescription: null,
      pageSize: 20,
      mapDefaultLatitude: 15.5,
    })
    await controller.updateApplicationSettings(payload)
    expect(update).toHaveBeenCalledExactlyOnceWith(payload)
    settings.item = {
      ...settingsFixture,
      appName: 'Changed externally',
      pageSize: 30,
    }
    await nextTick()
    expect(controller.form.appName).toBe('Changed externally')
    expect(controller.form.pageSize).toBe('30')
    expect(controller.themeOptions).toContainEqual({
      value: 'emerald',
      label: 'Emerald',
    })
    expect(controller.pageSizeOptions).toContainEqual({
      value: '10',
      label: '10',
    })
    scope.stop()
  })

  it('uses defaults before settings arrive and reacts to new map coordinates', async () => {
    const scope = effectScope()
    const settings = useApplicationSettingsStore()
    const map = scope.run(useGeoMap)
    if (!map) throw new Error('Missing map controller')
    expect(map.center.value).toEqual(
      expect.objectContaining({
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      }),
    )
    settings.item = {
      ...settingsFixture,
      mapDefaultLatitude: 15,
      mapDefaultLongitude: 122,
      mapDefaultZoom: 11,
    }
    await nextTick()
    expect(map.center.value).toEqual({ latitude: 15, longitude: 122 })
    expect(map.defaultZoom.value).toBe(11)
    expect(map.minZoom.value).toBe(1)
    expect(map.maxZoom.value).toBe(22)
    scope.stop()
  })
})
