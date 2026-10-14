import { describe, expect, it } from 'vitest'
import { mapEquipmentAssignmentValue } from '@/server/shared/utils/equipment-accounting'
import { formatEquipmentPrice } from '@/app/utils/equipment-accounting'

describe('equipment valuation display', () => {
  it('distinguishes unknown prices from free equipment', () => {
    const row = {
      equipment_asset_id: 'asset', asset_tag: 'TAG-1', item_name: 'Radio', quantity: 1,
      personnel_id: null, company_id: null, battalion_id: null,
    }
    expect(mapEquipmentAssignmentValue({ ...row, acquisition_cost: null, assigned_value: null })).toMatchObject({
      unitPrice: null, assignedValue: null,
    })
    expect(mapEquipmentAssignmentValue({ ...row, acquisition_cost: '0.00', assigned_value: '0.00' })).toMatchObject({
      unitPrice: 0, assignedValue: 0,
    })
    expect(formatEquipmentPrice(null)).toBe('Not priced')
    expect(formatEquipmentPrice(0)).toContain('0.00')
    expect(formatEquipmentPrice(1234.5)).toContain('1,234.50')
  })
})
