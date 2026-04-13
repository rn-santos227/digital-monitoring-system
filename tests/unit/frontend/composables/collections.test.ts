// @vitest-environment happy-dom
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h, type Ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

interface Page {
  filters: Ref<Record<string, unknown>>
  tableRows: Readonly<Ref<Record<string, unknown>[]>>
  pagination: Readonly<
    Ref<{ page: number; pageSize: number; totalItems: number }>
  >
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string>>
  hasActiveFilters?: Readonly<Ref<boolean>>
  [key: string]: unknown
}
type Loader = (
  page?: number,
  filters?: Record<string, unknown>,
  pageSize?: number,
) => Promise<void>
const modules = import.meta.glob<Record<string, () => Page>>(
  '/app/composables/use*.ts',
)

interface CollectionContract {
  name: string
  load: string
  path: string
  row: Record<string, unknown>
  display?: Record<string, unknown>
}
const contracts: CollectionContract[] = [
  {
    name: 'Battalions',
    load: 'Battalions',
    path: '/api/battalions',
    row: {
      id: 'record',
      code: 'B1',
      name: 'First Battalion',
      isActive: false,
      companyCount: 2,
    },
    display: { status: 'Inactive', companyCount: 2 },
  },
  {
    name: 'Companies',
    load: 'Companies',
    path: '/api/companies',
    row: {
      id: 'record',
      code: 'C1',
      name: 'First Company',
      isActive: true,
      battalionName: null,
      battalionCode: 'B1',
    },
    display: { status: 'Active', battalion: 'B1' },
  },
  {
    name: 'Personnel',
    load: 'Personnel',
    path: '/api/personnel',
    row: {
      id: 'record',
      fullName: 'Unit User',
      personnelCode: 'AFP1',
      companyName: 'Company',
      battalionName: 'Battalion',
    },
    display: { assignment: 'Company / Battalion', profileImageUrl: null },
  },
  {
    name: 'Trainings',
    load: 'Trainings',
    path: '/api/trainings',
    row: {
      id: 'record',
      trainingTitle: 'First Aid',
      trainingCategoryId: null,
      trainingCategoryName: null,
    },
    display: { trainingTitle: 'First Aid', trainingCategoryId: null },
  },
  {
    name: 'TrainingCategories',
    load: 'TrainingCategories',
    path: '/api/training-categories',
    row: { id: 'record', code: 'MED', name: 'Medical', updatedAt: 'updated' },
    display: { name: 'Medical', updatedAt: 'updated' },
  },
  {
    name: 'TrainingRecords',
    load: 'TrainingRecords',
    path: '/api/training-records',
    row: { id: 'record', recordNo: 'TR1', trainingTitle: 'First Aid' },
    display: { recordNo: 'TR1' },
  },
  {
    name: 'Deployments',
    load: 'Deployments',
    path: '/api/deployments',
    row: {
      id: 'record',
      operationName: 'Mission',
      deploymentArea: 'Manila',
      statusName: 'Active',
      deploymentAreaLatitude: 0,
    },
    display: { operationName: 'Mission', deploymentAreaLatitude: 0 },
  },
  {
    name: 'DeploymentRecords',
    load: 'DeploymentRecords',
    path: '/api/deployment-records',
    row: { id: 'record', operationName: 'Mission', deploymentArea: 'Manila' },
    display: { operationName: 'Mission' },
  },
  {
    name: 'Engagements',
    load: 'Engagements',
    path: '/api/engagements',
    row: {
      id: 'record',
      engagementTitle: 'Community Event',
      engagementCategoryName: 'Community',
    },
    display: { engagementTitle: 'Community Event' },
  },
  {
    name: 'EngagementRecords',
    load: 'EngagementRecords',
    path: '/api/engagement-records',
    row: { id: 'record', recordNo: 'ER1', engagementTitle: 'Community Event' },
    display: { recordNo: 'ER1' },
  },
  {
    name: 'EquipmentCategories',
    load: 'EquipmentCategories',
    path: '/api/equipment-categories',
    row: { id: 'record', code: 'MED', name: 'Medical', isActive: false },
    display: { status: 'Inactive' },
  },
  {
    name: 'EquipmentItems',
    load: 'EquipmentItems',
    path: '/api/equipment-items',
    row: {
      id: 'record',
      equipmentCode: 'KIT',
      name: 'First Aid Kit',
      isActive: true,
    },
    display: { status: 'Active' },
  },
  {
    name: 'EquipmentAssets',
    load: 'EquipmentAssets',
    path: '/api/equipment-assets',
    row: { id: 'record', assetTag: 'A1', equipmentItemName: 'First Aid Kit' },
    display: { assetTag: 'A1' },
  },
  {
    name: 'EquipmentIssuances',
    load: 'EquipmentIssuances',
    path: '/api/equipment-issuances',
    row: { id: 'record', quantityIssued: 1 },
    display: { quantityIssued: 1 },
  },
  {
    name: 'Incidents',
    load: 'EquipmentIncidents',
    path: '/api/incidents',
    row: { id: 'record', incidentNo: 'INC1', description: 'Damage' },
    display: { incidentNo: 'INC1' },
  },
]

beforeEach(() => setActivePinia(createPinia()))
afterEach(() => vi.unstubAllGlobals())

const setup = async (contract: CollectionContract) => {
  const request = vi.fn().mockResolvedValue({
    items: [contract.row],
    page: 2,
    pageSize: 5,
    totalItems: 7,
    totalPages: 2,
  })
  vi.stubGlobal('$fetch', request)
  const load = modules[`/app/composables/use${contract.name}.ts`]
  if (!load) throw new Error(`Missing composable for ${contract.name}`)
  const exports = await load()
  const factory = exports[`use${contract.name}`]
  if (!factory) throw new Error(`Missing factory for ${contract.name}`)
  let page: Page | undefined
  const wrapper = mount(
    defineComponent({
      setup() {
        page = factory()
        return () => h('div')
      },
    }),
  )
  await flushPromises()
  if (!page) throw new Error(`Missing page for ${contract.name}`)
  const action = page[`load${contract.load}`] as Loader | undefined
  if (!action) throw new Error(`Missing list action for ${contract.name}`)
  request.mockClear()
  return { request, page, action, wrapper }
}

describe.each(contracts)('$name page data', (contract) => {
  it('loads a filtered page once, copies filters, and maps display rows', async () => {
    const { request, page, action, wrapper } = await setup(contract)
    try {
      const filters = { term: 'Unit' }
      await action(2, filters, 5)
      expect(request).toHaveBeenCalledExactlyOnceWith(
        `${contract.path}/search`,
        expect.objectContaining({
          method: 'GET',
          query: expect.objectContaining({
            page: 2,
            pageSize: 5,
            term: 'Unit',
          }),
        }),
      )
      expect(page.filters.value).toEqual(filters)
      expect(page.filters.value).not.toBe(filters)
      expect(page.tableRows.value).toEqual([
        expect.objectContaining({ id: 'record', ...contract.display }),
      ])
      expect(page.pagination.value).toMatchObject({
        page: 2,
        pageSize: 5,
        totalItems: 7,
      })
      expect(page.isLoading.value).toBe(false)
      if (page.hasActiveFilters) expect(page.hasActiveFilters.value).toBe(true)
      request.mockResolvedValue({
        items: [],
        page: 1,
        pageSize: 5,
        totalItems: 0,
        totalPages: 0,
      })
      await action(1, {}, 5)
      expect(page.tableRows.value).toEqual([])
      if (page.hasActiveFilters) expect(page.hasActiveFilters.value).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

  it('exposes request errors and clears stale rows after a failed load', async () => {
    const { request, page, action, wrapper } = await setup(contract)
    try {
      await action(1, {}, 5)
      const error = Object.assign(new Error('Load rejected'), {
        statusMessage: 'Load rejected',
      })
      request.mockRejectedValue(error)
      await action(1, {}, 5).catch((reason) => {
        expect(reason).toBe(error)
      })
      expect(page.error.value).toBe('Load rejected')
      expect(page.isLoading.value).toBe(false)
      expect(page.tableRows.value).toEqual([])
    } finally {
      wrapper.unmount()
    }
  })
})
