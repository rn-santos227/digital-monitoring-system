import { describe, expect, it } from 'vitest'
import { createSupabaseMock } from '@/tests/helpers/supabase'
import { fetchEquipmentAccounting } from '@/server/utils/equipment-accounting/fetchEquipmentAccounting'
import { parseEquipmentAccountingQuery } from '@/server/shared/validation/domain/equipment-accounting'
import { buildEquipmentAssetUpdates, parseCreateEquipmentAssetPayload } from '@/server/shared/validation/domain/equipment-management'
import type { EquipmentAccountingSubject } from '@/server/shared/models'
import { parseBulkUpdateItems } from '@/server/shared/utils/bulk-management'
import { validateEquipmentBulkUpdate } from '@/app/utils/bulk-management-validation'

const subjectId = '11111111-1111-4111-8111-111111111111'

describe('assigned equipment valuation', () => {
  it.each([
    ['personnel', 'personnel', 'personnel_id'],
    ['company', 'companies', 'company_id'],
    ['battalion', 'battalions', 'battalion_id'],
  ] as const)('restricts %s valuation to the requested owner and keeps all-page totals', async (subject, table, column) => {
    const mock = createSupabaseMock([
      { data: { id: subjectId }, error: null },
      { data: { asset_count: '26', quantity: '30', unpriced_asset_count: '2', total_value: '100001.25' }, error: null },
      {
        data: [{
          equipment_asset_id: 'asset-1', asset_tag: 'TAG-1', item_name: 'Radio',
          acquisition_cost: '1250.50', quantity: 3, assigned_value: '3751.50',
          personnel_id: subjectId, company_id: subjectId, battalion_id: subjectId,
        }],
        error: null,
        count: 26,
      },
    ])
    const result = await fetchEquipmentAccounting(mock.client, subject, subjectId, 10, 19)
    expect(mock.calls).toContainEqual({ table, method: 'eq', args: ['id', subjectId] })
    expect(mock.calls).toContainEqual({ table: 'vw_equipment_assignment_values', method: 'eq', args: [column, subjectId] })
    expect(mock.calls).toContainEqual({ table: 'vw_equipment_assignment_values', method: 'range', args: [10, 19] })
    expect(mock.calls).toContainEqual({ table: 'vw_equipment_assignment_value_totals', method: 'eq', args: ['subject_type', subject] })
    expect(mock.calls.filter((call) => call.table === 'vw_equipment_assignment_value_totals' && call.method === 'range')).toHaveLength(0)
    expect(result.summary).toEqual({ assetCount: 26, quantity: 30, unpricedAssetCount: 2, totalValue: 100001.25 })
    expect(result.totalItems).toBe(26)
    expect(result.items[0]).toMatchObject({ unitPrice: 1250.5, quantity: 3, assignedValue: 3751.5 })
  })

  it('returns a zero summary for an owner without equipment', async () => {
    const mock = createSupabaseMock([
      { data: { id: subjectId }, error: null },
      { data: null, error: null },
      { data: [], error: null, count: 0 },
    ])
    expect(await fetchEquipmentAccounting(mock.client, 'personnel', subjectId, 0, 9)).toEqual({
      summary: { assetCount: 0, quantity: 0, unpricedAssetCount: 0, totalValue: 0 },
      items: [], totalItems: 0,
    })
  })

  it('rejects missing owners before querying their holdings', async () => {
    const mock = createSupabaseMock([{ data: null, error: null }])
    await expect(fetchEquipmentAccounting(mock.client, 'company', subjectId, 0, 9)).rejects.toMatchObject({ statusCode: 404 })
    expect(mock.from).toHaveBeenCalledTimes(1)
  })

  it('surfaces valuation query failures instead of reporting a zero balance', async () => {
    const mock = createSupabaseMock([
      { data: { id: subjectId }, error: null },
      { data: null, error: { message: 'View missing' } },
      { data: [], error: null, count: 0 },
    ])
    await expect(fetchEquipmentAccounting(mock.client, 'battalion', subjectId, 0, 9)).rejects.toThrow('View missing')
  })

  it.each(['personnel', 'company', 'battalion'] as EquipmentAccountingSubject[])('parses %s scope and pagination', (subject) => {
    expect(parseEquipmentAccountingQuery({ subject, subjectId, page: '2', pageSize: '25' })).toMatchObject({
      subject, subjectId, page: 2, pageSize: 25, rangeFrom: 25, rangeTo: 49,
    })
  })

  it.each([
    { subject: 'users', subjectId },
    { subject: 'personnel', subjectId: '' },
    { subject: 'company', subjectId: 'bad-id' },
  ])('rejects invalid scope %j', (query) => {
    expect(() => parseEquipmentAccountingQuery(query)).toThrow()
  })
})

describe('PHP equipment prices', () => {
  const requiredAssetFields = { assetTag: 'TAG-1', equipmentItemId: 'item-1', assetStatusId: 'status-1' }

  it.each([null, 0, 0.01, 1250.5, 999999999999.99])('preserves valid price %s in create and update', (acquisitionCost) => {
    expect(parseCreateEquipmentAssetPayload({ ...requiredAssetFields, acquisitionCost }).acquisition_cost).toBe(acquisitionCost)
    expect(buildEquipmentAssetUpdates({ acquisitionCost }).acquisition_cost).toBe(acquisitionCost)
  })

  it.each([-1, 1.001, 1000000000000, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid price %s in create and update', (acquisitionCost) => {
    expect(() => parseCreateEquipmentAssetPayload({ ...requiredAssetFields, acquisitionCost })).toThrow('Acquisition cost')
    expect(() => buildEquipmentAssetUpdates({ acquisitionCost })).toThrow('Acquisition cost')
  })

  it.each([null, 0, 12.34])('preserves nullable and zero prices in bulk updates: %s', (acquisitionCost) => {
    expect(parseBulkUpdateItems([{ id: 'asset', updates: { acquisition_cost: acquisitionCost } }], ['acquisition_cost'])).toHaveLength(1)
    expect(validateEquipmentBulkUpdate({
      enabled: { acquisition_cost: true }, values: { acquisition_cost: acquisitionCost }, numericFields: ['acquisition_cost'],
    }).payload).toEqual({ acquisition_cost: acquisitionCost })
  })

  it('rejects a fractional-cent price in bulk updates', () => {
    expect(() => parseBulkUpdateItems([{ id: 'asset', updates: { acquisition_cost: 1.001 } }], ['acquisition_cost'])).toThrow('Acquisition cost')
    expect(validateEquipmentBulkUpdate({
      enabled: { acquisition_cost: true }, values: { acquisition_cost: 1.001 }, numericFields: ['acquisition_cost'],
    }).payload).toBeNull()
  })
})
