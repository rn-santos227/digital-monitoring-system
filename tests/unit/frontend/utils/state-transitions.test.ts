import { describe, expect, it } from 'vitest'

import {
  applyPersonnelDeploymentTransition,
  applyPersonnelKpiDelta,
  isDeployedPersonnel,
} from '@/app/utils/personnel-state'
import {
  applyEquipmentAssetKpiDelta,
  applyEquipmentAssetStatusTransition,
  isIssuedEquipmentAsset,
} from '@/app/utils/equipment-asset-state'
import { updateEquipmentCategoryKpis } from '@/app/utils/equipment-category-state'
import { updateTrainingKpis } from '@/app/utils/training-state'
import {
  doesRankMatchSearch,
  recalculateRankPaginationTotals,
} from '@/app/utils/rank-state'
import type { PersonnelListCompactItem } from '@/app/types/domain/personnel'
import type { EquipmentAssetListItem } from '@/app/types/domain/equipment'

const deployed = { serviceStatus: ' Deployed ' } as PersonnelListCompactItem
const standby = { serviceStatus: 'Standby' } as PersonnelListCompactItem
const issued = { assetStatusName: 'Issued' } as EquipmentAssetListItem
const available = { assetStatusName: 'Available' } as EquipmentAssetListItem

describe('personnel KPI transitions', () => {
  const kpis = { totalPersonnel: 3, deployedPersonnel: 1 }

  it('recognizes deployed status and safely handles absent personnel', () => {
    expect(isDeployedPersonnel(deployed)).toBe(true)
    expect(isDeployedPersonnel(standby)).toBe(false)
    expect(isDeployedPersonnel(null)).toBe(false)
  })

  it('adds, removes, and clamps counts while preserving the source object', () => {
    expect(applyPersonnelKpiDelta(kpis, deployed, 1)).toMatchObject({
      totalPersonnel: 4,
      deployedPersonnel: 2,
    })
    expect(applyPersonnelKpiDelta(kpis, standby, -1)).toMatchObject({
      totalPersonnel: 2,
      deployedPersonnel: 1,
    })
    expect(
      applyPersonnelKpiDelta(
        { totalPersonnel: 0, deployedPersonnel: 0 },
        deployed,
        -1,
      ),
    ).toMatchObject({ totalPersonnel: 0, deployedPersonnel: 0 })
    expect(kpis).toEqual({ totalPersonnel: 3, deployedPersonnel: 1 })
  })

  it('updates only when the deployment status changes', () => {
    expect(applyPersonnelDeploymentTransition(kpis, deployed, deployed)).toBe(
      kpis,
    )
    expect(
      applyPersonnelDeploymentTransition(kpis, standby, deployed)
        .deployedPersonnel,
    ).toBe(2)
    expect(
      applyPersonnelDeploymentTransition(kpis, deployed, standby)
        .deployedPersonnel,
    ).toBe(0)
  })
})

describe('equipment KPI transitions', () => {
  const kpis = { totalAssets: 3, issuedAssets: 1, notIssuedAssets: 2 }

  it('recognizes issuance and safely handles absent assets', () => {
    expect(isIssuedEquipmentAsset(issued)).toBe(true)
    expect(isIssuedEquipmentAsset(available)).toBe(false)
    expect(isIssuedEquipmentAsset(undefined)).toBe(false)
  })

  it('adds and removes issued or available assets without negative totals', () => {
    expect(applyEquipmentAssetKpiDelta(kpis, issued, 1)).toEqual({
      totalAssets: 4,
      issuedAssets: 2,
      notIssuedAssets: 2,
    })
    expect(applyEquipmentAssetKpiDelta(kpis, available, -1)).toEqual({
      totalAssets: 2,
      issuedAssets: 1,
      notIssuedAssets: 1,
    })
    expect(
      applyEquipmentAssetKpiDelta(
        { totalAssets: 0, issuedAssets: 0, notIssuedAssets: 0 },
        issued,
        -1,
      ),
    ).toEqual({ totalAssets: 0, issuedAssets: 0, notIssuedAssets: 0 })
  })

  it('maintains the issued/available split through issuance transitions', () => {
    expect(
      applyEquipmentAssetStatusTransition(kpis, available, issued),
    ).toEqual({ totalAssets: 3, issuedAssets: 2, notIssuedAssets: 1 })
    expect(
      applyEquipmentAssetStatusTransition(kpis, issued, available),
    ).toEqual({ totalAssets: 3, issuedAssets: 0, notIssuedAssets: 3 })
    expect(applyEquipmentAssetStatusTransition(kpis, issued, issued)).toBe(kpis)
  })

  it('preserves unspecified counters and clamps replacement counters', () => {
    expect(
      updateEquipmentCategoryKpis(
        { totalCategories: 4, unusedCategories: 2 },
        { unusedCategories: -1 },
      ),
    ).toEqual({ totalCategories: 4, unusedCategories: 0 })
    expect(
      updateTrainingKpis(
        {
          totalRecords: 4,
          totalTrainings: 3,
          totalCategories: 2,
          unusedCategories: 1,
        },
        { totalRecords: -1, totalCategories: -2 },
      ),
    ).toEqual({
      totalRecords: 0,
      totalTrainings: 3,
      totalCategories: 0,
      unusedCategories: 1,
    })
    expect(
      updateTrainingKpis(
        {
          totalRecords: 4,
          totalTrainings: 3,
          totalCategories: 2,
          unusedCategories: 1,
        },
        { totalTrainings: -1, unusedCategories: -1 },
      ),
    ).toEqual({
      totalRecords: 4,
      totalTrainings: 0,
      totalCategories: 2,
      unusedCategories: 0,
    })
  })
})

describe('rank filtering and pagination', () => {
  it.each([
    ['', true],
    [' sg ', true],
    ['sergeant', true],
    ['captain', false],
  ])('matches rank search %s', (term, matches) => {
    expect(doesRankMatchSearch({ code: 'SGT', name: 'Sergeant' }, term)).toBe(
      matches,
    )
  })

  it('recalculates totals, clamps the page, and resets an empty list', () => {
    const pagination = { page: 3, pageSize: 10, totalItems: 30, totalPages: 3 }
    expect(recalculateRankPaginationTotals(pagination, 11)).toEqual({
      page: 2,
      pageSize: 10,
      totalItems: 11,
      totalPages: 2,
    })
    expect(recalculateRankPaginationTotals(pagination, 0)).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    })
    expect(pagination.page).toBe(3)
  })
})
