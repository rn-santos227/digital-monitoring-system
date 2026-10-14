import { describe, expect, it } from 'vitest'

import {
  mapEquipmentAssetListItem,
  mapEquipmentAssetSuggestionItem,
  mapEquipmentCategoryListItem,
  mapEquipmentCategorySuggestionItem,
  mapEquipmentIssuanceListItem,
  mapEquipmentItemListItem,
  mapEquipmentItemSuggestionItem,
  mapEquipmentItemPersonnelUsageListItem,
  mapEquipmentItemCompanyUsageListItems,
  mapEquipmentItemBattalionUsageListItems,
} from '@/server/shared/utils/equipment-management'
import { mapEquipmentIncidentListItem } from '@/server/shared/utils/incident-management'
import type { EquipmentItemPersonnelUsageRow } from '@/server/shared/models'
import {
  equipmentAssetFixture,
  equipmentItemFixture,
  incidentFixture,
} from '@/tests/helpers/equipment-fixtures'

describe('equipment list and suggestion mapping', () => {
  it('maps category capability flags and item stock fields', () => {
    const row = {
      id: 'category',
      code: 'COMMS',
      name: 'Communications',
      requires_serial: true,
      is_consumable: false,
      is_controlled: true,
      is_active: false,
      created_at: 'created',
      updated_at: 'updated',
    }
    expect(mapEquipmentCategoryListItem(row)).toMatchObject({
      requiresSerial: true,
      isConsumable: false,
      isControlled: true,
      isActive: false,
      createdAt: 'created',
    })
    expect(mapEquipmentCategorySuggestionItem(row)).toEqual({
      id: 'category',
      code: 'COMMS',
      name: 'Communications',
      isActive: false,
    })
    expect(mapEquipmentItemListItem(equipmentItemFixture)).toMatchObject({
      equipmentCode: 'EQ-01',
      categoryCode: 'COMMS',
      categoryName: 'Communications',
      minimumStockLevel: 0,
    })
  })

  it.each(['object', 'array', 'empty', 'null'] as const)(
    'handles %s category and status relations',
    (kind) => {
      const category = { id: 'category', code: 'COMMS', name: 'Communications' }
      const relation =
        kind === 'object'
          ? category
          : kind === 'array'
            ? [category]
            : kind === 'empty'
              ? []
              : null
      const expected =
        kind === 'object' || kind === 'array' ? 'Communications' : ''
      const item = { ...equipmentItemFixture, category: relation }
      expect(mapEquipmentItemListItem(item).categoryName).toBe(expected)
      expect(mapEquipmentItemSuggestionItem(item).categoryName).toBe(expected)
      const asset = {
        ...equipmentAssetFixture,
        condition_status: relation,
        serviceability_status: relation,
        asset_status: relation,
      }
      expect(mapEquipmentAssetListItem(asset)).toMatchObject({
        assetTag: 'AS-01',
        acquisitionCost: 0,
        conditionStatusName: expected || null,
        serviceabilityStatusName: expected || null,
        assetStatusName: expected,
      })
      const suggestion = {
        id: 'asset',
        asset_tag: 'AS-01',
        equipment_item: [{ name: 'Radio', category: relation }],
      }
      expect(mapEquipmentAssetSuggestionItem(suggestion)).toMatchObject({
        assetTag: 'AS-01',
        equipmentItemName: 'Radio',
        categoryName: expected,
      })
    },
  )

  it('uses safe labels when the asset item relation is absent', () => {
    expect(
      mapEquipmentAssetListItem({
        ...equipmentAssetFixture,
        equipment_item: [],
      }).equipmentItemName,
    ).toBe('')
    expect(
      mapEquipmentAssetSuggestionItem({
        id: 'asset',
        asset_tag: 'AS-01',
        equipment_item: null,
      }),
    ).toEqual({
      id: 'asset',
      assetTag: 'AS-01',
      equipmentItemName: '',
      categoryName: '',
    })
  })
})

describe('issuance and incident reference mapping', () => {
  const personnel = {
    id: 'person',
    personnel_code: 'P-01',
    first_name: 'Jane',
    middle_name: 'M',
    last_name: 'Doe',
  }
  const asset = {
    id: 'asset',
    asset_tag: 'AS-01',
    equipment_item: [{ id: 'item', equipment_code: 'EQ-01', name: 'Radio' }],
  }
  const deployment = {
    id: 'deployment',
    record_no: 'DR-01',
    operation_name: 'Operation',
    deployment_area: 'Area',
  }
  const status = { id: 'status', name: 'Open', code: 'OPEN' }

  it('maps nested equipment, personnel, and deployment references', () => {
    expect(
      mapEquipmentIncidentListItem({
        ...incidentFixture,
        equipment_asset: [asset],
        personnel: [personnel],
        deployment: [deployment],
        incident_type: [status],
        investigation_status: [status],
      }),
    ).toMatchObject({
      assetTag: 'AS-01',
      equipmentName: 'Radio',
      personnelName: 'Doe, Jane M',
      deploymentRecordNo: 'DR-01',
      investigationStatusName: 'Open',
    })
    const issuance = {
      id: 'issuance',
      issue_no: 'IS-01',
      equipment_asset_id: 'asset',
      issued_to_personnel_id: 'person',
      issued_by_personnel_id: 'person',
      deployment_id: 'deployment',
      status_id: 'status',
      created_at: 'created',
      equipment_asset: [asset],
      issued_to_personnel: [personnel],
      issued_by_personnel: personnel,
      deployment: [deployment],
      issuance_status: [status],
    }
    expect(mapEquipmentIssuanceListItem(issuance)).toMatchObject({
      equipmentAssetTag: 'AS-01',
      equipmentItemName: 'Radio',
      issuedToPersonnelName: 'Doe, Jane M (P-01)',
      deploymentLabel: 'Operation (Area)',
      quantityIssued: 0,
      issueDate: '',
      updatedAt: 'created',
    })
    expect(
      mapEquipmentIssuanceListItem({
        ...issuance,
        equipment_asset: [],
        issued_to_personnel: null,
        issued_by_personnel: { ...personnel, middle_name: null },
        deployment: null,
        issuance_status: null,
        issue_date: '2026-10-04',
        quantity_issued: 2,
      }),
    ).toMatchObject({
      equipmentAssetTag: '',
      issuedToPersonnelName: '',
      issuedByPersonnelName: 'Doe, Jane (P-01)',
      deploymentLabel: null,
      statusName: '',
      quantityIssued: 2,
    })
  })

  it('preserves nullable incident labels when relations are missing', () => {
    expect(mapEquipmentIncidentListItem(incidentFixture)).toMatchObject({
      assetTag: '',
      equipmentName: null,
      personnelName: null,
      incidentTypeName: null,
    })
    expect(
      mapEquipmentIncidentListItem({
        ...incidentFixture,
        equipment_asset: [],
        personnel: [],
        deployment: [],
        incident_type: [],
        investigation_status: [],
      }).personnelName,
    ).toBeNull()
  })
})

describe('equipment usage aggregation', () => {
  const battalion = { id: 'battalion', code: 'B-01', name: 'Battalion' }
  const company = {
    id: 'company',
    code: 'C-01',
    name: 'Company',
    battalion: [battalion],
  }
  const personnel = {
    id: 'person',
    personnel_code: 'P-01',
    service_number: 'SN-01',
    first_name: 'Jane',
    middle_name: null,
    last_name: 'Doe',
    rank: [{ name: 'Sergeant' }],
    company: [company],
    battalion: null,
    service_status: { name: 'Active Duty' },
  }
  const row: EquipmentItemPersonnelUsageRow = {
    id: 'issuance',
    issue_no: 'IS-01',
    issue_date: '2026-10-04',
    expected_return_date: null,
    actual_return_date: null,
    issuance_status: { name: 'Issued' },
    issued_to_personnel: [personnel],
  }

  it('deduplicates personnel while counting each issuance and retaining the latest date', () => {
    const rows = [
      row,
      { ...row, id: 'later', issue_date: '2026-10-05' },
      { ...row, id: 'earlier', issue_date: '2026-10-03' },
      { ...row, issued_to_personnel: null },
    ]
    expect(mapEquipmentItemPersonnelUsageListItem(row)).toMatchObject({
      fullName: 'Jane Doe',
      rankName: 'Sergeant',
      battalionName: 'Battalion',
    })
    expect(mapEquipmentItemCompanyUsageListItems(rows)).toEqual([
      {
        id: 'company',
        code: 'C-01',
        name: 'Company',
        battalionName: 'Battalion',
        personnelCount: 1,
        issuanceCount: 3,
        latestIssueDate: '2026-10-05',
      },
    ])
    expect(mapEquipmentItemBattalionUsageListItems(rows)).toEqual([
      {
        ...battalion,
        personnelCount: 1,
        issuanceCount: 3,
        latestIssueDate: '2026-10-05',
      },
    ])
    expect(
      mapEquipmentItemPersonnelUsageListItem({
        ...row,
        issued_to_personnel: null,
      }),
    ).toMatchObject({
      fullName: 'Unknown Personnel',
      personnelCode: 'N/A',
      rankName: 'N/A',
      serviceStatus: 'N/A',
    })
  })
})
