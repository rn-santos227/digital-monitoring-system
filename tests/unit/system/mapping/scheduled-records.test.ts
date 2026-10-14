import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  buildTrainingRecordNo,
  mapTrainingCategoryListItem,
  mapTrainingCategorySuggestionItem,
  mapTrainingListItem,
  mapTrainingRecordListItem,
  mapTrainingSuggestionItem,
} from '@/server/shared/utils/training-management'
import {
  mapEngagementListItem,
  mapEngagementRecordListItem,
  mapEngagementSuggestionItem,
  mapEngagementTypeListItem,
  mapEngagementTypeSuggestionItem,
} from '@/server/shared/utils/engagement-management'
import {
  mapDeploymentDetailListItem,
  mapDeploymentRecordListItem,
  mapDeploymentRecordSelectListItem,
  mapDeploymentSelectListItem,
} from '@/server/shared/utils/deployment-management'

const reference = { id: 'reference', name: 'Reference', code: 'REF' }
const common = {
  id: 'record',
  training_title: 'Training',
  engagement_title: 'Engagement',
  training_category_id: 'reference',
  engagement_type_id: 'reference',
  level_id: 'reference',
  start_date: '2026-10-04',
  end_date: null,
  status_id: 'reference',
  default_remarks: null,
  created_at: '2026-10-04',
  updated_at: '2026-10-05',
}
const scheduledRow = {
  ...common,
  training_category: reference,
  engagement_type: reference,
  level: reference,
  training_status: reference,
  engagement_status: reference,
}
const recordRow = {
  ...scheduledRow,
  record_no: 'TR-001',
  personnel_id: 'person',
  training_id: 'training',
  engagement_id: 'engagement',
  certificate_no: null,
  valid_until: null,
  remarks: null,
  personnel: {
    id: 'person',
    personnel_code: 'P-01',
    full_name: ' Full Name ',
    last_name: 'Doe',
    first_name: 'Jane',
    middle_name: 'M',
  },
}

describe('training and engagement mappings', () => {
  it('maps categories and type suggestions without losing timestamps', () => {
    const row = { ...reference, created_at: 'created', updated_at: 'updated' }
    expect(mapTrainingCategoryListItem(row)).toEqual({
      id: 'reference',
      code: 'REF',
      name: 'Reference',
      createdAt: 'created',
      updatedAt: 'updated',
    })
    expect(mapTrainingCategorySuggestionItem(row)).toEqual(reference)
    expect(mapEngagementTypeListItem(row)).toMatchObject({
      code: 'REF',
      createdAt: 'created',
    })
    expect(mapEngagementTypeSuggestionItem(row)).toEqual(reference)
  })

  it.each(['object', 'array', 'empty', 'null'] as const)(
    'handles %s relations in lists and suggestions',
    (kind) => {
      const relation =
        kind === 'object'
          ? reference
          : kind === 'array'
            ? [reference]
            : kind === 'empty'
              ? []
              : null
      const row = {
        ...common,
        training_category: relation,
        engagement_type: relation,
        level: relation,
        training_status: relation,
        engagement_status: relation,
      }
      const expectedName =
        kind === 'object' || kind === 'array' ? 'Reference' : null
      expect(mapTrainingListItem(row)).toMatchObject({
        id: 'record',
        trainingTitle: 'Training',
        trainingCategoryName: expectedName,
        levelName: expectedName,
        statusName: expectedName,
      })
      expect(mapTrainingSuggestionItem(row)).toMatchObject({
        trainingCategoryName: expectedName,
        statusName: expectedName,
      })
      expect(mapEngagementListItem(row)).toMatchObject({
        engagementTitle: 'Engagement',
        engagementCategoryName: expectedName,
        levelName: expectedName,
        statusName: expectedName,
      })
      expect(mapEngagementSuggestionItem(row)).toMatchObject({
        engagementCategoryName: expectedName,
        statusName: expectedName,
      })
    },
  )

  it.each([
    { personnel: recordRow.personnel, expected: 'Full Name' },
    {
      personnel: [
        {
          id: 'person',
          last_name: ' Doe ',
          first_name: ' Jane ',
          middle_name: ' M ',
        },
      ],
      expected: 'Doe, Jane M',
    },
    {
      personnel: [{ id: 'person', full_name: ' ', first_name: 'Jane' }],
      expected: 'Jane',
    },
    { personnel: { id: 'person' }, expected: null },
    { personnel: [], expected: null },
    { personnel: null, expected: null },
  ])('formats record personnel as $expected', ({ personnel, expected }) => {
    const row = { ...recordRow, personnel }
    expect(mapTrainingRecordListItem(row)).toMatchObject({
      recordNo: 'TR-001',
      personnelName: expected,
      trainingCategoryName: 'Reference',
    })
    expect(mapEngagementRecordListItem(row)).toMatchObject({
      recordNo: 'TR-001',
      personnelName: expected,
      engagementCategoryName: 'Reference',
    })
  })

  it('creates deterministic record identifiers with a timestamp and UUID suffix', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-04T12:30:45Z'))
    vi.stubGlobal('crypto', {
      randomUUID: () => 'abcdef12-0000-0000-0000-000000000000',
    })
    expect(buildTrainingRecordNo()).toMatch(/^TR-\d{14}-ABCDEF12$/)
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('deployment mappings', () => {
  const row = {
    id: 'deployment',
    record_no: 'DR-001',
    personnel_id: 'person',
    deployment_area: 'Area',
    deployment_area_latitude: 14,
    deployment_area_longitude: 121,
    assignment_role: 'Officer',
    operation_name: 'Operation',
    start_date: '2026-10-04',
    end_date: null,
    status_id: 'status',
    location: null,
    supervisor_id: null,
    remarks: null,
    created_at: 'created',
    updated_at: 'updated',
    personnel: recordRow.personnel,
    supervisor: { id: 'supervisor', first_name: 'Sam', last_name: 'Doe' },
    deployment_status: reference,
  }

  it('maps records, details, and select-only rows with appropriate fallbacks', () => {
    expect(mapDeploymentRecordListItem(row)).toMatchObject({
      recordNo: 'DR-001',
      personnelName: 'Full Name',
      supervisorId: 'supervisor',
      supervisorName: 'Doe, Sam',
      statusName: 'Reference',
    })
    expect(
      mapDeploymentDetailListItem({ ...row, default_remarks: 'Default' }),
    ).toMatchObject({
      recordNo: '',
      personnelId: '',
      remarks: 'Default',
      createdAt: '',
    })
    expect(
      mapDeploymentRecordSelectListItem({ ...row, record_no: undefined }),
    ).toMatchObject({ recordNo: '', statusId: '', personnelName: null })
    expect(mapDeploymentSelectListItem(row)).toMatchObject({
      deploymentArea: 'Area',
      statusName: 'Reference',
    })
  })

  it('normalizes arrays and missing personnel, supervisor, and status references', () => {
    expect(
      mapDeploymentRecordListItem({
        ...row,
        personnel: [{ first_name: 'Jane' }],
        supervisor: [{ full_name: 'Supervisor' }],
        deployment_status: [reference],
      }),
    ).toMatchObject({
      personnelName: 'Jane',
      supervisorName: 'Supervisor',
      statusName: 'Reference',
    })
    expect(
      mapDeploymentRecordListItem({
        ...row,
        record_no: undefined,
        personnel: [],
        supervisor: null,
        deployment_status: [],
      }),
    ).toMatchObject({
      recordNo: '',
      personnelName: null,
      supervisorName: null,
      supervisorId: null,
      statusName: null,
    })
    expect(
      mapDeploymentRecordListItem({ ...row, personnel: {}, supervisor: {} }),
    ).toMatchObject({ personnelName: null, supervisorName: null })
  })
})
