import { describe, expect, it } from 'vitest'

import { mapPersonnelTrainingRecordListItem } from '@/server/shared/utils/personnel-training'
import { mapPersonnelEngagementRecordListItem } from '@/server/shared/utils/personnel-engagement'
import {
  mapPersonnelDeploymentLocationItem,
  mapPersonnelDeploymentRecordListItem,
} from '@/server/shared/utils/personnel-deployment'
import { mapPersonnelEquipmentIssuanceListItem } from '@/server/shared/utils/personnel-equipment'
import { withPersonnelId } from '@/server/shared/utils/personnel-record-assignment'

describe('linked personnel record mapping', () => {
  it.each(['object', 'array', 'empty', 'null'] as const)(
    'normalizes %s relation values across record domains',
    (kind) => {
      const reference = { name: 'Reference' }
      const relation =
        kind === 'object'
          ? reference
          : kind === 'array'
            ? [reference]
            : kind === 'empty'
              ? []
              : null
      const name =
        kind === 'object' || kind === 'array' ? 'Reference' : 'Unknown'
      const common = {
        id: 'record',
        start_date: '2026-10-04',
        end_date: null,
        remarks: null,
      }
      expect(
        mapPersonnelTrainingRecordListItem({
          ...common,
          training_title: 'Training',
          valid_until: null,
          training_category: relation,
          training_status: relation,
        }),
      ).toMatchObject({
        title: 'Training',
        status: name,
        category: name === 'Unknown' ? null : name,
      })
      expect(
        mapPersonnelEngagementRecordListItem({
          ...common,
          engagement_title: 'Engagement',
          engagement_type: relation,
          engagement_status: relation,
        }),
      ).toMatchObject({ title: 'Engagement', status: name, type: name })
      expect(
        mapPersonnelDeploymentRecordListItem({
          ...common,
          deployment_area: 'Area',
          operation_name: null,
          location: null,
          assignment_role: null,
          deployment_status: relation,
        }),
      ).toMatchObject({ deploymentArea: 'Area', status: name })
      const asset = { asset_tag: 'AS-01', equipment_item: relation }
      const assetRelation =
        kind === 'object'
          ? asset
          : kind === 'array'
            ? [asset]
            : kind === 'empty'
              ? []
              : null
      expect(
        mapPersonnelEquipmentIssuanceListItem({
          id: 'record',
          issue_no: 'IS-01',
          issue_date: '2026-10-04',
          expected_return_date: null,
          actual_return_date: null,
          issue_purpose: null,
          issuance_status: relation,
          equipment_asset: assetRelation,
        }),
      ).toMatchObject({
        status: name,
        equipmentItemName: name,
        assetTag: name === 'Unknown' ? 'Unknown' : 'AS-01',
      })
    },
  )

  it.each([
    { personnel: { full_name: ' Full Name ' }, expected: 'Full Name' },
    {
      personnel: [
        { first_name: 'Jane', middle_name: 'Maria', last_name: 'Doe' },
      ],
      expected: 'Jane M. Doe',
    },
    { personnel: { first_name: 'Jane' }, expected: 'Jane' },
    { personnel: {}, expected: null },
    { personnel: [], expected: null },
    { personnel: null, expected: null },
  ])('formats map personnel as $expected', ({ personnel, expected }) => {
    expect(
      mapPersonnelDeploymentLocationItem({
        personnel_id: 'person',
        operation_name: null,
        deployment_area: 'Area',
        deployment_area_latitude: 14,
        deployment_area_longitude: 121,
        personnel,
      }),
    ).toEqual({
      personnelId: 'person',
      personnelName: expected,
      operationName: null,
      deploymentArea: 'Area',
      latitude: 14,
      longitude: 121,
    })
  })

  it('copies assignment bodies and applies the route personnel id', () => {
    const body = { personnelId: 'wrong', remarks: 'Test' }
    expect(withPersonnelId(body, 'correct')).toEqual({
      personnelId: 'correct',
      remarks: 'Test',
    })
    expect(body.personnelId).toBe('wrong')
  })
})
